import {
  makeRequestId,
  getOrigin,
  isAllowedOrigin,
  apiHeaders,
  json,
  options,
  parseJsonBody,
  sanitizePayload,
  normalizeString,
  isEmail,
  getIp,
  verifySignature,
  checkRateLimit,
  checkDuplicate
} from "../_shared/common.js";
import { routeLead } from "../_shared/lead-router.js";

const hashHex = async (value) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
};

const summarizeAttempt = (attempt) => {
  const destination = String(attempt?.destination || "");
  let destinationHost = "";
  if (destination) {
    try {
      destinationHost = new URL(destination).host;
    } catch {
      destinationHost = "invalid-url";
    }
  }

  return {
    destination_host: destinationHost,
    status: Number(attempt?.status || 0),
    ok: Boolean(attempt?.ok),
    error: String(attempt?.error || "").slice(0, 160)
  };
};

export async function onRequest(context) {
  const { request, env } = context;
  const requestId = makeRequestId();
  const origin = getOrigin(request);

  if (request.method === "OPTIONS") return options(requestId, origin, env);
  if (request.method !== "POST") return json(405, { error: "method_not_allowed", request_id: requestId }, apiHeaders(requestId, origin, env));
  if (!isAllowedOrigin(origin, env)) return json(403, { error: "origin_not_allowed", request_id: requestId }, apiHeaders(requestId, origin, env));

  const ip = getIp(request);
  if (!checkRateLimit(ip, 60_000, 30)) return json(429, { error: "rate_limited", request_id: requestId }, apiHeaders(requestId, origin, env));

  const { raw, data } = await parseJsonBody(request);
  const secret = env.CV_WEBHOOK_SIGNING_SECRET || "";
  const providedSignature = request.headers.get("x-cv-signature") || "";
  const validSignature = await verifySignature(raw, providedSignature, secret);
  if (!validSignature) return json(401, { error: "invalid_signature", request_id: requestId }, apiHeaders(requestId, origin, env));

  const payload = sanitizePayload(data);
  const email = normalizeString(payload.email, 320).toLowerCase();
  const formName = normalizeString(payload.form_name || payload.form || "contact", 64);

  if (!isEmail(email)) return json(400, { error: "invalid_email", request_id: requestId }, apiHeaders(requestId, origin, env));

  const dedupeKey = `crm:${formName}:${email}`;
  if (checkDuplicate(dedupeKey, 5 * 60_000)) {
    return json(202, { ok: true, deduped: true, route: "crm", request_id: requestId }, apiHeaders(requestId, origin, env));
  }

  const leadTier = normalizeString(payload.lead_tier || "standard", 32);
  const leadId = (await hashHex(`${email}:${Date.now()}:${Math.random()}`)).slice(0, 20);

  const record = {
    lead_id: leadId,
    route: "crm",
    email,
    name: normalizeString(payload.name, 180),
    company: normalizeString(payload.company, 180),
    form_name: formName,
    lead_tier: leadTier,
    source_ip: ip,
    created_at: new Date().toISOString(),
    payload
  };

  const delivery = await routeLead({ channel: "crm", payload: record, leadId, sourceIp: ip, env });
  console.log("[cv-crm-intake]", JSON.stringify({ request_id: requestId, ...record, delivery }));

  const failHard = String(env.CV_FAIL_ON_ROUTING_ERROR || "").toLowerCase() === "true";
  if (!delivery.routed && failHard) {
    return json(502, { error: "downstream_delivery_failed", lead_id: leadId, routing_id: delivery.routing_id, request_id: requestId }, apiHeaders(requestId, origin, env));
  }

  const exposeDebug = String(env.CV_EXPOSE_ROUTING_DEBUG || "false").toLowerCase() === "true";

  return json(
    202,
    {
      ok: true,
      lead_id: leadId,
      route: "crm",
      routing_id: delivery.routing_id,
      routed: delivery.routed,
      priority: delivery.priority,
      dead_letter: delivery.dead_letter,
      ...(exposeDebug
        ? {
            routing_debug: {
              attempts: Array.isArray(delivery.attempts) ? delivery.attempts.slice(0, 6).map(summarizeAttempt) : []
            }
          }
        : {}),
      request_id: requestId
    },
    apiHeaders(requestId, origin, env)
  );
}
