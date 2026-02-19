# Contributing

## Branching
- `main`: production-ready only.
- `staging`: integration and validation branch.
- Feature branches: `feature/<scope>` or `fix/<scope>`.

## Development workflow
1. Pull latest `staging`.
2. Create feature branch.
3. Run checks:
   - `bash scripts/quality-check.sh`
   - `bash scripts/prelaunch-check.sh`
   - `bash scripts/monetization-check.sh`
4. Open PR to `staging`.
5. After QA, merge `staging` -> `main` and tag release.

## Commit standard
- Use clear imperative commit messages.
- Recommended prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `perf:`, `seo:`.

## Security requirements
- Never commit secrets (`.env`, API keys, webhook secrets).
- For form/webhook flows, preserve anti-spam and validation controls.
- Keep legal/privacy pages synchronized with policy changes.

## Release checks
- Confirm all checklist items in `GO-LIVE-CHECKLIST.md`.
- Confirm status page and monitoring references are current.
- Create release notes for every tagged version.
