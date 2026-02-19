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
  if (!checkRateLimit(ip, 60_000, 30)) return json(429, { error: 'rate_limited' });

  const secret = process.env.CV_WEBHOOK_SIGNING_SECRET || '';
  if (!verifySignature(event, secret)) return json(401, { error: 'invalid_signature' });

  const payload = sanitizePayload(parseBody(event));
  const email = normalizeString(payload.email, 320).toLowerCase();
  const formName = normalizeString(payload.form_name || payload.form || 'contact', 64);

  if (!isEmail(email)) return json(400, { error: 'invalid_email' });

  const dedupeKey = `crm:${formName}:${email}`;
  if (checkDuplicate(dedupeKey, 5 * 60_000)) {
    return json(202, { ok: true, deduped: true, route: 'crm' });
  }

  const leadTier = normalizeString(payload.lead_tier || 'standard', 32);
  const leadId = crypto.createHash('sha256').update(`${email}:${Date.now()}:${Math.random()}`).digest('hex').slice(0, 20);

  const record = {
    lead_id: leadId,
    route: 'crm',
    email,
    name: normalizeString(payload.name, 180),
    company: normalizeString(payload.company, 180),
    form_name: formName,
    lead_tier: leadTier,
    source_ip: ip,
    created_at: new Date().toISOString(),
    payload
  };

  const delivery = await routeLead({ channel: 'crm', payload: record, leadId, sourceIp: ip });
  console.log('[cv-crm-intake]', JSON.stringify({ ...record, delivery }));

  const failHard = String(process.env.CV_FAIL_ON_ROUTING_ERROR || '').toLowerCase() === 'true';
  if (!delivery.routed && failHard) {
    return json(502, { error: 'downstream_delivery_failed', lead_id: leadId, routing_id: delivery.routing_id });
  }

  return json(202, {
    ok: true,
    lead_id: leadId,
    route: 'crm',
    routing_id: delivery.routing_id,
    routed: delivery.routed,
    priority: delivery.priority,
    dead_letter: delivery.dead_letter
  });
};
