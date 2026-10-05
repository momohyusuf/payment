# NOVA — AI development standards

## Purpose and authority

Build an exceptional React frontend for NOVA: “Africa's financial operating system.”
The supplied brief is preserved in `docs/CHALLENGE_BRIEF.md`.
User instructions take precedence over this file. Work autonomously within the agreed task; ask only when a missing decision materially blocks progress.

Current phase: preparation. Application development has not started.
When the user starts development, record the start time and an exact deadline 60 minutes later in `docs/AI_DEVELOPMENT_LOG.md`. Stop implementation at that deadline. Do not reset the clock after interruptions, failures, or restarts. Report unfinished requirements honestly.

## Working method

1. Inspect existing code and instructions before changing them. Preserve user work.
2. Choose one clear visual concept, explain it briefly, and carry it consistently through typography, color, spacing, motion, and copy.
3. Break the work into concrete milestones. Deliver a complete interactive first pass early enough to review and improve it.
4. Inspect the rendered result. Identify specific weaknesses in the first pass, improve them, and record the evidence and changes.
5. Verify the final build and important user journeys. Report what actually passed, what failed, and what was not checked.

Use a single agent unless the user explicitly requests delegation. Keep progress updates concise, stating findings and the next useful action. Routine reversible implementation choices do not need repeated approval.

## Engineering standards

- Use React and a local development server; no backend or required external API keys. Default to Vite and TypeScript unless existing code suggests otherwise.
- Keep dependencies small and purposeful. Prefer CSS, SVG, and existing tools for interface visuals. Do not add libraries just to render simple effects.
- Separate mock financial data and calculations from presentation. Derive totals, charts, and assistant insights from the same dataset.
- Store money as integer minor units; format currency with `Intl.NumberFormat`. Never silently add amounts across currencies. Label any simulated conversion rates.
- Model interactions with real React state. CTAs, filters, tabs, city selection, assistant prompts, and dialogs must produce useful visible outcomes.
- Keep the assistant usable offline using deterministic analysis of mock activity. Clearly identify it as a demo; do not imply a live model or real financial advice.
- Use explicit loading, empty, success, and error states where the implemented flow needs them. Clean up timers, animation loops, and event listeners.
- Keep components and styles readable. Avoid unnecessary architecture, placeholder links, console errors, exposed secrets, and inaccessible controls.

## Design and product standards

- Express a premium, intelligent African technology brand through a distinctive composition and concrete financial use cases. Avoid generic template sections, decorative clutter, and repetitive card grids.
- Give the opening viewport a strong typographic hierarchy, a concise product explanation, two clear actions, and an interactive visual.
- Represent Lagos, Abuja, Accra, Nairobi, and London meaningfully in a live network. Selected routes should change visible information; motion should communicate movement of funds.
- Use realistic merchants, transaction dates, balances, and insights. Show useful context alongside financial numbers.
- Demonstrate security visually and interactively. NOVA is fictional: avoid invented regulatory approvals, certifications, guarantees, customer counts, or real customer testimonials.
- Treat mobile as a first-class layout. Check narrow screens, long text, navigation, charts, dialogs, and touch targets; prevent horizontal overflow.
- Use semantic HTML, labeled fields, keyboard-accessible controls, visible focus, readable contrast, and accessible dialog behavior. Provide reduced-motion alternatives with `prefers-reduced-motion`.
- Use consistent design tokens. Prefer a few purposeful animations with smooth state changes over continuous motion everywhere.

## Suggested time allocation

The deadline is authoritative; these checkpoints are guidance, not separate timers.

- Minutes 0–8: scaffold, design direction, tokens, page structure, mock dataset.
- Minutes 8–30: hero, network, financial dashboard, assistant, security, final CTA.
- Minutes 30–45: integrate interactions, responsive layouts, and accessibility.
- Minutes 45–55: run the app, inspect desktop/mobile, fix issues, refine the first pass.
- Minutes 55–60: final checks, history, run instructions, and presentation notes.

## Acceptance checklist

Check items only after verifying them. Record incomplete items at handoff.

- [ ] React app starts locally with documented commands and requires no backend.
- [ ] Hero contains NOVA branding, headline, supporting copy, two working CTAs, an interactive visual, and purposeful motion.
- [ ] Live financial network includes Lagos, Abuja, Accra, Nairobi, and London.
- [ ] Dashboard shows coherent mock balance, transactions, revenue/spending, charts, and useful interactive controls.
- [ ] NOVA AI responds interactively with insights grounded in the displayed mock data.
- [ ] Security/trust section uses visual storytelling or interaction.
- [ ] Final CTA completes a clear demo flow with visible feedback.
- [ ] Desktop and mobile layouts are inspected; core controls work with keyboard and touch.
- [ ] Reduced motion works, and important text and controls remain readable.
- [ ] Available type checks, lint checks, and production build pass; console/runtime errors are addressed.
- [ ] At least one observed first-pass weakness is improved and documented.
- [ ] Source, local running app, actual AI history/prompts, and five-minute presentation notes are ready.

Use checks appropriate to the implemented interactions. Do not spend the challenge writing tests that merely duplicate implementation details. If browser inspection is unavailable, document that limitation rather than claiming visual verification.

## Evidence and final handoff

Maintain `docs/AI_DEVELOPMENT_LOG.md` throughout development. Preserve actual user instructions and consequential AI decisions. Distinguish verbatim prompts, assistant-authored plans, and summaries; never invent user prompts or verification results.

For three important actual instructions, record the problem, why the instruction was given, the output, and subsequent refinements. Capture one difficult decision with the initial result, the observed shortcoming, and the improvement. The curated log supplements the conversation; do not claim it is a full transcript. Preserve/export the original conversation if that capability is available.

At handoff include local run/build commands, completed features, verification results, remaining limitations, the application URL if running, and a five-minute demonstration sequence.
