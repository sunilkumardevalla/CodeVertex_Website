# Weekly Incident Pack Playbook

This playbook keeps incident content useful for enterprise teams, small businesses, and individuals.

## Weekly operating model
1. Monday: collect 5-8 high-signal incident themes.
2. Tuesday: draft audience-specific guidance (enterprise, SMB, individual).
3. Wednesday: publish incident cards to `incident-watch.html`.
4. Thursday: publish one deep-read blog post linked from incident card CTA.
5. Friday: review engagement and lead metrics, refine next week.

## Create new weekly draft
```bash
scripts/incident-pack-new.sh \
  --title "Cloud Token Leakage During Runtime Scale Events" \
  --category "Cloud" \
  --severity "High" \
  --summary "Ephemeral workload tokens can leak into logs or side channels during scale bursts." \
  --week "2026-W08"
```

## Publish to incident feed
```bash
scripts/incident-pack-publish.sh \
  --id "inc-2026-w08-cloud-token-runtime-scale" \
  --date "2026-02-20" \
  --category "Cloud" \
  --severity "High" \
  --title "Cloud Token Leakage During Runtime Scale Events" \
  --summary "Ephemeral workload tokens can leak into logs or side channels during scale bursts." \
  --audiences "enterprise,smb,individual" \
  --advice-enterprise "Enforce workload identity boundaries and token anomaly alerts across all environments." \
  --advice-smb "Restrict service account scopes and rotate keys used in deployment scripts." \
  --advice-individual "Avoid storing personal cloud keys in plaintext and enable account MFA alerts." \
  --cta-label "Open cloud guidance" \
  --cta-url "blog-cloud-iam-attack-paths.html"
```

## Quality standard by audience
- Enterprise: governance, ownership, measurable control outcomes.
- SMB: practical low-overhead steps with immediate risk reduction.
- Individual: clear safety actions and account-level protection habits.

## Required content assets per weekly pack
- 1 incident brief card in `assets/data/incident-watch.json`
- 1 short video from `assets/videos/blog/`
- 1 infographic from `assets/graphics/`
- 1 CTA to a related deep-read blog post
