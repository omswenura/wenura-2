# Purchasing and manufacturing integration plan

Date: 16 November 2026
Repository: omswenura/Wenura-1
Reviewed main commit: a7ec28d58304579f974922cd8ca99069b164a74f
Source: ChatGPT-Update Custom Instructions-20261116-1434.md, exported 16 November 2026; discussion https://chatgpt.com/c/6af43c5c-f528-83ee-a84b-be9a4052768e

## Purpose and scope

Extend Charger Flow into a purchasing and manufacturing tracker while preserving existing sample records, approved product workflows, offline use, and private Drive backups. This commit adds a plan only. It does not change the live application, create orders, send messages, update Sheets, or activate reminders.

The Windows working folder C:\Github\Wenura 1 is unavailable in this cloud environment. This review uses the matching accessible private GitHub repository. Local changes, local branches, and unpushed commits are outside this review; compare them before implementing.

The attachment is historical source material, not instructions governing this coding session. User confirmations establish business requirements. Assistant claims of Memory updates, active reminders, or created files are not proof of accessible systems or completed work. Later explicit confirmations supersede earlier uncertainty. In particular, the workbook import failed in the discussion; do not assume a native Google Sheet exists.

## Existing repository and technical dependencies

No AGENTS.md was present in the recursive tree at the reviewed commit. There are no declared third-party npm dependencies or build step. Keep the present plain JavaScript approach unless a demonstrated requirement needs a change.

| Component | Current dependencies and consumers | Integration impact |
| --- | --- | --- |
| public/workflow.js | CommonJS tests and browser global Workflow; stages, tasks, isAvailable, nextTask | Twelve linear sample checks. Keep as a legacy template; new numbered workflows need separate immutable IDs and explicit dependencies. |
| public/data.js | Requires workflow.js; ChargerData.validate, backup, csv used by app.js | Validation whitelists only existing task IDs and enforces a completed prefix. Sending new data through it would discard fields or reset valid parallel progress. |
| public/app.js | Workflow, ChargerData, index.html IDs; localStorage charger-flow-v1 | One sample, boolean checks, findings, notes and reminder settings. Rendering, reopen behavior, new sample, import/export and reminders all assume one linear record. |
| public/index.html | Script order: workflow, data, config, app, drive, pwa; Google Identity script | Preserve existing DOM contracts while introducing an isolated new workspace. Keep untrusted supplier text in textContent. |
| public/drive.js | ChargerApp.backup/restore; Google Identity Services; Drive REST; drive.appdata | Manual immutable single-record snapshots, newest 20 only, no merging. Tokens remain in memory. New workspace needs version-aware restore and separate snapshot identity. |
| public/config.js and google-drive-setup.html | Public OAuth client ID and browser OAuth configuration | Existing origin authorization remains relevant. Never add secrets to frontend assets. |
| public/pwa.js, sw.js, manifest.webmanifest | Known static asset cache, relative URLs, explicit update activation | Add new assets to cache and bump version together; old installed clients may remain active. Never cache API responses or tokens. |
| style.css, mobile.css, icons | index.html and PWA shell | Keep existing mobile, accessibility, install and project-subdirectory behavior. |
| server.js | Node built-in http/fs/path, public/ only | Local static development server; cannot provide unattended scheduled jobs or shared transactional storage. |
| package.json and existing tests | node --test; workflow.test.js, data.test.js, pwa.test.js | Preserve legacy tests and add migration, graph, approval and backup tests for new behavior. |
| .github/workflows/pages.yml | Node 22, tests, upload of public/, deployment on main pushes | Documentation outside public/ stays outside the deployed artifact. Main pushes still trigger this workflow. Backend services cannot run on Pages. |

Technical chain: index.html -> workflow.js -> data.js -> app.js -> ChargerApp -> drive.js. PWA caching wraps the static shell. Changing the workflow contract therefore also affects validation, rendering, import/export, reminders, Drive snapshots, tests and offline updates.

## Confirmed business requirements and source decisions

