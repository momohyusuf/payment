# NOVA — five-minute demonstration

## 0:00–0:35 · Set the vision

Open the landing page. NOVA is a fictional financial operating system for ambitious African businesses. Point out the editorial hierarchy, cobalt network, and working hero actions. Select a city in the miniature map.

## 0:35–1:20 · Show the signature network

Scroll to the network. Select Lagos–Nairobi, then Lagos–London. Explain that the displayed rates and arrival times are simulated. Open “Try this route” and send ₦250,000. The dialog previews the recipient amount and ₦100 fee. Confirm once and show the completed demo payment.

## 1:20–1:55 · Reconcile the money

Select “See updated activity.” The initial balance is ₦17,200,000. After this payment it is ₦16,949,900. Show the transfer and separate fee, changed spending, and cash-flow chart. Change the reporting period, filter activity, and search a merchant.

## 1:55–2:25 · Ask NOVA AI

Open the dedicated NOVA AI modal from the dashboard. Choose “Understand cash flow,” then “Explain that” to demonstrate guided follow-ups. Select “Review unusual payments” to surface the ₦850,000 marketing expense, then ask “How should I review this payment?” to see the checklist. Close and reopen to show session history. This is deterministic analysis of the updated mock ledger, not a live model.

## 2:25–2:55 · Trust and next step

Change the security control and show the diagram responding. Open the final CTA and submit a demo email. The confirmation explicitly states that no email was submitted. Mention mobile layouts and reduced-motion support.

## 2:55–4:30 · Three actual instructions

1. **“PLEASE IMPLEMENT THIS PLAN”**, followed by the complete agreed plan in the conversation. Purpose: turn the six-part brief into one coherent business journey. Result: hero, connected payment network, live ledger, assistant, security, and CTA. Refinement: browser inspection exposed a runtime issue that static build/lint did not catch.
2. **“Continue ensure all implementation follwos the same coding standards styling will be done with tailwind css icons lucide react”**. Purpose: establish the user's chosen styling and icon stack. Result: Tailwind's Vite plugin, shared theme tokens, utility-styled components, and Lucide icons. Refinement: adapted to the newly present Vite starter instead of reverting its installed tooling.
3. **“also conponent are highly reuseable”**. Purpose: keep the experience maintainable and consistent. Result: shared Button, Modal, Brand, Status, and SectionHeading components; separate feature components; shared financial calculations. Refinement: the same dialog behavior supports both transfers and the waitlist, and assistant insights derive from the same ledger as the dashboard.

## 4:30–5:00 · Difficult decision and honest limits

The first implementation passed build and lint but failed in the browser: a security icon variable named `Symbol` shadowed the JavaScript global used by the React compiler. Renaming it to `ControlIcon` resolved the runtime failure. That correction occurred after the challenge deadline; do not claim a fully compliant 60-minute finish.

The initial saved browser script had overly strict autofocus and exact-text assertions. Those expectations were corrected during the later, explicitly requested chatbot enhancement. The original challenge timing deviation remains recorded; the later chat work is separate. All financial operations, AI, trust illustrations, and signup remain local simulations.
