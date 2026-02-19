'use strict';

const crypto = require('crypto');

const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers
  },
  body: JSON.stringify(body)
});

const parseBody = (event) => {
  if (!event || !event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (_err) {
    return {};
  }
};

const normalizeString = (value, max = 4000) => {
  const cleaned = String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  return cleaned.slice(0, max);
};

const sanitizePayload = (input) => {
  const out = {};
  Object.entries(input || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      out[key] = value.map((v) => normalizeString(v, 512));
      return;
    }
    if (value && typeof value === 'object') return;
    out[key] = normalizeString(value, 2048);
  });
  return out;
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));

const getIp = (event) =>
  event?.headers?.['x-nf-client-connection-ip'] ||
  event?.headers?.['x-forwarded-for'] ||
  event?.headers?.['client-ip'] ||
  'unknown';

const verifySignature = (event, secret) => {
  if (!secret) return true;
  const provided = event?.headers?.['x-cv-signature'] || event?.headers?.['X-CV-Signature'];
  if (!provided || !event?.body) return false;
  const expected = crypto.createHmac('sha256', secret).update(event.body).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch (_err) {
    return false;
  }
};

const getMaps = () => {
  if (!global.__cvRateMap) global.__cvRateMap = new Map();
  if (!global.__cvDedupMap) global.__cvDedupMap = new Map();
  return { rate: global.__cvRateMap, dedup: global.__cvDedupMap };
};

const checkRateLimit = (ip, windowMs = 60_000, maxHits = 30) => {
  const { rate } = getMaps();
  const now = Date.now();
  const entry = rate.get(ip) || { hits: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.hits = 0;
    entry.resetAt = now + windowMs;
  }
  entry.hits += 1;
  rate.set(ip, entry);
  return entry.hits <= maxHits;
};

const checkDuplicate = (key, windowMs = 5 * 60_000) => {
  const { dedup } = getMaps();
  const now = Date.now();
  const seenAt = dedup.get(key);
  if (seenAt && now - seenAt < windowMs) return true;
  dedup.set(key, now);
  return false;
};

module.exports = {
  json,
  parseBody,
  normalizeString,
  sanitizePayload,
  isEmail,
  getIp,
  verifySignature,
  checkRateLimit,
  checkDuplicate
};
