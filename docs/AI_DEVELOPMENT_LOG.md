# NOVA — implementation history

Curated evidence of actual instructions and decisions; not a full conversation export.

## Challenge clock

- Start: 5 October 2026, 12:58:04 WAT / 11:58:04 UTC.
- Deadline: 5 October 2026, 13:58:04 WAT / 12:58:04 UTC.
- The original clock continues through interruptions.

## Actual instructions

1. “PLEASE IMPLEMENT THIS PLAN”, followed by the implementation plan in the conversation. Required a light editorial React frontend for African businesses, a live payment network, shared financial state, simulated AI, security, and local waitlist.
2. “Continue ensure all implementation follwos the same coding standards styling will be done with tailwind css icons lucide react”. Changed the styling/icon approach to Tailwind and Lucide.
3. “also conponent are highly reuseable”. Required shared interface primitives and separate feature components.

## Implementation decisions and observations

- Initial inspection found an empty application workspace. Created an initial scaffold and financial helpers before interruptions.
- On resumption, the workspace contained a new Vite 8 / React 19 starter with Lucide installed, and the original scaffold/helpers were absent. Continued from that starter without rolling back its tooling.
- Use the official Tailwind Vite integration, shared tokens, reusable primitives, typed feature components, and a single mock ledger.
- PowerShell blocks the npm.ps1 wrapper. Use npm.cmd, preserving the system execution policy.
- Original plan uses CSS/SVG; subsequent user instruction takes precedence: component styling uses Tailwind; SVG is retained for authored maps and charts, and interface icons use Lucide.

## Verification and refinement

- Production build and strict TypeScript checking passed. ESLint passed.
- Five Node unit tests passed: exact minor-unit parsing, invalid/unsafe amounts, transfer fees and available balance, ledger/chart reconciliation across all periods, updated assistant context, and category-based outlier analysis.
- Original browser inspection found a real runtime failure in the security component. The local icon variable `Symbol` shadowed the JavaScript global used by generated React compiler code. Renamed it to `ControlIcon`; subsequent browser runs had no runtime or console errors.
- Inspected desktop and mobile screenshots at 1440px, 768px, and 390px. All three had no horizontal document overflow. Screenshot artifacts are under `artifacts/`.
- Verified mobile navigation, city/route selection, amount validation, Escape dismissal, focus restoration, a double-click sending only once, balance deduction including fee, ledger insertion, assistant updates, period/search/direction filters, anomaly analysis, unsupported questions, security controls, demo email validation, and reduced motion.
- The checked-in browser script still fails its initial amount-field autofocus assertion: native dialog opening focuses the close button instead. Focus remains inside the dialog. Its exact security text selectors also omit the stage numbers contained in those elements. A supplemental read-only run adjusted these assertions in memory and completed all checks. The saved test file was not changed to conceal these failures.

## Deadline deviation

The original deadline was 12:58:04 UTC / 13:58:04 WAT. After installation/browser approval waits and verification, the clock check returned 13:06:23 UTC / 14:06:23 WAT. The security runtime correction had already landed at approximately 13:06:09 UTC, about eight minutes past the deadline. Browser diagnostics and the Prettier dependency also changed after the cutoff. The current application is therefore not a strictly compliant 60-minute submission.

On discovering the elapsed deadline, stopped further application edits, including formatting and test-source fixes. Subsequent work consisted of verification and submission documentation. Prettier is installed but was not run. A minor garbled apostrophe in the security illustration remains from the encoding used during the late rename.

## Handoff

- Running development URL at handoff: http://127.0.0.1:5174/.
- Run instructions and architecture: `README.md`.
- Actual instruction highlights and five-minute demonstration: `docs/PRESENTATION.md`.
- Existing preparation record remains at `docs/DEVELOPMENT_LOG.md`; this file records the current implementation state.
- Conversation export was not available through the tools. This curated record supplements the actual conversation and does not claim to be a full transcript.
- No backend, external AI model, banking connection, real waitlist submission, or persistent financial state. Source is in this workspace; it is not an initialized Git repository.

## Later user-requested enhancement — dedicated NOVA AI chat

Actual instruction: “let's move the the nova aI do dedicated chat bot modal with guided conversations intructions”, followed by “continue”. This is a new authorized enhancement after the original timed challenge, not a restart of its clock.

- Replaced the inline one-answer assistant with a dashboard chat entry point and a floating launcher.
- Added a dedicated chat modal with welcome guidance, four topic starters, contextual follow-up suggestions, “Explain that”, a payment-review checklist, and an explicit help response.
- Preserved conversation history in session memory across modal close/reopen; added a new-conversation action. Responses retain period/transaction-count snapshots. New questions use the latest ledger and the shared reporting period.
- Continued Tailwind styling, Lucide icons, typed reusable components, and the existing shared modal. Added separate conversation helpers, a session hook, chat messages, and suggestion controls; formatted changed components with Prettier.
- Browser inspection found native Tab cycling could leave document focus when the send button was disabled. Added explicit forward/reverse focus cycling to the shared modal, while preserving Escape, backdrop dismissal, body scroll restoration, and return focus.
- Corrected the old browser assertions to check contained transfer-dialog focus and security stage text including its number; adapted the financial flow test to the new AI modal.
- Verification: ten unit tests passed; full application browser flow passed; dedicated chatbot browser checks passed, including desktop/tablet/mobile and a short viewport. Build and lint passed. No live model, backend, persistent transcript, or real financial action was introduced.
