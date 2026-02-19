'use strict';

const crypto = require('crypto');
const {
  makeRequestId,
  getOrigin,
  isAllowedOrigin,
  apiHeaders,
  json,
  options,
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
  const requestId = makeRequestId();
  const origin = getOrigin(event);

  if (event.httpMethod === 'OPTIONS') return options(requestId, origin);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed', request_id: requestId }, apiHeaders(requestId, origin));
  if (!isAllowedOrigin(origin)) return json(403, { error: 'origin_not_allowed', request_id: requestId }, apiHeaders(requestId, origin));

  const ip = getIp(event);
  if (!checkRateLimit(ip, 60_000, 40)) return json(429, { error: 'rate_limited', request_id: requestId }, apiHeaders(requestId, origin));

  const secret = process.env.CV_WEBHOOK_SIGNING_SECRET || '';
  if (!verifySignature(event, secret)) return json(401, { error: 'invalid_signature', request_id: requestId }, apiHeaders(requestId, origin));

  const payload = sanitizePayload(parseBody(event));
  const email = normalizeString(payload.email, 320).toLowerCase();
  const formName = normalizeString(payload.form_name || payload.form || 'newsletter-subscribe', 64);

  if (!isEmail(email)) return json(400, { error: 'invalid_email', request_id: requestId }, apiHeaders(requestId, origin));

  const dedupeKey = `mkt:${formName}:${email}`;
  if (checkDuplicate(dedupeKey, 10 * 60_000)) {
    return json(202, { ok: true, deduped: true, route: 'marketing', request_id: requestId }, apiHeaders(requestId, origin));
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
  console.log('[cv-marketing-intake]', JSON.stringify({ request_id: requestId, ...record, delivery }));

  const failHard = String(process.env.CV_FAIL_ON_ROUTING_ERROR || '').toLowerCase() === 'true';
  if (!delivery.routed && failHard) {
    return json(502, { error: 'downstream_delivery_failed', subscriber_id: subscriberId, routing_id: delivery.routing_id, request_id: requestId }, apiHeaders(requestId, origin));
  }

  return json(202, {
    ok: true,
    subscriber_id: subscriberId,
    route: 'marketing',
    routing_id: delivery.routing_id,
    routed: delivery.routed,
    priority: delivery.priority,
    dead_letter: delivery.dead_letter,
    request_id: requestId
  }, apiHeaders(requestId, origin));
};
