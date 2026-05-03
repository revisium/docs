# Revisium Docs

## Release Train

Use the `Release Train` workflow to plan or publish release-train transitions.
Dry run mode is enabled by default and does not push branches, commits, tags, or
releases.

Manual dispatch:

1. Open **Actions** -> **Release Train**.
2. Select the release transition, for example `start-minor-alpha`.
3. Keep `dry_run` enabled to inspect the plan, or disable it to publish the
   release branch and tag.
4. Run the workflow from `master` for `start-*` transitions, or from the
   matching `release/X.Y.x` branch for branch-scoped transitions.

Bot dispatch can call the same `workflow_dispatch` endpoint with the `action`
and `dry_run` inputs. The workflow is pinned to `revisium-actions` `v0.3.1` by
commit hash.

Write mode requires these repository settings:

- `RELEASE_BOT_CLIENT_ID` as an Actions variable.
- `RELEASE_BOT_PRIVATE_KEY` as an Actions secret.
