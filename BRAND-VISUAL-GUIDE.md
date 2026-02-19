# CodeVertex Brand Visual Guide

## 1) Visual Direction
- Positioning: multinational enterprise cybersecurity partner.
- Tone: precise, reliable, decisive, audit-ready.
- Style: high-contrast clean UI with controlled motion and security-first visual metaphors.

## 2) Color System
- Primary blue: `#0d6ed1`
- Secondary cyan: `#21b7e9`
- Deep ink: `#08162a`
- Neutral background (light): `#f5f8fc`
- Neutral surface (light): `#ffffff`
- Success: `#0f9c75`
- Warning: `#d38a17`
- Critical risk: `#cc2f4a`

Usage rules:
- Keep blue/cyan for trust, brand identity, and navigational anchors.
- Use emerald/amber/rose tones to separate sections with intent (assurance, process, risk).
- Avoid using critical red as a dominant background; reserve it for risk cues only.

## 3) Typography
- Headings: Sora
- Body/UI: IBM Plex Sans
- Heading style: medium-tight tracking with strong hierarchy.
- Paragraph measure: 60-68ch for readability.

## 4) Imagery and Animated Graphics
Use only owned assets. No third-party embeds.

Preferred asset types:
- Animated SVG scenes
- CSS motion modules
- Branded infographics
- Character-led explainer cards

Image treatment:
- Subtle gradients and overlays
- Rounded enterprise-safe corners (12-18px)
- Minimal glow, no heavy neon bloom

## 5) Motion Strategy
Motion should communicate process, not decorate randomly.

Allowed:
- Section reveal stagger
- Diagram pulse loops for key service sections
- Controlled path/flow animations for workflows

Avoid:
- Same animation repeated in every section
- Constant high-motion backgrounds
- Autoplay-heavy effects that distract from content

Accessibility:
- Respect reduced motion (`prefers-reduced-motion`)
- Keep critical information visible without motion

## 6) Enterprise Content Visual Pattern
Each high-value page should include:
- Hero with value proposition
- Authority strip (version, owner, status, updated date)
- Process visualization
- Evidence cards (executive, technical, governance)
- Outcome metrics/infographics
- CTA with clear next step

## 7) Dark/Light Mode Rules
- Default mode: light.
- Dark mode is user-selectable.
- Keep brand blue/cyan consistency in both modes.
- Ensure cards and borders remain legible in dark theme with elevated contrast.

## 8) Localization Rules
- English and Spanish both supported.
- Keep legal and trust terminology consistent across languages.
- Avoid machine-like literal phrasing; prefer enterprise natural language.

## 9) Asset Naming Convention
- Logos: `assets/logos/...`
- Graphics: `assets/graphics/...`
- Docs: `assets/docs/...`
- Use descriptive names, e.g. `assurance-flywheel.svg`, `compliance-lattice.svg`.

## 10) QA Checklist For New Sections
- Uses a distinct visual pattern from adjacent sections
- Includes at least one trust cue (evidence, ownership, or metrics)
- Works on mobile/tablet/desktop without clipping
- Motion is meaningful and reduced-motion safe
- Uses only owned assets and internal links