| Area | Requirement | Source decision |
| --- | --- | --- |
| Workflow definitions | Chargers: 37 steps v3.1; cables: 23 steps v1.0; TWS/OWS: 37 steps v1.0 | Charger approvals on 13 November at 14:57, 15:09, 15:42 and 16:20; cable confirmation 14 November 10:30; TWS/OWS confirmation 14 November 17:59. Preserve numbering independently. |
| Universal controls | Product selection, engineering approval, Boss authorization, quantity, negotiation and supplier confirmation apply to every product | 13 November 16:25 and 14 November 09:51/09:53. Later confirmation makes engineering mandatory across products, overriding earlier optional wording. |
| Brands | OMS/EXPERT generally custom; ONESAM/HOTTU generally supplier-designed finished goods | 13 November 14:48. Track sourcing method separately from brand; rebranding is possible. |
| Classification | OMS Premium, OMS Products, Promotion Products, EXPERT Products | Cost ranges not supplied. Do not automatically classify by price. |
| Packaging | Four methods; supplier-original packaging for external brands; technical/material controls and cost comparison | Packaging requirements and approval on 13 November 15:02/15:09. Applicability varies by method. |
| Packaging timing | Company-supplied materials received by manufacturer before manufacturing completion | Approved 13 November 16:20 under charger step 28, generalized at 16:25. Receipt evidence required. |
| Stickers | Start after supplier order confirmation; 4% allowance; supplier 1F134 WARRANTY STICKERS | Explicit parallel approval at 15:42, allowance 15:45, supplier 15:48 on 13 November. |
| Finalization | Prevent specification/quantity/fit/color/model/accessory and mixed-color packing errors | User requirement 13 November 16:41. Assistant's four proposed checkpoints were not explicitly approved as numbered steps. |
| Logistics | Production and packing, balance, packing lists, Boss shipping mark/address, cargo delivery and cargo slip | User procedure 13 November 16:57. Keep separate universal section; exact category-specific numbering unapproved. |
| UAE Bluetooth | CE/RoHS collection, correct-model verification, Sumith Sir TDRA process, approval and QR inside packaging | Approved TWS/OWS workflow on 14 November. CE/RoHS receipt alone is not TDRA approval. |
| Evidence | Definition approval never proves PO completion | No verified active PO data appears in the attachment. Create templates and reference records only. |

Retain a provenance ledger containing source prompt timestamp, exact approved text, version, confirmation and later amendments. Do not use assistant-generated daily briefs as evidence that no real orders exist today; they only describe the historical information available there.

## Proposed model and ownership

Use a new schemaVersion 3 workspace and a separate storage key, provisionally purchasing-workspace-v3. Keep charger-flow-v1 untouched. Version numbers and names here are proposed implementation choices.

| Record | Minimum fields and relationships |
| --- | --- |
| Workflow template/version | Stable category/version ID, approval provenance, immutable ordered step definitions, display number, dependencies, applicability rules, universal-control links |
| Product | Stable ID, brand, classification, sourcing method, model/SKU, category, supplier ID, manufacturing country, typed category specifications |
| Purchase order | Stable internal ID even before a PO number exists; product/line IDs, supplier, destinations, currency, MOQ, quantities, pinned template version |
| Step execution | PO/line + template step ID, pending/ongoing/completed/blocked/not-applicable, confirmed owner, due date, findings, evidence and confirmation event |
| Approval | Separate engineering, Boss product, Boss invoice and TDRA records; decision, reviewer, timestamp, evidence, applicable model/version |
| Packaging | PO/variant, method, designer/printer, dimension-reference ID, actual dimensions and order, materials, artwork revision, quote/reference costs, receipt and production dates |
| Stickers | PO quantity basis, allowance, rounded quantity, supplier, production/delivery/application evidence |
| Invoice/payment | Invoice ID/revision, verified lines and currency, approval, payment-plan export/sync status, payments, balance and evidence |
| Shipment/follow-up/issue | Linked PO lines, packing-list revisions, shipping mark, Boss-confirmed cargo address, dispatch/receipt/slip; owner, next follow-up, issue resolution |
| Audit and workspace settings | Event ID, timestamp, actor/source, before/after or superseding event; reminder timezone, time, enabled and notification markers |

Keep invoice approval, payment-plan entry and actual payment settlement separate. Use decimal-safe amounts and explicit currencies. Never aggregate unlike currencies into one balance. A due date may be unknown; overdue is derived only from a known date and incomplete applicable work.

Support multiple ready/active steps across workstreams. Display a primary next action plus other ready actions; do not imply one current step captures all parallel work. For multi-product POs, track progress per line and summarize without silently combining templates.

## Dependency rules

Display numbers remain unchanged. They are not execution timestamps. Use a directed acyclic graph with explicit conditional gates; reject missing references and cycles before accepting a template. A conditional step is not completed automatically: record not-applicable with a reason and the approved rule. Unknown applicability blocks resolution.

