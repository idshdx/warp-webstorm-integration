#!/usr/bin/env bash
# Junie Auto-Commit Helper
# Creates a detailed commit including Plan and Results sections and change summary.
set -euo pipefail

# Collect inputs
PLAN=${JUNIE_PLAN:-"(no plan provided)"}
RESULTS=${JUNIE_RESULTS:-"(no results provided)"}
DETAILS=${JUNIE_DETAILS:-""}
NOW=$(date -Is)
BRANCH=$(git rev-parse --abbrev-ref HEAD || echo "(no-branch)")

# Ensure we are inside a git repo
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not a git repository; aborting" >&2
  exit 1
fi

# Stage all changes
git add -A

# Summaries
NAME_STATUS=$(git diff --cached --name-status || true)
NAME_ONLY=$(git diff --cached --name-only || true)

# Build commit message
read -r -d '' COMMIT_MSG <<EOF
chore(junie): auto-commit for Junie session on ${NOW}

Plan
----
${PLAN}

Results
-------
${RESULTS}

Details
-------
${DETAILS}

Change Summary (staged)
-----------------------
${NAME_STATUS}

Files Changed
-------------
${NAME_ONLY}

Meta
----
Branch: ${BRANCH}
EOF

# Create commit
if git diff --cached --quiet; then
  echo "No staged changes to commit. Skipping commit."
  exit 0
fi

git commit -m "$COMMIT_MSG"

echo "Commit created successfully."