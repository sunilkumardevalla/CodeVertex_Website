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
    return json(202, { ok: true, deduped: true });
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

  console.log('[cv-crm-intake]', JSON.stringify(record));
  return json(202, { ok: true, lead_id: leadId, route: 'crm' });
};