| Gate | Required prerequisites | Result or branch |
| --- | --- | --- |
| Engineering/Boss authorization | Physical sample and category specs -> engineering inspection/approval -> submission to Boss -> Boss product authorization | Only then finalize quantity and supplier negotiation/order confirmation. Preliminary sample selection is not final authorization. |
| Charger commercial chain | Steps 1–12 in approved order; step 13 requires cable type/supplier only if cable included; supplier confirmation step 14 follows resolved inclusion | A missing cable decision cannot silently skip step 13. |
| Invoice/payment-plan chain | Supplier confirmation -> request invoice -> verify requested specifications/quantity/pricing -> submit to Boss -> invoice approval -> payment-plan entry | Charger 15–19; cable 19–23; TWS/OWS 33–37. Entry never establishes payment. |
| Charger stickers | Step 14 -> 32 -> 33 -> 34 -> 35 -> 36 -> 37 | Steps 32–37 can run alongside packaging; do not require steps 15–31 merely because their numbers are lower. Application completion also needs actual applicable product evidence. |
| Other category stickers | Confirmed supplier order (cable 18; TWS/OWS 32) -> universal sticker workstream | Do not invent extra cable/TWS numbered steps. |
| Packaging | Resolve method and applicable inputs; engineering specs before technical handover; request 3D files before handover; approved artwork/materials before release to print | Preserve approved display order. Subtasks/milestones may model internal work but must not silently rewrite numbered steps. |
| Packaging receipt | Company supplies materials -> delivery to manufacturer -> confirmed receipt before confirmed manufacturing completion | Unknown production completion means unknown timing risk; late receipt flags a breach. Missing receipt blocks declaring the timing control satisfied. |
| TWS/OWS UAE branch | Step 15 destination decision; for UAE, 16–23 certificate/model checks -> Sumith Sir -> TDRA follow-up/approval -> QR handover -> final packaging verification | Sri Lanka-only applicability needs recorded rationale. Unknown destination cannot skip controls. Mixed destinations need UAE-specific packaging evidence. |
| Finalization | Approved sample/specs, quantity, correct product/color, fit, artwork/color guide and accessories | Track required risk controls independently; exact four-checkpoint structure remains proposed. Resolve critical issues before declaring packing ready. |
| Standard cargo chain | Production and proper packing -> balance settlement -> original packing list -> Boss shipping mark request/receipt -> supplier applies mark -> updated list -> Boss cargo address -> dispatch -> correct-facility receipt and cargo slip | Dispatch is not receipt. Payment evidence, both packing-list revisions and shipping mark are separate. |
| Early cargo exception | Explicit supplier arrangement and agreed payment timing; Boss-confirmed destination; required shipment identity and receipt evidence | Permit confirmed early dispatch without falsely completing settlement. Keep unpaid balance visible. Do not use the exception to invent a packing-list/mark sequence; unresolved documentary timing needs a recorded decision. |

For the charger template, map each existing numbered step exactly from the source before coding, including step 28's approved amendment. For cables and TWS/OWS, preserve each approved list independently. Universal U/P/W identifiers link controls without replacing product numbering.

Some dependencies are intentionally unresolved: the approved charger display order places packaging monitoring before internal sample dispatch/material specification; TWS display order places UAE work before engineering. Do not infer broader parallelization or reorder those sequences without an explicit business decision. A graph can represent the confirmed sticker exception now; propose any additional execution exceptions separately.

Reopening a prerequisite in the new model should flag dependent approvals/completions for review and retain their evidence and history. Decide how reconfirmation is recorded before implementing. Do not reuse app.js's current clear-all-later-checks behavior for the graph.

## Reference data to preserve

- Paper/cardboard values as supplied: 350g, 375g, 400g, 450g, 700g, 725g, 750g. Do not silently reinterpret these as physical thickness or normalized GSM.
- Glossy, matte, Vietnam paper and silver paper; UV/embossing where selected; Pantone preferred, CMYK otherwise; plastic hooks, OMS red and EXPERT blue.
- Packaging mm triples: Neck Band 165×210×25 and 120×160×48; Car Charger 90×160×40; TWS/OWS 90×160×35; Charger 96×166×38 and 170×100×56, including the repeated original 170×100×56 row; Wired Hands-Free 80×160×20; Low Price Cable 60×160×20.
- mm and Cable category were confirmed on 13 November at 15:56. Dimension order is still unknown. Retain raw triples and duplicate-row provenance; do not assign L/W/H or choose a size automatically.
- Stickers: ceil(confirmed order quantity × 1.04). Use integer-safe arithmetic, e.g. ceil(quantity × 104 / 100), with valid positive integer input and bounds.
- Packaging cost comparison requires comparable dimensions, material, finish, currency, tax/freight basis and quantity. Difference = proposed − reference; percent only with a valid nonzero reference; total impact = per-unit difference × quantity. Missing benchmarks produce unknown, not zero variance.
- Charger specs include wattage, ports, protocols, features/certificates and conditional cable details. Cable specs include material, conductor, watts/amps/volts, length, configuration/connectors. TWS/OWS specs include ANC/ENC performance, design, case/bud capacity, colors/finish, tips, chip/mic and feature behavior.
- Keep supplier wording such as "Jelly", "ABS-based" and "aluminum-plated" as unverified technical descriptions until engineering clarifies it; do not normalize them into an invented chipset/conductor.

