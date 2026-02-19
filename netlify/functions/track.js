'use strict';

const { json, parseBody, sanitizePayload, getIp, checkRateLimit } = require('./_common');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  const ip = getIp(event);
  if (!checkRateLimit(ip, 60_000, 90)) return json(429, { error: 'rate_limited' });

  const payload = sanitizePayload(parseBody(event));
  const eventName = String(payload.event || '').slice(0, 80);
  if (!eventName) return json(400, { error: 'invalid_event' });

  const out = {
    event: eventName,
    page: payload.page || '',
    ts: payload.ts || new Date().toISOString(),
    source_ip: ip,
    meta: Object.fromEntries(
      Object.entries(payload).filter(([k]) => !['event', 'page', 'ts'].includes(k)).slice(0, 30)
    )
  };

  console.log('[cv-track]', JSON.stringify(out));
  return json(202, { ok: true });
};
