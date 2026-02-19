# Email Deliverability Baseline

## Required DNS records
- SPF: include authorized senders only
- DKIM: enabled for sending platform
- DMARC: start with `p=none`, then move to `p=quarantine`, then `p=reject`

## Mailbox setup
- `security@codevertex.io`
- `privacy@codevertex.io`
- `support@codevertex.io`
- `sales@codevertex.io`

## Anti-abuse controls
- Inbound filtering and mailbox alerting
- Monitor DMARC aggregate reports weekly
- Block spoofing through strict alignment
