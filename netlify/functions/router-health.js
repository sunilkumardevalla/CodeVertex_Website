'use strict';

const {
  makeRequestId,
  getOrigin,
  isAllowedOrigin,
  apiHeaders,
  json,
  options
} = require('./_common');

const configured = (v) => Boolean(String(v || '').trim());

exports.handler = async (event) => {
  const requestId = makeRequestId();
  const origin = getOrigin(event);

  if (event.httpMethod === 'OPTIONS') return options(requestId, origin);
  if (event.httpMethod !== 'GET') return json(405, { error: 'method_not_allowed', request_id: requestId }, apiHeaders(requestId, origin));
  if (!isAllowedOrigin(origin)) return json(403, { error: 'origin_not_allowed', request_id: requestId }, apiHeaders(requestId, origin));

  const crmTargets = [
    configured(process.env.CV_CRM_ENTERPRISE_WEBHOOK),
    configured(process.env.CV_CRM_PRIMARY_WEBHOOK),
    configured(process.env.CV_CRM_SECONDARY_WEBHOOK)
  ].filter(Boolean).length;

  const marketingTargets = [
    configured(process.env.CV_MARKETING_URGENT_WEBHOOK),
    configured(process.env.CV_MARKETING_PRIMARY_WEBHOOK),
    configured(process.env.CV_MARKETING_SECONDARY_WEBHOOK)
  ].filter(Boolean).length;

  const status = {
    ok: crmTargets > 0 && marketingTargets > 0,
    updated_at: new Date().toISOString(),
    request_id: requestId,
    router: {
      max_attempts: Number(process.env.CV_ROUTER_MAX_ATTEMPTS || 3),
      base_delay_ms: Number(process.env.CV_ROUTER_BASE_DELAY_MS || 400),
      fail_on_routing_error: String(process.env.CV_FAIL_ON_ROUTING_ERROR || 'false').toLowerCase() === 'true'
    },
    channels: {
      crm_targets_configured: crmTargets,
      marketing_targets_configured: marketingTargets,
      dead_letter_configured: configured(process.env.CV_DEAD_LETTER_WEBHOOK)
    },
    security: {
      webhook_signature_secret_configured: configured(process.env.CV_WEBHOOK_SIGNING_SECRET),
      downstream_signature_secret_configured: configured(process.env.CV_DOWNSTREAM_SIGNING_SECRET),
      allowed_origins_configured: configured(process.env.CV_ALLOWED_ORIGINS)
    }
  };

  return json(200, status, apiHeaders(requestId, origin));
};