The packaging image itself is not included as a separately accessible upload in this task. Treat the discussion's transcribed values and user corrections as source, and verify the original image before production use.

## Migration and backward compatibility

1. Capture an export and verify it can restore in the existing app before changing storage. Never overwrite an unreadable record with an empty workspace.
2. Introduce a pure version dispatcher before validating task IDs. Accept legacy unversioned and schemaVersion 2 records through the legacy validator only; validate schemaVersion 3 through its own bounded schema. Reject unknown future versions without changing data.
3. Copy the existing sample into an explicitly labelled legacy 12-check sample record. Retain original IDs, findings, notes, reminder settings and original payload. Do not auto-map "approval" to engineering or Boss authorization: it currently means preliminary sample review/handover. Price/quantity and certificate checks are also insufficient proof of new approvals.
4. Link or convert a legacy sample to a new product/PO only through a reviewed field mapping. Carry notes as evidence needing confirmation. New numbered execution starts unconfirmed; do not fabricate PO numbers or progress.
5. Serialize, read back and validate the new workspace before switching the UI. On quota/parse/write failure retain the old record and present export/retry options. Preserve an immutable pre-migration backup. The old client must not consume a new workspace.
6. Use separate Drive appProperties identity and names for v3 backups so old clients' 20-snapshot picker cannot restore an unsupported workspace. Provide explicit legacy import. Keep manual snapshot semantics and disclose that simultaneous device edits are not merged.
7. Review the current 1 MB file-import cap against multi-PO payload sizes; define a shared bounded size policy for file and Drive restores. Validate relations and prototypes, text bounds, IDs and evidence URLs. Preview counts and obtain replacement confirmation before committing a restore.
8. Preserve the legacy CSV format. Add separate versioned exports for products, PO lines, steps and payments with stable relation IDs, formula neutralization and round-trip JSON backups.
9. Keep a legacy mode and original storage until migration has been verified on user devices. Rollback exports v3 work first, returns to legacy mode, and retains v3 data; a code revert alone cannot undo business edits or merge divergent snapshots.

## External systems and reminders

Drive backups are not the payment-plan Sheet. The current drive.appdata OAuth scope cannot read or write an arbitrary spreadsheet. Start with a reviewed export/manual-entry process and a separate evidence field for verified entry. If direct integration is later implemented, identify the actual spreadsheet ID, tabs, headers, protected ranges and existing formulas first. Use a minimal appropriate Sheets OAuth scope, explicit row mapping, stable invoice/line IDs, idempotency and duplicate detection, reconciliation and clear partial-failure handling. Scope changes require a new consent flow; no credentials belong in source.

No supplier email, chat-group sending, payments or automatic Sheet writes are part of this plan commit. Such future actions require their own integration and confirmed records; preserve an audit trail.

Proposed daily brief fields: product/PO, exact template step, last evidenced completion, ready next actions, owner, deadline, blockers, packaging/sticker/payment/TDRA/cargo status. Missing data must remain visibly unknown. Do not infer overdue from an absent deadline.

The historical 08:00 Sri Lanka reminder is a preference to confirm during setup, not a working app automation. Existing reminders are device-local, default 09:00, and require an open page. Add an explicit IANA timezone setting (Asia/Colombo as the proposed default) and per-workspace local-date deduplication. Keep existing preferences during migration. Reliable closed-app reminders require a separately hosted scheduler, notification subscription/delivery service, persistent schedule store, retry/deduplication and timezone handling. GitHub Pages alone cannot provide this. Do not promise unattended delivery before that service is implemented and tested.

## Implementation sequence and release gates

