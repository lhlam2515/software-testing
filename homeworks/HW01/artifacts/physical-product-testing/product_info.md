# Physical Product — Device Information

## Device Metadata

| Field               | Value                                         |
| ------------------- | --------------------------------------------- |
| **Brand**           | Senko                                         |
| **Model**           | TC1626                                        |
| **Type**            | Wall-mounted oscillating fan                  |
| **Year**            | `09/2022`                                     |
| **Serial Number**   | `N/A`                                         |
| **Photo evidence**  | [`./assets/device.jpg`](./assets/device.jpg)  |

> **Anti-cheat note:** The photo at `./assets/device.jpg` shows the device and the student ID card in the **same frame**, as required by HW01 §Anti-AI-Cheat mechanisms.

---

## Control Sub-system Description

The TC1626 has three independent mechanical control sub-systems. All inputs are purely mechanical — no electronic control board, no remote.

### Sub-system 1 — SPEED (right pull-cord)

A mechanical ratchet cycles the motor through four discrete states in a fixed loop:

```
OFF (Level 0) → Level 1 (low) → Level 2 (medium) → Level 3 (high) → OFF (Level 0) → …
```

Each pull of the right cord advances exactly one step. The state is stored mechanically inside the rotary switch; it **persists across power interruptions** (the motor restarts at whatever level the switch is parked at when power is restored).

### Sub-system 2 — SWING (left pull-cord)

A single pull of the left cord toggles the automatic left–right oscillation motor:

- **ON** → fan head sweeps left and right continuously.
- **OFF** → fan head stops and holds its current angular position.

The swing mechanism is driven by a dedicated small motor coupled to the main shaft. Its on/off state is stored mechanically and is **independent of the SPEED level**.

### Sub-system 3 — TILT (neck pivot joint)

A detent (latch) mechanism between the fan head and the motor housing allows manual vertical angle adjustment:

- The operator pushes the fan head up or down by hand.
- A series of fixed notches provides discrete stop positions across the full tilt range.
- Each notch produces an audible/tactile "click" and holds the head firmly against gravity and vibration.
- **No tool required** — the detent force is calibrated for one-hand adjustment.

---

## Defect Logging

All defects found during test execution are logged as **GitHub Issues** in the project repository, per HW01 Clarification §124. Screenshots of the Issues page (showing GitHub username) are required for submission.

---

## References

- HW01 README.md, §Requirement 3 (Physical Product)
- Senko TC1626 product label (on device)
