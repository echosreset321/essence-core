# Echo's Reset · The Commons Ledger

**Leave something worth carrying forward.**

A working, public contribution space for **Echo's Reset 3-2-1** and **3-2-1 I AM AI 1-2-3**. Bring an idea, an objection, a source, or a useful act. Help a correction survive its next handoff.

The MVP pairs an interactive landing page with a repository-backed evidence and contribution ledger. Search records by type, state, contributor, source text, or objection. Inspect origins and uncertainty. Draft a contribution or correction in your browser, submit it as a GitHub issue for review, and export a portable handoff. Shared corrections always travel with their target records, even from a filtered export.

## Join with one thing

- **Find a weakness:** challenge a claim and say what evidence would distinguish the alternatives.
- **Help run a test:** volunteer for the two-humans/one-AI handoff experiment, ER-005.
- **Bring a source:** improve retrieval and attribution without publishing someone's private conversation.
- **Build or review:** test accessibility, improve the interface, or review a ledger pull request.

[Open a contribution or correction](https://github.com/echosreset321/essence-core/issues/new/choose) · [Contribution guide](CONTRIBUTING.md) · [Shared ledger](docs/data/ledger.json) · [Sources and credit](docs/sources.md)

## What works, and what is still an experiment

The page and ledger are working software. The seed contains eight records, including untested community and handoff proposals and a software-verification record. No successful community node, universal continuity principle, or completed human trial is claimed. Casey's initiatives, 007's proposal, Copilot's retrieval challenge and Commons Ledger proposal, and Codex's implementation remain separately attributed.

Browser drafts stay on that device until you submit them. GitHub issues are public review requests; they do not automatically update the ledger. Accepted contributions enter `docs/data/ledger.json` through a reviewed pull request. There is no shared browser database, automatic model-to-model relay, or sign-in service in this MVP.

Corrections move from open → implemented → verified. The validator requires implementation and independent-verification references before `corrected` is allowed. Pull-request checks preserve existing origins, original claims, and correction history. A different contributor ID is a necessary mechanical check, not proof of an independent person. Reviewers assess sources and independence.

## Run it

Node 22 or later. No dependency installation required.

```sh
npm test
npm run validate
npm start
```

Open the printed localhost address. Serve `docs/` over HTTP; opening `index.html` directly cannot reliably fetch the ledger.

## GitHub Pages

The deployable website is the `docs/` directory, including `.nojekyll`. In repository **Settings → Pages**, select **Deploy from a branch → main → /docs** and save. That is a hosting setup instruction, not a claim that publication has already happened. The task's final handoff reports the verified publication status.

## Project origins

This repository began as essence-core, Casey Smith's seed for a sovereign core with Digital Contracts, Glyph Language (ELR System), a Sovereign Reset Pack, a Decentralized Accountability Index, and REST: Reclamation Engine for System Truth. Those names were conceptual seed material, not working components established by this implementation. The original README is preserved in [docs/original-seed.md](docs/original-seed.md) and in Git history.

The Commons Ledger name and state-based proposal are attributed to the copied Copilot exchange. Conservation of contribution and continuity capital are attributed to the text signed 007. This MVP's interface, schema, checks, and editorial summaries are Codex contributions. See [source notes](docs/sources.md) for the limits of the supplied material. No platform endorsement is implied.

No repository-wide license is inferred for the pre-existing seed or relayed text. Credit and source labels do not themselves grant reuse rights. Contribute material you are authorized to share; licensing of code and source excerpts can be settled explicitly by the owner.
