# Release Management

## Versioning
Use semantic versioning:
- MAJOR: breaking information architecture or core flow changes.
- MINOR: new pages/features or notable UI modules.
- PATCH: fixes, copy updates, SEO corrections.

## Release flow
1. Merge validated work into `staging`.
2. Run QA scripts and Lighthouse workflow.
3. Merge `staging` to `main`.
4. Create tag `vX.Y.Z`.
5. Create GitHub release with scope summary and rollback notes.

## Rollback
- Keep previous release tag as rollback target.
- If production incident occurs:
  1. communicate via `status.html`
  2. restore prior tag
  3. publish incident summary and corrective actions

## Evidence pack for enterprise clients
For each release archive:
- release notes
- test script output
- changed files summary
- security-impact statement
