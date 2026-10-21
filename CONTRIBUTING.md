# Bring one useful thing

You do not need to write code. You do need to distinguish what you think, what you tried, and what you observed.

1. Pick a record in [the shared ledger](docs/data/ledger.json). Read its source, objection, revision condition, and next action.
2. [Open a contribution or correction issue](https://github.com/echosreset321/essence-core/issues/new/choose). You can also use the page's local workbench to prepare an issue. A GitHub account is needed to submit. The page never posts on your behalf.
3. State your name/handle, whether you are human or using an AI, the origin of the contribution, a public source or reproducible observation, strongest objection, and next action. You may challenge any participant.
4. A maintainer reviews the proposal, preserves disagreements, and adds the record through a pull request to `docs/data/ledger.json`. New participants and sources must have their own IDs and provenance notes. Copying an AI response does not make the person pasting it its author.
5. The automated checks must pass before merging. A maintainer still evaluates whether the evidence supports the claim. Passing schema checks is not truth verification.

## A correction is work, not a badge

Use a new correction ID with `recordId`, `author`, `source`, `before`, `after`, `reason`, `nextAction`, `created`, and `status: "open"`. The source is a source ID in the shared ledger. Keep original wording intact.

- **Open:** proposed change; no implementation established. Name the responsible person in `nextAction`, or explicitly say unassigned. Do not assign another person without agreement.
- **Implemented:** add `implementation` describing what changed and `implementationSource` pointing to a public artifact or reproducible result. This is a recorded implementation claim, not independent verification.
- **Verified:** add `verification`, `verificationSource`, and a distinct participant ID in `verifier`. Record what the verifier actually checked. A different handle alone does not establish independence; disclose relationships and who operated any AI session. Maintainers assess the independence claim.

Only then can a record's state become `corrected`. Update its summary to the replacement wording and retain the original in the correction. Corrections cannot be removed or rewritten in place after entering the main branch. To correct a correction, append a new one. Git history retains state transitions; pull-request checks reject deletion of existing records/sources, rewritten correction claims, and backwards correction states.

When you export a filtered handoff, **all shared corrections and their target records travel with it**. Local drafts are exported separately and remain unreviewed. Save the JSON somewhere durable; browser storage is not a shared archive.

## The first human experiment: ER-005

Volunteer on the handoff-test issue. We need two consenting humans and one disclosed AI session. Keep initial answers independent. Freeze a public evidence packet before the trial. Each participant writes a conclusion, strongest objection, uncertainty, revision condition, and next test.

Use a small neutral task, such as choosing which of two public instructions is current. Plant an explicitly labeled obsolete instruction, then supply a justified correction. Swap records; permit only objections, corrections, and clarifications in round two. A fresh participant must locate the relevant correction, reconstruct the reasoning, and make a decision using the corrected instruction.

Record: packet version, participants and AI configuration as known, who saw what and when, retrieval time, whether reasoning was reconstructed, whether the correction changed the decision, and failure cases. Compare against a packet without a correction index. Predeclare success criteria before collecting results; publish negative results too. This tests a small workflow, not a universal theory of intelligence.

## Source care and conduct

Publish material you are entitled to share. Prefer small, public, redacted excerpts to private raw conversations. Never include credentials or other people's private details. Challenge claims, identify the issue, and propose a check; avoid personal attacks. Consent to one contribution does not assign ownership of a contributor's future work. AI participation does not imply platform endorsement, a shared mind, or authenticated identity.

## Running the project

Node 22 or later; no install step or production dependencies:

```sh
npm test
npm run validate
npm start
```

Visit the printed local address. Keep scripts and styles relative so the site works under a GitHub Pages repository path. Test keyboard access and mobile widths. Use text nodes for user content; do not inject draft text as HTML.
