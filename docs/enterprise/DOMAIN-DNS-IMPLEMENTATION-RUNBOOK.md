# Domain and DNS Implementation Runbook

## Objective
Operationalize DNS hardening controls for `codevertex.io` and `www.codevertex.io`.

## Required records
- CAA records to restrict certificate issuance to approved CAs.
- SPF record for authorized senders.
- DKIM records for sending providers.
- DMARC policy (`p=none` -> `p=quarantine` -> `p=reject` rollout).

## Recommended CAA baseline
- `0 issue "letsencrypt.org"`
- `0 issuewild "letsencrypt.org"`
- `0 iodef "mailto:security@codevertex.io"`

## Verification commands
- `dig +short CAA codevertex.io`
- `dig +short TXT _dmarc.codevertex.io`
- `dig +short TXT codevertex.io`

## Change control
- Log every DNS change with owner, reason, timestamp.
- Require two-person review for CAA/DMARC changes.
