# Working in this repository

## Git workflow

Branches, pushes and pull requests are the user's to make, not yours. This holds
in every session; `.claude/hooks/git-workflow-policy.sh` states at session start
which of the two cases below applies.

- **Never create or switch branches** unless the user explicitly asks for one.
  Work on the branch that is already checked out — usually `main`.
- **Never push** and **never open a pull request.**

On the **user's machine**: commit freely on the current branch. Leave the pushing
to the user.

On a **cloud session**: pushing and opening a PR are blocked for this repository
on purpose. Do not attempt either, and do not spend a paragraph explaining how
the user might unblock it — a refusal there is the expected outcome, not a
failure to diagnose. Commit on the current branch, then hand back a patch the
user can apply locally:

```
git format-patch <base>..HEAD --stdout
```

Put that output in the final message inside a fenced `diff` block, together with
the `git apply` command. If the patch is too large to show whole, say so, name
the files it touches, and show the parts that matter.
