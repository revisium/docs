# Revisium In Your Stack

## Status

Approved and published in docs.

## Version

v1

## Approved Asset

- Stable asset: `/img/diagrams/revisium-in-your-stack/diagram.png`
- Versioned asset: `static/img/diagrams/revisium-in-your-stack/versions/diagram.v1.png`

## Stable Asset Path

`/img/diagrams/revisium-in-your-stack/diagram.png`

## Owner

Docs / product documentation

## Usage

- Docs page: `docs/intro.md`
- Section: `Revisium in Your Stack`
- Goal: replace the previous mermaid diagram on the intro page with a generated static asset

## Current Production Prompt

```text
Create a clean enterprise SaaS architecture diagram for developer documentation.

Style:
- flat vector
- minimal and modern
- real product documentation diagram, not illustration
- white background
- thin gray borders
- subtle blue accent color
- no gradients
- no 3D
- no isometric perspective
- no decorative elements
- aligned grid layout
- evenly spaced elements
- high readability, similar to Stripe or Supabase docs

Layout:
- two medium top cards
- one large central card
- PostgreSQL cylinder at the bottom
- arrows from both top cards to the central card
- arrow from central card to PostgreSQL

Top left card title:
Applications

Items:
- Web Frontend
- Mobile Apps
- Backend Services
- AI Agents
- Game Clients
- Remote Config
- Feature Flags

Top right card title:
Management & Delivery

Items:
- Admin UI
- revisium-cli
- Git / CI/CD

Large central card with three stacked sections:

Section 1 title:
Generated APIs
Subtitle:
REST · GraphQL · MCP

Section 2 title:
Schemas & Data
Subtitle:
Schemas · Relations · Assets · Computed Fields

Section 3 title:
Branches & Revisions

Inside “Branches & Revisions”:
- show a simple branch diagram
- one main horizontal branch labeled “develop”
- two branches splitting from it labeled “release-1.4” and “release-1.5”
- show several small gray commit dots on each branch
- each release branch should have its own commits after splitting
- show a blue filled dot at the end of an active branch to represent Head
- show a hollow outlined dot next to it to represent Draft
- keep this simple and clean, not like a git client screenshot
- straight lines only
- balanced spacing
- compact legend on the right:
  - Head
  - Draft
  - Commit
- bottom small text inside the section:
  Review · Publish

Bottom element:
Database cylinder labeled PostgreSQL

Typography:
- clean sans-serif
- all text in English
```

## Hard Rules

- no icons unless intentionally added to the prompt
- no gradients
- no shadows
- straight or clean connector lines only
- no decorative background noise
- minimal text
- no marketing copy inside the image
- keep service names and relationships technically accurate

## Regeneration Notes

- Prefer a layout that stays readable on desktop docs widths.
- Keep labels short enough to avoid fuzzy rendering after export.
- Prefer PNG for the published asset unless you intentionally switch the docs page to SVG.
- If an SVG export becomes stable and hand-editable, document that decision here before switching formats.

## Regeneration Checklist

1. Update the prompt in this file before generating if requirements changed.
2. Generate candidate variants outside the repo.
3. Approve one image and save it as `versions/diagram.vN.png`.
4. Copy the approved file to `diagram.png`.
5. Verify the docs page still renders cleanly at normal content width.
6. Add a new changelog entry below.

## Version History

### v1

- First approved generated replacement image imported and published as the stable docs asset.
- Prompt captured in this file as the current production source of truth.
- Files:
  - `versions/diagram.v1.png`
  - `diagram.png`
- Replaced the mermaid diagram in `docs/intro.md` under `Revisium in Your Stack` with the stable static image.