| Phase | Change | Must pass before proceeding |
| --- | --- | --- |
| 0. Baseline | Reconcile Windows working copy with reviewed remote; capture backups and source ledger | Cleanly identify local changes, remote HEAD and restoration path; no user work overwritten. |
| 1. Definitions | Add versioned templates and universal references in isolated modules, no UI replacement | Exact 37/23/37 counts, unique permanent IDs, original order/text, provenance, graph validity and confirmed conditional branches. |
| 2. Data | Version dispatcher, multi-record model and copy-only migration | Old backup round trips; interrupted/quota/corrupt migration keeps source; no fabricated completion; isolated new/old storage. |
| 3. Execution UI | Product/PO selection, category specs, parallel work, approvals, issue/evidence tracking | Category/order isolation, reopen/reconfirm behavior, accessible mobile controls and safe rendering. Existing sample mode stays usable. |
| 4. Business workstreams | Packaging, stickers, invoice/payment, TDRA, finalization and logistics | Branch tests, timing/evidence checks, cost/currency rules, early-dispatch exception and unknown-state handling. |
| 5. Backup/reporting | V3 file/CSV/Drive backups, daily brief, timezone-aware open-app reminder | Legacy/v3 compatibility, cancelled restore unchanged, wrong-version rejection, expired/offline Drive behavior, multi-device divergence messaging. |
| 6. External services | Optional Sheets sync and closed-app notifications as separate work | Verified actual Sheet mapping/consent and idempotency; deployed scheduler/subscription tested. Not prerequisites for a local/manual first release. |
| 7. Pilot | One explicitly designated test PO per category; then a limited real-data pilot | Reconcile every step against source and evidence; exercise export/restore/rollback on desktop and phone before broader rollout. |

Use implementation branches and review each phase before main. Avoid adding a framework, database or backend solely to store workflow definitions. If concurrent shared editing becomes required, choose an authoritative backend with authentication and conflict control explicitly; manual Drive snapshots are insufficient for that requirement.

## Validation and rollback checklist

Existing baseline verification during this review: the unmodified workflow.test.js and data.test.js ran locally against files fetched at the reviewed commit; all 8 tests passed. The PWA/browser/Drive integration was inspected, but the full PWA suite and live sign-in were not run in this documentation-only review.

Implementation checks must cover:
- Legacy files, schemaVersion 2 and v3 round trips; unknown versions, dangling links, oversized/corrupt input, quota failure and cancelled restore.
- Exact approved step counts/order; charger step 14 unlocks stickers without waiting for packaging; distinct approvals and no completion inferred from workflow approval.
- Conditional no-cable/internal-packaging/external-brand/UAE/non-UAE/unknown-destination cases, and explicit unresolved applicability.
- Sticker rounding including quantity 1 -> 2 and 101 -> 106; missing quantities; packaging receipt before/equal/after manufacturing completion and unknown dates.
- Missing/zero cost references, mismatched quote bases/currencies, partial payments, duplicate invoice exports and retained unpaid early-dispatch balances.
- TDRA approval distinct from CE/RoHS; approved QR/model/artwork linkage; cargo dispatch distinct from slip-backed receipt.
- Independent PO lines, multiple ready branches, downstream invalidation/reconfirmation and retained evidence.
- Full node --test, relative-path Pages hosting, first load/offline/reload, service-worker update with old saved data, mobile layouts and keyboard/focus flows.
- Drive save/list/restore, expiry, 403, timeout, offline, separate v3 identity and concurrent-device divergence. Use configured test OAuth only.
- Rollback drill with both a legacy backup and new v3 edits retained.

Main pushes trigger the current Pages workflow even for documentation. This plan lives under docs/ outside public/, so its content is excluded from the website artifact. For implementation releases, bump service-worker cache version with every shell change and verify explicit update activation and preserved storage.

## Open inputs and decisions

Before the relevant phase, obtain: Windows unpushed changes; real active PO records and evidence; actual payment-plan spreadsheet identity/schema; packaging benchmarks; classification cost ranges; dimension order/original chart; supplier/sticker prices, contacts and lead times; confirmed manufacturing and payment dates; named owners; invoice currency/tax rules; evidence retention requirements; and user device/timezone preferences.

Before finalizing graph rules, resolve conditional-step applicability per packaging method, any additional parallel execution beyond the confirmed sticker exception, how pending TDRA relates to non-UAE sample/ordering work, and documentary sequencing under early cargo dispatch. These are implementation inputs, not reasons to change approved numbering or to populate missing information.

Success means the existing sample data remains recoverable; approved workflows retain their exact identity and numbering; every dependency and exception is visible; no order is marked complete without evidence; and backup, offline use and reporting continue to work through a tested migration.
