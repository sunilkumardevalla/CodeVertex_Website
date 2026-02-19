# Lead Routing Architecture

## Overview
Lead submissions flow through intake endpoints:
- `/api/crm-intake`
- `/api/marketing-intake`

Both handlers call `netlify/functions/_lead-router.js`.

## Routing model
- Channel: `crm` or `marketing`
- Priority is computed from payload:
  - CRM: `enterprise`, `growth`, `standard`
  - Marketing: `urgent`, `standard`

## Destination order
Router attempts destinations in configured order by channel+priority.
Each destination receives retries with exponential-ish backoff:
- attempts: `CV_ROUTER_MAX_ATTEMPTS` (default 3)
- delay: `CV_ROUTER_BASE_DELAY_MS * attempt`

## Delivery outcome
- `routed=true`: at least one destination acknowledged (`2xx`)
- `routed=false`: all destinations failed
  - payload is sent to dead-letter webhook if configured (`CV_DEAD_LETTER_WEBHOOK`)
  - otherwise dead-letter is logged to function logs

## Response behavior
- default: endpoint returns `202` even if downstream failed, with `routed=false`
- strict mode: set `CV_FAIL_ON_ROUTING_ERROR=true` to return `502` on routing failure

## Security
- incoming signature verification: `CV_WEBHOOK_SIGNING_SECRET`
- optional downstream signature header (`x-cv-signature`): `CV_DOWNSTREAM_SIGNING_SECRET`
- rate limits and dedupe are enforced before routing.

## Monitoring recommendations
1. Alert on repeated `routed=false` responses.
2. Alert on dead-letter webhook failures.
3. Track per-destination success rates and latency.
4. Rotate signing secrets quarterly.
