'use strict';

const crypto = require('crypto');
const {
  json,
  parseBody,
  sanitizePayload,
  normalizeString,
  isEmail,
  getIp,
  verifySignature,
  checkRateLimit,
  checkDuplicate
} = require('./_common');
const { routeLead } = require('./_lead-router');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  const ip = getIp(event);
  if (!checkRateLimit(ip, 60_000, 40)) return json(429, { error: 'rate_limited' });

  const secret = process.env.CV_WEBHOOK_SIGNING_SECRET || '';
  if (!verifySignature(event, secret)) return json(401, { error: 'invalid_signature' });

  const payload = sanitizePayload(parseBody(event));
  const email = normalizeString(payload.email, 320).toLowerCase();
  const formName = normalizeString(payload.form_name || payload.form || 'newsletter-subscribe', 64);

  if (!isEmail(email)) return json(400, { error: 'invalid_email' });

  const dedupeKey = `mkt:${formName}:${email}`;
  if (checkDuplicate(dedupeKey, 10 * 60_000)) {
    return json(202, { ok: true, deduped: true, route: 'marketing' });
  }

  const subscriberId = crypto.createHash('sha256').update(`${email}:${Date.now()}:${Math.random()}`).digest('hex').slice(0, 20);

  const record = {
    subscriber_id: subscriberId,
    route: 'marketing',
    email,
    segment: normalizeString(payload.segment, 120),
    consent: normalizeString(payload.consent || 'unknown', 48),
    form_name: formName,
    source_ip: ip,
    created_at: new Date().toISOString(),
    payload
  };

  const delivery = await routeLead({ channel: 'marketing', payload: record, leadId: subscriberId, sourceIp: ip });
  console.log('[cv-marketing-intake]', JSON.stringify({ ...record, delivery }));

  const failHard = String(process.env.CV_FAIL_ON_ROUTING_ERROR || '').toLowerCase() === 'true';
  if (!delivery.routed && failHard) {
    return json(502, { error: 'downstream_delivery_failed', subscriber_id: subscriberId, routing_id: delivery.routing_id });
  }

  return json(202, {
    ok: true,
    subscriber_id: subscriberId,
    route: 'marketing',
    routing_id: delivery.routing_id,
    routed: delivery.routed,
    priority: delivery.priority,
    dead_letter: delivery.dead_letter
  });
};
