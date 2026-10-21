# MVP verification · 2026-10-20 (America/Los_Angeles)

Performed by Codex in the implementation session. These are software observations, not results of ER-005 or ER-006.

- Eleven Node tests passed: seed references and trial-state honesty; correction gating; independent-verifier references; correction retention during filtered export; search through objections and sources; orphan/duplicate rejection; issue-link encoding and long-draft fallback; preservation of origins, original claims, correction wording, and completed verification.
- Ledger validator passed. Browser JavaScript parsed successfully.
- Local HTTP server returned 200 for the shared JSON. The browser loaded all seven initial records.
- Browser search for retrieval returned three records. ER-004's detail showed attribution, source excerpts, strongest objection, revision condition, next action, and no invented correction history.
- A synthetic correction draft survived page reload, remained local, and produced an attributed issue URL. A separate contribution containing HTML-like text displayed as literal text. Neither synthetic draft was submitted to GitHub; both were cleared from the local workbench.
- Handoff export downloaded JSON with format `echo-handoff-v1`, seven shared records, and no local drafts.
- Inspected the landing page at the default narrow viewport and at 1440 pixels wide. This is a responsive smoke check, not an exhaustive accessibility audit.

The seed was subsequently extended with this verification record. No human experiment, independent audit, or performance benchmark is claimed. GitHub publication and CI status are reported separately in the final task handoff; the observations above do not establish deployment.
