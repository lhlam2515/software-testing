# Product Defect Report — Senko TC1626 Wall-mounted Fan

**Device:** Senko TC1626 · Wall-mounted oscillating fan  
**Tester:** Hoàng Lâm  
**Test date:** 2026-06-02  
**Total defects found:** 5  
**Source test cases:** [`test_cases.md`](test_cases.md)

---

## DEF-01 · Speed Level 1 Runs at Highest Speed (TC-S01)

### Defect Description

When the fan is powered off and the SPEED cord is pulled once, the motor starts at the highest airflow speed instead of the lowest. The speed ratchet mechanism on the pull-cord assembly appears to be wired or labeled in reverse order relative to the internal motor winding taps, causing Level 1 to map to the highest-RPM tap rather than the lowest.

### Steps to Reproduce

1. Ensure the fan is at Level 0 (motor off, power connected).
2. Pull the SPEED cord once to advance to Level 1.
3. Observe and feel the airflow intensity immediately after the motor starts.

### Expected vs Actual Result

- **Expected Result:** Motor runs at Level 1 with the lowest airflow speed (lowest RPM tap).
- **Actual Result:** Motor runs at Level 1 with the highest airflow speed (highest RPM tap).

---

## DEF-02 · Speed Decreases as Level Number Increases (TC-S02)

### Defect Description

As the user pulls the SPEED cord from Level 1 through Level 3, airflow speed decreases with each step instead of increasing. This is a direct consequence of DEF-01: because the ratchet sequence maps levels in reverse to the motor's winding taps, every subsequent notch selects a lower-RPM tap. The pull-cord ratchet mechanism and the motor's internal tap sequence are misaligned.

### Steps to Reproduce

1. Ensure the fan is at Level 0 (motor off).
2. Pull the SPEED cord three times in succession, pausing 2 seconds between each pull.
3. Observe and compare airflow intensity at Level 1, Level 2, and Level 3.

### Expected vs Actual Result

- **Expected Result:** Each pull increases airflow visibly; Level 3 produces the strongest airflow.
- **Actual Result:** Each pull decreases airflow visibly; Level 3 produces the weakest airflow.

---

## DEF-03 · Oscillation Sweep Is Asymmetrical Left–Right (TC-W03)

### Defect Description

During oscillation, the fan head sweeps a noticeably wider arc on the right side (from the observer's perspective) than on the left. The asymmetry is visible within the first full cycle. The root cause is likely a misalignment or wear in the oscillation cam or the limit-stop pins inside the gear box that define the left and right reversal points.

### Steps to Reproduce

1. Ensure the fan is running at Level 2.
2. Pull the SWING cord once to enable oscillation.
3. Observe one complete left–right sweep cycle and compare the angular extent on each side.

### Expected vs Actual Result

- **Expected Result:** The head sweeps symmetrically; both left and right arcs reach the same designed angular limit.
- **Actual Result:** The right arc is visibly wider than the left arc; the head over-travels on the right before reversing.


---

## DEF-04 · Oscillation Motion Jerks at Direction Reversal Points (TC-W05)

### Defect Description

During sustained oscillation, the fan head exhibits intermittent jerking at the moment it reverses direction. The motion is not smooth: instead of a clean deceleration-reversal-acceleration, there is a sudden mechanical jolt at one or both reversal points. This points to a worn, over-lubricated, or insufficiently lubricated cam follower or drive gear inside the oscillation mechanism.

### Steps to Reproduce

1. Ensure the fan is running at Level 2.
2. Enable oscillation by pulling the SWING cord once.
3. Observe 10 complete oscillation cycles, paying attention to the moment the head changes direction.

### Expected vs Actual Result

- **Expected Result:** Motion is smooth across all 10 cycles; no audible click, grind, or visible jolt at reversal points.
- **Actual Result:** Intermittent jerking observed during reversal in multiple cycles; motion is visibly uneven.

---

## DEF-05 · Rapid SPEED Cord Pulls Trigger Mid-Sweep Direction Reversal (EC-04)

### Defect Description

When the SPEED cord is pulled 3 or more times in rapid succession (~1 pull/second) while oscillation is active, the fan head abruptly reverses its sweep direction mid-sweep — before reaching the natural mechanical reversal point. Each rapid cord pull generates an impulse torque in the motor; under ≥ 3 accumulated pulls, the combined torque fluctuation couples into the oscillation cam mechanism and triggers an unintended reversal. This is a cross-subsystem timing interaction between the SPEED ratchet and the SWING cam drive train.

### Steps to Reproduce

1. Set the fan to Level 1 with oscillation ON.
2. Confirm the fan head is mid-sweep (not at a reversal point).
3. Pull the SPEED cord 3–4 times rapidly (~1 pull per second), completing at least one full ratchet cycle (Level 1 → 2 → 3 → 0).
4. Observe the fan head's direction of travel during and immediately after the rapid pulls.

### Expected vs Actual Result

- **Expected Result:** The fan head continues in its current sweep direction until it naturally reaches the mechanical reversal point; SPEED changes do not affect oscillation direction.
- **Actual Result:** The fan head reverses direction mid-sweep during the rapid SPEED transitions, before reaching the natural reversal point.
