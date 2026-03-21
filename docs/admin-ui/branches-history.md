---
sidebar_position: 6
---

import Screenshot from '@site/src/components/Screenshot';

# Branches & History

## Branches

The Branches page lists all branches in the project. Switch between the **Branches** tab and **Revisions** tab to see the commit history for a specific branch:

<Screenshot alt="Branches list with revision history — draft, head, and past revisions with timestamps" src="/img/screenshots/admin-branch-list.png" />

## Creating a Branch

Click **+ New branch**, select a source branch, and the new branch starts with that branch's HEAD as its starting point:

<Screenshot alt="Create new branch dialog — select source branch" src="/img/screenshots/admin-branch-create.png" />

## Branch Map

The Branch Map provides a visual graph of all branches, revisions, and API endpoints in the project:

<Screenshot alt="Branch Map — visual graph showing branches, revisions, fork points, and connected endpoints" src="/img/screenshots/admin-branch-map.png" />

## Revision History

Each branch has a linear history of committed revisions. Click any revision to browse its tables and data (read-only — past revisions are immutable).

## Rollback

To rollback to a previous state, the platform resets the draft to match a selected past revision.
