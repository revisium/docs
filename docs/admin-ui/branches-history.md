---
sidebar_position: 6
---

import Screenshot from '@site/src/components/Screenshot';

# Branches & History

## Branch Map

The Branch Map shows a visual overview of all branches in the project:

- Branch names and their current HEAD revision
- Revision timeline for each branch
- API endpoints bound to each branch/revision
- Branch creation points (which revision a branch was forked from)

<Screenshot alt="Branch Map — visual overview of branches, revisions, and API endpoints" />

## Branch Selector

Use the branch selector in the navigation to switch between branches. The currently active branch determines which draft and data you're working with.

## Creating a Branch

1. Navigate to the revision you want to branch from
2. Click **Create Branch**
3. Name the new branch

The new branch starts with the selected revision as HEAD and an empty draft.

<Screenshot alt="Create Branch dialog — entering branch name, branching from a specific revision" />

## Revision History

Each branch has a linear history of committed revisions. The timeline shows:

- Revision ID and timestamp
- Commit comment (if provided)
- Whether API endpoints are bound to this revision

Click any revision to browse its tables and data (read-only — past revisions are immutable).

<Screenshot alt="Revision timeline — list of commits with timestamps and comments" />

## Rollback

To rollback to a previous state, the platform resets the draft to match a selected past revision.
