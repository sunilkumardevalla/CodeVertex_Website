const textEncoder = new TextEncoder();

const getRateMap = () => {
  if (!globalThis.__cvRateMap) globalThis.__cvRateMap = new Map();
  return globalThis.__cvRateMap;
};

const getDedupMap = () => {
  if (!globalThis.__cvDedupMap) globalThis.__cvDedupMap = new Map();
  return globalThis.__cvDedupMap;
};

export const makeRequestId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(9));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

export const getOrigin = (request) => request.headers.get("origin") || "";

export const getAllowedOrigins = (env) => {
  const raw =
    String(env?.CV_ALLOWED_ORIGINS || "").trim() ||
    "https://codevertex.io,https://www.codevertex.io,http://localhost:8888,http://localhost:3000";

  return raw
    .split(",")
    .map((v) => String(v || "").trim())
    .filter(Boolean);
};

export const isAllowedOrigin = (origin, env) => {
  if (!origin) return true;
  return getAllowedOrigins(env).includes(origin);
};

export const apiHeaders = (requestId, origin, env, allowMethods = "POST, OPTIONS") => {
  const allowOrigin = isAllowedOrigin(origin, env)
    ? origin || "https://codevertex.io"
    : "https://codevertex.io";

  return {
    "x-request-id": requestId,
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "permissions-policy": "geolocation=(), microphone=(), camera=()",
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": allowMethods,
    "access-control-allow-headers": "content-type, x-cv-signature",
    vary: "origin"
  };
};

export const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers
    }
  });

export const options = (requestId, origin, env, allowMethods = "POST, OPTIONS") =>
  new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
      ...apiHeaders(requestId, origin, env, allowMethods)
    }
  });

export const parseJsonBody = async (request) => {
  const raw = await request.text();
  if (!raw) return { raw: "", data: {} };
  try {
    return { raw, data: JSON.parse(raw) };
  } catch {
    return { raw, data: {} };
  }
};

export const normalizeString = (value, max = 4000) => {
  const cleaned = String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return cleaned.slice(0, max);
};

export const sanitizePayload = (input) => {
  const out = {};
  Object.entries(input || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      out[key] = value.map((v) => normalizeString(v, 512));
      return;
    }
    if (value && typeof value === "object") return;
    out[key] = normalizeString(value, 2048);
  });
  return out;
};

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ""));

export const getIp = (request) => {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("client-ip") || "unknown";
};

const hmacHex = async (secret, payload) => {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payload));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
};

const safeEqualHex = (a, b) => {
  const aa = String(a || "").trim().toLowerCase();
  const bb = String(b || "").trim().toLowerCase();
  if (!aa || !bb || aa.length !== bb.length) return false;
  let mismatch = 0;
  for (let i = 0; i < aa.length; i += 1) mismatch |= aa.charCodeAt(i) ^ bb.charCodeAt(i);
  return mismatch === 0;
};

export const verifySignature = async (rawBody, providedSignature, secret) => {
  const normalizedSecret = String(secret || "").trim();
  if (!normalizedSecret) return true;

  const provided = String(providedSignature || "").trim();
  if (!provided) return true;
  if (!rawBody) return false;

  const expected = await hmacHex(normalizedSecret, rawBody);
  return safeEqualHex(provided, expected);
};

export const checkRateLimit = (ip, windowMs = 60_000, maxHits = 30) => {
  const rate = getRateMap();
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

export const checkDuplicate = (key, windowMs = 5 * 60_000) => {
  const dedup = getDedupMap();
  const now = Date.now();
  const seenAt = dedup.get(key);
  if (seenAt && now - seenAt < windowMs) return true;
  dedup.set(key, now);
  return false;
};

export const configured = (value) => Boolean(String(value || "").trim());
