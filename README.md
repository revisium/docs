# Revisium Docs

## Release Train Dry Run

Use the `Release Train Dry Run` workflow to validate release-train transitions
without pushing branches, commits, tags, or releases.

Manual dispatch:

1. Open **Actions** -> **Release Train Dry Run**.
2. Select the release transition, for example `start-minor-alpha`.
3. Run the workflow from `master` for `start-*` transitions, or from the
   matching `release/X.Y.x` branch for branch-scoped transitions.

Bot dispatch can call the same `workflow_dispatch` endpoint with the `action`
input. The workflow is pinned to `revisium-actions` `v0.2.0` by commit hash and
passes `dry_run: true`, so it only reports the planned target branch, version,
tag, and channel.
