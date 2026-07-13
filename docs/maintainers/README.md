# Maintainer Knowledge Base

This directory contains internal maintenance material for unitone maintainers
and AI coding agents. It preserves reusable design decisions, product-specific
constraints, and confirmed known issues that should survive beyond an
individual task or conversation.

## Language policy

The main entries are written in Japanese so that the maintainers can review and
correct subtle technical details in their working language. AI agents must
consult the Japanese documents regardless of the language of the current
request.

User-facing documentation, general project documentation, and code comments
remain in English, following the existing project convention. When an English
speaker needs access to maintainer knowledge, an AI agent may provide a
translation or summary on demand. Do not maintain duplicate Japanese and
English copies of the same knowledge, because parallel copies are likely to
drift.

## Documents

- [`product-context.ja.md`](product-context.ja.md): Stable product behavior,
  design principles, constraints, terminology, and easy-to-misunderstand facts.
- [`decisions.ja.md`](decisions.ja.md): Design decisions and the reasons behind
  them.
- [`known-issues.ja.md`](known-issues.ja.md): Confirmed bugs, compatibility
  issues, and environment-dependent problems, with facts distinguished from
  hypotheses.

## End-of-task workflow

Before finishing a task:

1. Decide whether the work produced reusable, unitone-specific knowledge.
2. Search all maintainer documents for an existing equivalent entry.
3. If an entry already exists, update it when needed instead of adding a
   duplicate.
4. Add a concise Japanese entry only when the knowledge meets the criteria
   below. Do not copy the full conversation.
5. Review documentation changes together with code changes using `git diff`.
6. Mention any maintainer-documentation update in the final task report.

If the user explicitly asks not to update these documents, do not update them.
If the correct category is unclear, do not force an entry; mention the possible
documentation update in the final report instead.

## What to record

Record knowledge when at least one of the following applies:

- A bug's symptoms, reproduction conditions, cause, or workaround became known.
- A unitone-specific behavior, principle, constraint, or term became known.
- The task established a design decision that future changes should preserve.
- A maintainer corrected a misconception that an AI agent is likely to repeat.
- The task established a reusable procedure for similar investigations or
  implementations.
- An important compatibility issue with WordPress, Gutenberg, WooCommerce, or
  another relevant environment was confirmed.

Do not record:

- One-off conversation or temporary work status.
- Unverified speculation by itself.
- A simple description that is readily apparent from the current code.
- Information that substantially duplicates an existing entry.
- General knowledge unrelated to unitone.
- Information likely to become stale before it can guide future work.
- API keys, credentials, customer data, or confidential local-environment
  details.

## Editing principles

- Separate verified facts from hypotheses, and never present uncertainty as a
  settled fact.
- Record the versions and environments used for verification when relevant.
- Preserve the reason for a decision, not only the resulting code state.
- Keep entries concise and link to relevant files, issues, and pull requests.
- When removing obsolete information, preserve the reason for the change when
  it remains useful.
- Write additions to the Japanese maintainer documents in Japanese; do not
  translate them merely because the current request is in English.
