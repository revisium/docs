# Revisium In Your Stack

This directory stores the generated replacement for the architecture mermaid diagram used on the docs site.

## Source Of Truth

The source of truth is not the exported image. It is:

- `prompt.md`
- the hard visual rules in `prompt.md`
- the version history in `prompt.md`

Treat `diagram.png` as the stable published asset and versioned files under `versions/` as historical build artifacts.

## Files

- `prompt.md` — current production prompt, constraints, intended usage, and changelog
- `diagram.png` — stable file that docs pages should reference
- `versions/diagram.vN.png` — approved historical exports

## Update Workflow

1. Update `prompt.md`.
2. Generate a new candidate image outside the repo or with your preferred tool.
3. Save the approved file as `versions/diagram.vN.png`.
4. Copy the approved version to `diagram.png`.
5. Replace the mermaid block in `docs/architecture/index.md` with the stable image reference if that has not already been done.
6. Add a short changelog entry in `prompt.md`.

## Docs Usage

Use only the stable path in docs content:

```md
![Revisium in your stack](/img/diagrams/revisium-in-your-stack/diagram.png)
```
