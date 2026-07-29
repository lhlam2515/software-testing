# Checklist Run — B2: Event Detail

**Scenario:** B — User registers for an event
**Screen:** Event detail (banner, schedule, register button, waitlist notice)

| Field | Value |
| ----- | ----- |
| URL | _TBD_ |
| Account / role used | _TBD_ |
| Browser / OS / viewport | _TBD_ |
| Run date | _TBD_ |
| Checklist version | [group/gui-checklist.md](../../../group/gui-checklist.md) — _TBD_ |

---

## Rules

- Run **every** item of the shared checklist against this screen. Mark `Passed`, `Failed` or `N/A`.
- `N/A` = the control class the item is written for does not exist on this screen. It is not a soft pass, and it is excluded from the pass-rate denominator.
- `Notes` is **mandatory for every Failed and every N/A item** — for Failed, the concrete defect; for N/A, the missing control class. Never a restatement of the item.
- Attach a screenshot **only for Failed items**, in `screenshots/`. Naming: `<CHECKLIST-ID>-<short-slug>.png`.
- Every Failed item that is a real defect must get a Finding ID and go into [FINDINGS_LOG.md](../../../FINDINGS_LOG.md) **and** the Google Form.

---

## Result summary

| Metric | Count |
| ------ | ----- |
| Items run (Passed + Failed) |  |
| Passed |  |
| Failed |  |
| N/A (not applicable to this screen) |  |
| Findings raised |  |

---

## Run table

| Checklist ID | Item | IA | Verdict (Passed \| Failed \| N/A) | Notes (reason for Failed or N/A) | Screenshot | Finding ID |
| ------------ | ---- | -- | ---------------------------- | -------------------------------- | ---------- | ---------- |
|  |  |  |  |  |  |  |

---

> **TODO:** paste one row per checklist item, keeping the IDs from the shared checklist.

> Legend: **Passed** / **Failed** = the item applies to this screen and was exercised. **N/A** = the item's control class (data list, form field, tab control, upload, …) does not exist here.
