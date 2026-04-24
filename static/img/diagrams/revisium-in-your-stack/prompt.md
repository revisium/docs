# Revisium In Your Stack

## Status

Approved and published in docs.

## Version

v2

## Approved Asset

- Stable asset: `/img/diagrams/revisium-in-your-stack/diagram.png`
- Versioned asset: `static/img/diagrams/revisium-in-your-stack/versions/diagram.v2.png`

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
- grayscale palette matching the docs site
- thin neutral gray borders
- no saturated accent colors
- no gradients
- no 3D
- no isometric perspective
- no decorative elements
- aligned grid layout
- evenly spaced elements
- high readability, similar to Stripe or Supabase docs

Color system:
- background: #ffffff
- primary text: #171717
- secondary text: #525252
- tertiary text: #737373
- borders and dividers: #e5e5e5
- optional active emphasis: very dark neutral, not blue
- commit dots: neutral gray
- Head marker: dark neutral fill
- Draft marker: white fill with neutral dark outline
- avoid blue section titles and blue outlines

Layout:
- two medium top cards
- one large central card
- PostgreSQL cylinder at the bottom
- arrows from both top cards to the central card
- arrow from central card to PostgreSQL
- preserve a compact documentation-style aspect ratio close to the original v1 image
- keep the total diagram height tight; avoid tall empty areas
- reduce vertical padding inside cards and sections
- keep spacing between major blocks compact and even
- prefer a wider composition over a tall composition

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
- show a dark neutral filled dot at the end of an active branch to represent Head
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
- keep typography compact and documentation-like, not poster-like
- section titles should be moderately emphasized, not oversized
- body labels and legend text should stay slightly smaller than the section titles
- preserve comfortable readability without increasing line height unnecessarily

Composition guardrails:
- stay visually close to the density of the original v1 image
- do not enlarge text compared with the original approved layout
- do not increase card height unless required by content
- keep the branch section compact and horizontally efficient
- avoid poster-like whitespace
```

## Hard Rules

- no icons unless intentionally added to the prompt
- no gradients
- no shadows
- no blue accents unless the site palette changes later
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
- Match the docs visual system from `src/css/custom.css`: neutral grayscale, black-first typography, light gray borders, white background.

## Regeneration Checklist

1. Update the prompt in this file before generating if requirements changed.
2. Generate candidate variants outside the repo.
3. Approve one image and save it as `versions/diagram.vN.png`.
4. Copy the approved file to `diagram.png`.
5. Verify the docs page still renders cleanly at normal content width.
