# Revisium In Your Stack

This directory stores the generated replacement for the architecture mermaid diagram used on the docs site.

## Source Of Truth

The source of truth is not the exported image. It is:

- `prompt.md`
- the hard visual rules in `prompt.md`
- the approved stable asset path used by docs

Treat `diagram.png` as the stable published asset and versioned files under `versions/` as historical build artifacts.

## Files

- `prompt.md` — current production prompt, constraints, and intended usage
- `diagram.png` — stable file that docs pages should reference
- `versions/diagram.vN.png` — approved historical exports

## Dimensions And Anchors

When an image is used in docs anchors or section links, reserve its layout space before the file loads.

- For one-off custom images rendered with raw `<img>`, set explicit `width` and `height` on the tag.
- For screenshots rendered through `src/components/Screenshot`, keep the dimensions map in `src/components/Screenshot/imageDimensions.ts` updated.
- Do not rely on the browser to discover image size after load; that can cause anchor scroll drift and layout shift.

Example:

```mdx
<img
  src="/img/diagrams/revisium-in-your-stack/diagram.png"
  alt="Revisium in your stack"
  width="1367"
  height="1151"
  style={{ width: "100%", maxWidth: "820px", height: "auto", display: "block", margin: "0 auto" }}
/>
```

## Update Workflow

1. Update `prompt.md`.
2. Generate a new candidate image outside the repo or with your preferred tool.
3. Save the approved file as `versions/diagram.vN.png`.
4. Copy the approved version to `diagram.png`.
5. Replace the mermaid block in `docs/intro.md` under `Revisium in Your Stack` with the stable image reference if that has not already been done.
6. Commit the updated image and prompt changes to git.
7. If the image is rendered via raw `<img>`, update the tag with the correct intrinsic `width` and `height`.

## Docs Usage

Use only the stable path in docs content:

```md
![Revisium in your stack](/img/diagrams/revisium-in-your-stack/diagram.png)
```
