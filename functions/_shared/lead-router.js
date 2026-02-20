const textEncoder = new TextEncoder();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeUrl = (value) => {
  const v = String(value || "").trim();
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) return "";
  return v;
};

const routePriority = (channel, payload) => {
  const tier = String(payload.lead_tier || "").toLowerCase();
  const priority = String(payload.lead_priority || "").toLowerCase();
  const score = Number(payload.lead_score || 0);

  if (channel === "crm") {
    if (tier === "enterprise" || priority === "high" || score >= 85) return "enterprise";
    if (tier === "growth" || score >= 55) return "growth";
    return "standard";
  }

  if (channel === "marketing") {
    const action = String(payload.preference_action || "").toLowerCase();
    if (action.includes("unsubscribe") || action.includes("pause")) return "urgent";
    return "standard";
  }

  return "standard";
};

const getDestinations = (channel, priority, env) => {
  if (channel === "crm") {
    const enterprise = [
      normalizeUrl(env.CV_CRM_ENTERPRISE_WEBHOOK),
      normalizeUrl(env.CV_CRM_PRIMARY_WEBHOOK),
      normalizeUrl(env.CV_CRM_SECONDARY_WEBHOOK)
    ].filter(Boolean);

    const growth = [normalizeUrl(env.CV_CRM_PRIMARY_WEBHOOK), normalizeUrl(env.CV_CRM_SECONDARY_WEBHOOK)].filter(Boolean);
    const standard = [normalizeUrl(env.CV_CRM_PRIMARY_WEBHOOK), normalizeUrl(env.CV_CRM_SECONDARY_WEBHOOK)].filter(Boolean);

    if (priority === "enterprise" && enterprise.length) return enterprise;
    if (priority === "growth" && growth.length) return growth;
    return standard;
  }

  if (channel === "marketing") {
    const urgent = [
      normalizeUrl(env.CV_MARKETING_URGENT_WEBHOOK),
      normalizeUrl(env.CV_MARKETING_PRIMARY_WEBHOOK),
      normalizeUrl(env.CV_MARKETING_SECONDARY_WEBHOOK)
    ].filter(Boolean);

    const standard = [normalizeUrl(env.CV_MARKETING_PRIMARY_WEBHOOK), normalizeUrl(env.CV_MARKETING_SECONDARY_WEBHOOK)].filter(Boolean);
    if (priority === "urgent" && urgent.length) return urgent;
    return standard;
  }

  return [];
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

const splitName = (fullName) => {
  const clean = String(fullName || "").trim();
  if (!clean) return { first: "", last: "" };
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
};

const mapHubspotLeadStatus = (priority, env) => {
  const p = String(priority || "").toLowerCase();
  if (p === "high" || p === "enterprise") return env.CV_HUBSPOT_HIGH_PRIORITY_LEAD_STATUS || "OPEN";
  if (p === "nurture") return env.CV_HUBSPOT_NURTURE_LEAD_STATUS || "IN_PROGRESS";
  return env.CV_HUBSPOT_DEFAULT_LEAD_STATUS || "NEW";
};

const buildHubspotProperties = (envelope, env) => {
  const raw = envelope?.payload?.payload || {};
  const fullName = envelope?.payload?.name || raw.name || "";
  const { first, last } = splitName(fullName);

  const props = {
    email: envelope?.payload?.email || raw.email || "",
    firstname: first,
    lastname: last,
    company: envelope?.payload?.company || raw.company || "",
    jobtitle: raw.role || "",
    phone: raw.phone || "",
    website: raw.reference_link || "",
    lifecyclestage: env.CV_HUBSPOT_LIFECYCLE_STAGE || "lead",
    hs_lead_status: mapHubspotLeadStatus(envelope?.priority || envelope?.payload?.lead_priority, env)
  };

  const cleaned = {};
  Object.entries(props).forEach(([key, value]) => {
    const normalized = String(value || "").trim();
    if (normalized) cleaned[key] = normalized;
  });

  return cleaned;
};

const deliverHubspotContact = async (envelope, env) => {
  const token = String(env.CV_HUBSPOT_PRIVATE_APP_TOKEN || "").trim();
  if (!token) return { delivered: false, provider: "hubspot", status: 0, error: "missing_hubspot_token" };

  const apiBase = normalizeUrl(env.CV_HUBSPOT_API_BASE || "https://api.hubapi.com");
  const endpoint = `${apiBase.replace(/\/$/, "")}/crm/v3/objects/contacts`;
  const timeoutMs = Math.max(2000, Number(env.CV_HUBSPOT_TIMEOUT_MS || 7000));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body = JSON.stringify({ properties: buildHubspotProperties(envelope, env) });
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
      body,
      signal: controller.signal
    });

    const text = await res.text().catch(() => "");
    if (res.ok || res.status === 409) return { delivered: true, provider: "hubspot", status: res.status, body: text.slice(0, 500) };
    return { delivered: false, provider: "hubspot", status: res.status, body: text.slice(0, 500) };
  } catch (err) {
    return { delivered: false, provider: "hubspot", status: 0, error: String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
};

const postJson = async (url, payload, env, timeoutMs = 7000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body = JSON.stringify(payload);
    const secret = String(env.CV_DOWNSTREAM_SIGNING_SECRET || "").trim();
    const signature = secret ? await hmacHex(secret, body) : "";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(signature ? { "x-cv-signature": signature } : {})
      },
      body,
      signal: controller.signal
    });

    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, body: text.slice(0, 500) };
  } catch (err) {
    return { ok: false, status: 0, error: String(err?.message || err) };
  } finally {
    clearTimeout(timer);
  }
};

