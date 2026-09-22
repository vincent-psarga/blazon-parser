#!/usr/bin/env bash
# Tells the session which git workflow applies here: the user's own machine,
# or a cloud sandbox where pushing and opening PRs is not permitted.
set -u

is_cloud() {
  # Explicit markers first, then the sandbox's own shape. The local machine is
  # a Mac; anything else running this repo is a container we cannot push from.
  [ -n "${CLAUDE_CODE_CLOUD:-}" ] && return 0
  [ -n "${CLAUDE_CODE_REMOTE:-}" ] && return 0
  [ -f /.dockerenv ] && return 0
  grep -qE 'docker|containerd|kubepods' /proc/1/cgroup 2>/dev/null && return 0
  [ "$(uname -s)" != "Darwin" ] && return 0
  return 1
}

if is_cloud; then
  context='Git workflow for this session: CLOUD SANDBOX.
- Do NOT create a branch, do NOT push, do NOT open a pull request. Pushing and PR creation are blocked for this repository from the cloud, by design — a failure there is expected, not a problem to diagnose or explain.
- Work on the branch that is already checked out. Committing to it is fine.
- When the work is done, hand back a patch the user can apply locally: run `git format-patch <base>..HEAD --stdout` (or `git diff` for uncommitted work) and put its output in your final message inside a fenced diff block, with the `git apply` command. If it is too large to show in full, say so, name the files, and show the patch for the parts that matter.'
else
  context='Git workflow for this session: LOCAL MACHINE.
- Stay on the branch that is already checked out. Do not create or switch branches unless the user explicitly asks for one.
- Committing is fine. Pushing is the user'"'"'s to do — never `git push`, and never open a pull request.'
fi

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":%s},"suppressOutput":true}\n' \
  "$(printf '%s' "$context" | sed 's/\\/\\\\/g; s/"/\\"/g' | awk '{printf "%s\\n", $0}' | sed 's/^/"/; s/$/"/')"
