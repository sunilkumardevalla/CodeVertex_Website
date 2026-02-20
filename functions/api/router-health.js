import {
  makeRequestId,
  getOrigin,
  isAllowedOrigin,
  apiHeaders,
  json,
  options,
  configured
} from "../_shared/common.js";

export async function onRequest(context) {
  const { request, env } = context;
  const requestId = makeRequestId();
  const origin = getOrigin(request);

  if (request.method === "OPTIONS") return options(requestId, origin, env, "GET, OPTIONS");
  if (request.method !== "GET") return json(405, { error: "method_not_allowed", request_id: requestId }, apiHeaders(requestId, origin, env, "GET, OPTIONS"));
  if (!isAllowedOrigin(origin, env)) return json(403, { error: "origin_not_allowed", request_id: requestId }, apiHeaders(requestId, origin, env, "GET, OPTIONS"));

  const crmProvider = String(env.CV_CRM_PROVIDER || "webhook").toLowerCase();
  const marketingProvider = String(env.CV_MARKETING_PROVIDER || (crmProvider === "hubspot" ? "hubspot" : "webhook")).toLowerCase();

  const crmTargets = [configured(env.CV_CRM_ENTERPRISE_WEBHOOK), configured(env.CV_CRM_PRIMARY_WEBHOOK), configured(env.CV_CRM_SECONDARY_WEBHOOK)].filter(Boolean).length;
  const marketingTargets = [configured(env.CV_MARKETING_URGENT_WEBHOOK), configured(env.CV_MARKETING_PRIMARY_WEBHOOK), configured(env.CV_MARKETING_SECONDARY_WEBHOOK)].filter(Boolean).length;
  const hubspotReady = configured(env.CV_HUBSPOT_PRIVATE_APP_TOKEN);

  const crmReady = crmProvider === "hubspot" ? hubspotReady : crmTargets > 0;
  const marketingReady = marketingProvider === "hubspot" ? hubspotReady : marketingTargets > 0;

  const status = {
    ok: crmReady && marketingReady,
    updated_at: new Date().toISOString(),
    request_id: requestId,
    router: {
      max_attempts: Number(env.CV_ROUTER_MAX_ATTEMPTS || 3),
      base_delay_ms: Number(env.CV_ROUTER_BASE_DELAY_MS || 400),
      fail_on_routing_error: String(env.CV_FAIL_ON_ROUTING_ERROR || "false").toLowerCase() === "true"
    },
    channels: {
      crm_targets_configured: crmTargets,
      marketing_targets_configured: marketingTargets,
      dead_letter_configured: configured(env.CV_DEAD_LETTER_WEBHOOK)
    },
    security: {
      webhook_signature_secret_configured: configured(env.CV_WEBHOOK_SIGNING_SECRET),
      downstream_signature_secret_configured: configured(env.CV_DOWNSTREAM_SIGNING_SECRET),
      allowed_origins_configured: configured(env.CV_ALLOWED_ORIGINS)
    }
  };

  return json(200, status, apiHeaders(requestId, origin, env, "GET, OPTIONS"));
}