const deliverWithRetry = async (destinations, envelope, env) => {
  const attempts = Math.max(1, Number(env.CV_ROUTER_MAX_ATTEMPTS || 3));
  const baseDelay = Math.max(150, Number(env.CV_ROUTER_BASE_DELAY_MS || 400));
  const logs = [];

  for (const destination of destinations) {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const result = await postJson(destination, envelope, env);
      logs.push({ destination, attempt, ...result });
      if (result.ok) return { delivered: true, destination, logs };
      if (attempt < attempts) await sleep(baseDelay * attempt);
    }
  }

  return { delivered: false, destination: "", logs };
};

const deadLetter = async (envelope, deliveryLogs, env) => {
  const dlq = normalizeUrl(env.CV_DEAD_LETTER_WEBHOOK);
  const payload = {
    type: "lead_dead_letter",
    ts: new Date().toISOString(),
    envelope,
    delivery_logs: deliveryLogs
  };

  if (!dlq) {
    console.error("[cv-router][dead-letter][local]", JSON.stringify(payload));
    return { queued: false, mode: "log-only" };
  }

  const result = await postJson(dlq, payload, env, 8000);
  if (result.ok) return { queued: true, mode: "webhook" };

  console.error("[cv-router][dead-letter][failed]", JSON.stringify({ payload, result }));
  return { queued: false, mode: "webhook-failed" };
};

const hashHex = async (text) => {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
};

export const routeLead = async ({ channel, payload, leadId, sourceIp, env }) => {
  const priority = routePriority(channel, payload);
  const destinations = getDestinations(channel, priority, env);

  const hash = await hashHex(`${channel}:${leadId}:${Date.now()}:${Math.random()}`);
  const routingId = hash.slice(0, 18);

  const envelope = {
    routing_id: routingId,
    lead_id: leadId,
    channel,
    priority,
    source_ip: sourceIp,
    received_at: new Date().toISOString(),
    payload
  };

  const crmProvider = String(env.CV_CRM_PROVIDER || "webhook").toLowerCase();
  const marketingProvider = String(env.CV_MARKETING_PROVIDER || (crmProvider === "hubspot" ? "hubspot" : "webhook")).toLowerCase();
  const channelProvider = channel === "crm" ? crmProvider : channel === "marketing" ? marketingProvider : "webhook";

  if (channelProvider === "hubspot" && (channel === "crm" || channel === "marketing")) {
    const hubspotDelivery = await deliverHubspotContact(envelope, env);
    if (hubspotDelivery.delivered) {
      console.log("[cv-router][hubspot-delivered]", JSON.stringify({ routing_id: routingId, channel, status: hubspotDelivery.status }));
      return {
        routed: true,
        routing_id: routingId,
        priority,
        destination: "hubspot:contacts-api",
        dead_letter: null,
        attempts: [hubspotDelivery]
      };
    }
    console.error("[cv-router][hubspot-failed]", JSON.stringify({ routing_id: routingId, channel, ...hubspotDelivery }));
  }

  if (!destinations.length) {
    const dlq = await deadLetter(envelope, [{ reason: "no_destination_configured" }], env);
    return {
      routed: false,
      routing_id: routingId,
      priority,
      destination: "",
      dead_letter: dlq,
      attempts: [{ reason: "no_destination_configured" }]
    };
  }

  const delivery = await deliverWithRetry(destinations, envelope, env);
  if (delivery.delivered) {
    console.log("[cv-router][delivered]", JSON.stringify({ routing_id: routingId, channel, priority, destination: delivery.destination }));
    return {
      routed: true,
      routing_id: routingId,
      priority,
      destination: delivery.destination,
      dead_letter: null,
      attempts: delivery.logs
    };
  }

  const dlq = await deadLetter(envelope, delivery.logs, env);
  console.error("[cv-router][delivery-failed]", JSON.stringify({ routing_id: routingId, channel, priority, dead_letter: dlq.mode }));

  return {
    routed: false,
    routing_id: routingId,
    priority,
    destination: "",
    dead_letter: dlq,
    attempts: delivery.logs
  };
};
