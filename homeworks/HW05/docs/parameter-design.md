# Parameter Design

INITIAL AI/DESIGN PROPOSAL - REQUIRES HUMAN REVIEW

## Load

- Users: 5
- Ramp-up: 60 seconds
- Duration: 5 minutes
- Think time: 2-3 seconds
- Loop strategy: steady loops with a small fixed iteration cap

## Stress

INITIAL DESIGN - MUST BE ADJUSTED AFTER REAL EXECUTION

- Stage 1: 10 users
- Stage 2: 20 users
- Stage 3: 40 users
- Stage 4: 60 users
- Stage 5: 80 users
- Duration per stage: 2-3 minutes
- Think time: 1-2 seconds
- Stopping criteria:
  - unacceptable error rate
  - severe p95 increase
  - backend crash
  - resource exhaustion
  - severe throughput degradation

## Spike

INITIAL AI/DESIGN PROPOSAL - REQUIRES HUMAN REVIEW

- Baseline users: 5
- Spike users: 30
- Spike duration: 1-2 minutes
- Recovery duration: 3-5 minutes
- Think time: 1-2 seconds

## Notes

- These values are intentionally conservative and not experimentally validated.
- Adjust after real execution on the student's machine.

