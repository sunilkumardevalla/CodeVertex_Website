# Weekly Incident Pack Workspace

Use this folder to draft weekly incident briefings for all audiences.

## Weekly cadence
- Monday: collect and shortlist incidents.
- Tuesday: draft enterprise/SMB/individual guidance.
- Wednesday: publish incident cards and one short explainer video.
- Thursday: publish one deep-read blog post.
- Friday: review engagement metrics and optimize next week.

## Fast workflow
1. Create draft pack:
   - `scripts/incident-pack-new.sh --title "Identity Trust Chain Drift" --category "Identity" --severity "Critical" --summary "One-line summary" --week "2026-W08"`
2. Fill in audience guidance in draft file under `workspace/incident-packs/`.
3. Publish to Incident Watch JSON:
   - `scripts/incident-pack-publish.sh --id "inc-2026-w08-identity-trust-chain-drift" --date "2026-02-19" --category "Identity" --severity "Critical" --title "Identity Trust Chain Drift" --summary "One-line summary" --audiences "enterprise,smb" --advice-enterprise "..." --advice-smb "..." --advice-individual "..." --cta-label "Book identity assessment" --cta-url "security-assessment.html"`
