# Business Continuity and Disaster Recovery

## Targets
- RTO (website critical pages): <= 2 hours
- RPO (CRM intake events): <= 15 minutes

## Critical assets
- GitHub repository and release history
- Netlify production configuration
- HubSpot pipeline and contact records
- Legal/compliance documentation

## Recovery steps
1. Verify incident scope and impacted components
2. Restore known-good deploy from Netlify history
3. Validate API routes and CRM routing
4. Confirm form submissions and tracking events
5. Publish status update and remediation timeline

## Drill cadence
- Tabletop every quarter
- Live restore simulation every 6 months
