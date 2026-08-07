# Maintainer Knowledge Base

This directory preserves only unitone-specific knowledge that cannot be kept
more effectively next to the implementation. It is a routing layer for
maintainers and AI coding agents, not a task log or a substitute for issues and
pull requests.

## Language policy

The main entries are written in Japanese so maintainers can review subtle
technical details in their working language. Do not maintain duplicate Japanese
and English copies of the same knowledge.

## Where knowledge belongs

Use the narrowest durable location that fits:

1. Prefer tests, types, or code structure when they can enforce the constraint.
2. Put a short reason next to the relevant source when it applies to one
   implementation and becomes obsolete with that implementation. Explain why,
   not what the code already says.
3. Use this directory only for non-obvious product rules or decisions that span
   files or must be known before choosing which code to change.
4. Put investigation history, reproduction details, verification logs, and
   file-by-file implementation notes in the relevant issue or pull request.

Do not duplicate the full explanation across source comments, maintainer
documents, and issues. A source comment or maintainer entry may link to an issue
for details, but must state the conclusion needed to maintain the code.

## Documents

- [`product-context.ja.md`](product-context.ja.md): Stable product behavior,
  principles, constraints, and terminology.
- [`decisions.ja.md`](decisions.ja.md): A compact index of active design
  decisions. Detailed entries are stored under [`decisions/`](decisions/).
- [`known-issues.ja.md`](known-issues.ja.md): A compact index of confirmed,
  currently relevant compatibility or environment problems.

## Reading workflow

- Do not read every maintainer entry by default.
- Open only the category relevant to the task, start from its compact index,
  and follow links to matching entries.
- If the index is insufficient, search titles and text with a focused keyword
  query, then open only the matching files.
- Searching all entries for a duplicate does not require loading every file in
  full.

## What merits a maintainer entry

Record an item only when omitting it would make a future maintainer likely to
change unitone incorrectly and the reason is not apparent from the relevant
source. Typical examples are cross-cutting compatibility constraints, product
principles, and decisions whose rationale survives the current implementation.

Do not record:

- completed task summaries or temporary work state;
- unverified speculation;
- behavior readily apparent from code;
- one-off fixes whose explanation belongs beside the changed code;
- detailed reproduction steps, investigation logs, or routine test results;
- exact line numbers or exhaustive file lists that will quickly become stale;
- general knowledge unrelated to unitone;
- secrets or local confidential information.

Resolved problems should normally be removed. Retain one only when its cause or
constraint remains important for future compatibility work.

## Editing workflow

Before finishing a task:

1. Decide whether it produced knowledge meeting the threshold above.
2. Search the indexes, candidate entries, and relevant source comments for an
   equivalent explanation.
3. Update the narrowest existing location instead of duplicating it.
4. If a cross-cutting entry is warranted, keep the repository copy concise and
   link to the relevant issue or pull request for details.
5. Review documentation and source-comment changes with `git diff`, and mention
   maintainer-documentation updates in the final report.

Write maintainer entries in Japanese. Keep verified facts separate from
hypotheses, preserve the reason for a decision, and avoid links to mutable line
numbers. If the correct location is unclear, do not force a new entry.
