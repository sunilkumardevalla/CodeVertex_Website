'use strict';

const crypto = require('crypto');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeUrl = (value) => {
  const v = String(value || '').trim();
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) return '';
  return v;
};

const routePriority = (channel, payload) => {
  const tier = String(payload.lead_tier || '').toLowerCase();
  const priority = String(payload.lead_priority || '').toLowerCase();
  const score = Number(payload.lead_score || 0);

  if (channel === 'crm') {
    if (tier === 'enterprise' || priority === 'high' || score >= 85) return 'enterprise';
    if (tier === 'growth' || score >= 55) return 'growth';
    return 'standard';
  }

  if (channel === 'marketing') {
    const action = String(payload.preference_action || '').toLowerCase();
    if (action.includes('unsubscribe') || action.includes('pause')) return 'urgent';
    return 'standard';
  }

  return 'standard';
};

const getDestinations = (channel, priority) => {
  if (channel === 'crm') {
    const enterprise = [
      normalizeUrl(process.env.CV_CRM_ENTERPRISE_WEBHOOK),
      normalizeUrl(process.env.CV_CRM_PRIMARY_WEBHOOK),
      normalizeUrl(process.env.CV_CRM_SECONDARY_WEBHOOK)
    ].filter(Boolean);
    const growth = [
      normalizeUrl(process.env.CV_CRM_PRIMARY_WEBHOOK),
      normalizeUrl(process.env.CV_CRM_SECONDARY_WEBHOOK)
    ].filter(Boolean);
    const standard = [
      normalizeUrl(process.env.CV_CRM_PRIMARY_WEBHOOK),
      normalizeUrl(process.env.CV_CRM_SECONDARY_WEBHOOK)
    ].filter(Boolean);
    if (priority === 'enterprise' && enterprise.length) return enterprise;
    if (priority === 'growth' && growth.length) return growth;
    return standard;
  }

  if (channel === 'marketing') {
    const urgent = [
      normalizeUrl(process.env.CV_MARKETING_URGENT_WEBHOOK),
      normalizeUrl(process.env.CV_MARKETING_PRIMARY_WEBHOOK),
      normalizeUrl(process.env.CV_MARKETING_SECONDARY_WEBHOOK)
    ].filter(Boolean);
    const standard = [
      normalizeUrl(process.env.CV_MARKETING_PRIMARY_WEBHOOK),
      normalizeUrl(process.env.CV_MARKETING_SECONDARY_WEBHOOK)
    ].filter(Boolean);
    if (priority === 'urgent' && urgent.length) return urgent;
    return standard;
  }

  return [];
};

const signPayload = (body, secret) => {
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
};

const postJson = async (url, payload, timeoutMs = 7000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const body = JSON.stringify(payload);
    const signature = signPayload(body, process.env.CV_DOWNSTREAM_SIGNING_SECRET || '');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(signature ? { 'x-cv-signature': signature } : {})
      },
      body,
      signal: controller.signal
    });
    const text = await res.text().catch(() => '');
    return { ok: res.ok, status: res.status, body: text.slice(0, 500) };
  } catch (err) {
    return { ok: false, status: 0, error: String(err && err.message ? err.message : err) };
  } finally {
    clearTimeout(timer);
  }
};

const deliverWithRetry = async (destinations, envelope) => {
  const attempts = Math.max(1, Number(process.env.CV_ROUTER_MAX_ATTEMPTS || 3));
  const baseDelay = Math.max(150, Number(process.env.CV_ROUTER_BASE_DELAY_MS || 400));
  const logs = [];

  for (const destination of destinations) {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const result = await postJson(destination, envelope);
      logs.push({ destination, attempt, ...result });
      if (result.ok) return { delivered: true, destination, logs };
      if (attempt < attempts) await sleep(baseDelay * attempt);
    }
  }

  return { delivered: false, destination: '', logs };
};

const deadLetter = async (envelope, deliveryLogs) => {
  const dlq = normalizeUrl(process.env.CV_DEAD_LETTER_WEBHOOK);
  const payload = {
    type: 'lead_dead_letter',
    ts: new Date().toISOString(),
    envelope,
    delivery_logs: deliveryLogs
  };

  if (!dlq) {
    console.error('[cv-router][dead-letter][local]', JSON.stringify(payload));
    return { queued: false, mode: 'log-only' };
  }

  const result = await postJson(dlq, payload, 8000);
  if (result.ok) return { queued: true, mode: 'webhook' };

  console.error('[cv-router][dead-letter][failed]', JSON.stringify({ payload, result }));
  return { queued: false, mode: 'webhook-failed' };
};

const routeLead = async ({ channel, payload, leadId, sourceIp }) => {
  const priority = routePriority(channel, payload);
  const destinations = getDestinations(channel, priority);
  const routingId = crypto.createHash('sha256').update(`${channel}:${leadId}:${Date.now()}`).digest('hex').slice(0, 18);

  const envelope = {
    routing_id: routingId,
    lead_id: leadId,
    channel,
    priority,
    source_ip: sourceIp,
    received_at: new Date().toISOString(),
    payload
  };

  if (!destinations.length) {
    const dlq = await deadLetter(envelope, [{ reason: 'no_destination_configured' }]);
    return {
      routed: false,
      routing_id: routingId,
      priority,
      destination: '',
      dead_letter: dlq,
      attempts: [{ reason: 'no_destination_configured' }]
    };
  }

  const delivery = await deliverWithRetry(destinations, envelope);
  if (delivery.delivered) {
    console.log('[cv-router][delivered]', JSON.stringify({ routing_id: routingId, channel, priority, destination: delivery.destination }));
    return {
      routed: true,
      routing_id: routingId,
      priority,
      destination: delivery.destination,
      dead_letter: null,
      attempts: delivery.logs
    };
  }

  const dlq = await deadLetter(envelope, delivery.logs);
  console.error('[cv-router][delivery-failed]', JSON.stringify({ routing_id: routingId, channel, priority, dead_letter: dlq.mode }));

  return {
    routed: false,
    routing_id: routingId,
    priority,
    destination: '',
    dead_letter: dlq,
    attempts: delivery.logs
  };
};

module.exports = { routeLead };
