'use strict';

const {
  makeRequestId,
  getOrigin,
  isAllowedOrigin,
  apiHeaders,
  json,
  options,
  parseBody,
  sanitizePayload,
  getIp,
  checkRateLimit
} = require('./_common');

exports.handler = async (event) => {
  const requestId = makeRequestId();
  const origin = getOrigin(event);

  if (event.httpMethod === 'OPTIONS') return options(requestId, origin);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed', request_id: requestId }, apiHeaders(requestId, origin));
  if (!isAllowedOrigin(origin)) return json(403, { error: 'origin_not_allowed', request_id: requestId }, apiHeaders(requestId, origin));

  const ip = getIp(event);
  if (!checkRateLimit(ip, 60_000, 90)) return json(429, { error: 'rate_limited', request_id: requestId }, apiHeaders(requestId, origin));

  const payload = sanitizePayload(parseBody(event));
  const eventName = String(payload.event || '').slice(0, 80);
  if (!eventName) return json(400, { error: 'invalid_event', request_id: requestId }, apiHeaders(requestId, origin));

  const out = {
    event: eventName,
    page: payload.page || '',
    ts: payload.ts || new Date().toISOString(),
    source_ip: ip,
    meta: Object.fromEntries(
      Object.entries(payload).filter(([k]) => !['event', 'page', 'ts'].includes(k)).slice(0, 30)
    )
  };

  console.log('[cv-track]', JSON.stringify({ request_id: requestId, ...out }));
  return json(202, { ok: true, request_id: requestId }, apiHeaders(requestId, origin));
};
