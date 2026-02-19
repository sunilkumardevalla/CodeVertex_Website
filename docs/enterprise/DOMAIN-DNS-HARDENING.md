# Domain and DNS Hardening

## Required controls
- Use one canonical domain strategy (`codevertex.io` + redirect policy).
- Enforce HTTPS only and monitor cert expiration.
- Validate HSTS preload readiness before submitting.
- Add DNS change control with approval log.

## DNS checklist
- `A/ALIAS` records point only to approved provider.
- `CAA` records restrict certificate issuance to approved CAs.
- `TXT` ownership records documented.
- No dangling records to decommissioned vendors.

## Ongoing checks
- Weekly DNS diff check.
- Monthly cert expiry report.
- Alert on unauthorized DNS change.
