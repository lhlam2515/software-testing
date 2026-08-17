# AI Optimization Judgment

This document classifies the AI recommendations against the actual backend code in `apps/backend/`.

| AI recommendation | Evidence from backend code | Architecture present? | Addresses observed bottleneck? | Feasibility | Reasoning |
| --- | --- | --- | --- | --- | --- |
| Add database indexes | `database.js` uses SQLite with `orders`, `users`, and `products` tables; `server.js` performs order reads and status updates | Yes | Conditionally | CONDITIONALLY FEASIBLE | Primary-key lookups already have implicit indexes; additional indexes may help specific query shapes, but the raw JTLs alone do not prove which one dominates. |
| Add connection pooling | Backend uses `sqlite3` directly | Not really | Possibly | CONDITIONALLY FEASIBLE | Classic pool tuning is not a strong fit for SQLite; serialization and access-pattern tuning are more relevant than a standard pool. |
| Enable SQLite WAL | SQLite is used directly in the backend | Yes | Possibly | FEASIBLE | WAL can improve concurrent read/write behavior for SQLite-backed workloads, though it still needs validation on this exact workload. |
| Cache the entire login endpoint | `POST /api/login` performs password checks and lockout handling | Yes | No clear evidence | HALLUCINATED / UNSUPPORTED | Caching login responses would be unsafe and is not justified by the evidence. |
| Increase thread counts to solve spike latency | JTL already shows 50-thread spike behavior | Yes, but wrong direction | No | HALLUCINATED / UNSUPPORTED | More threads would amplify load, not fix the observed latency growth. |

## Judgment summary

- FEASIBLE: SQLite WAL
- CONDITIONALLY FEASIBLE: indexing, query review, access-pattern tuning, pooling-like restructuring
- HALLUCINATED / UNSUPPORTED: login caching, thread inflation as a "fix"

## Reasoning

The backend is a small Express + SQLite service, so database-centric recommendations must be evaluated carefully. The evidence supports latency growth under load, but it does not by itself identify a single bottleneck with certainty. That means broad recommendations should be classified conservatively unless the code clearly supports them.
