import {
  makeRequestId,
  getOrigin,
  isAllowedOrigin,
  apiHeaders,
  json,
  options,
  parseJsonBody,
  sanitizePayload,
  getIp,
  checkRateLimit
} from "../_shared/common.js";

export async function onRequest(context) {
  const { request, env } = context;
  const requestId = makeRequestId();
  const origin = getOrigin(request);

  if (request.method === "OPTIONS") return options(requestId, origin, env);
  if (request.method !== "POST") return json(405, { error: "method_not_allowed", request_id: requestId }, apiHeaders(requestId, origin, env));
  if (!isAllowedOrigin(origin, env)) return json(403, { error: "origin_not_allowed", request_id: requestId }, apiHeaders(requestId, origin, env));

  const ip = getIp(request);
  if (!checkRateLimit(ip, 60_000, 90)) return json(429, { error: "rate_limited", request_id: requestId }, apiHeaders(requestId, origin, env));

  const { data } = await parseJsonBody(request);
  const payload = sanitizePayload(data);
  const eventName = String(payload.event || "").slice(0, 80);

  if (!eventName) return json(400, { error: "invalid_event", request_id: requestId }, apiHeaders(requestId, origin, env));

  const out = {
    event: eventName,
    page: payload.page || "",
    ts: payload.ts || new Date().toISOString(),
    source_ip: ip,
    meta: Object.fromEntries(Object.entries(payload).filter(([k]) => !["event", "page", "ts"].includes(k)).slice(0, 30))
  };

  console.log("[cv-track]", JSON.stringify({ request_id: requestId, ...out }));
  return json(202, { ok: true, request_id: requestId }, apiHeaders(requestId, origin, env));
}
