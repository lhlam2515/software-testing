# Bug Report - HW05

**Tester:** Le Hoang Lam (23127216)
**SUT:** EShop, [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)
**GitHub Issues:** [github.com/lhlam2515/software-testing/issues](https://github.com/lhlam2515/software-testing/issues)
**Total bugs found:** 1 (BUG-05-LAM-007)
**Total performance issues found:** 3 (BUG-05-LAM-003, BUG-05-LAM-008, BUG-05-LAM-009)

---

## Scope

Two classes of finding are logged here:

- **Functional bugs**: error responses, crashes, and functional regressions surfaced under load. Required to be reported (section 6, Task 1).
- **Performance issues**: high latency, elevated error rate, resource exhaustion. Encouraged, not penalised if absent.

Each finding is cross-linked to a GitHub Issue with a screenshot in `assets/screenshots/issues/`.

---

## Bug Summary

| Bug ID | Type | Scenario found in | Endpoint group | Severity | Status | GitHub Issue |
| ------ | ---- | ----------------- | -------------- | -------- | ------ | ------------ |
| BUG-05-LAM-007 | Functional bug | Load (confirmed by code + log cross-check; load-independent) | Transactional | Critical | Open | Pending - to be filed |
| BUG-05-LAM-003 | Performance issue (resource exhaustion) | Endurance / Soak (confirmed), corroborated in Spike | Transactional | High | Open | Pending - to be filed |
| BUG-05-LAM-008 | Performance issue (connection failure under peak load) | Stress | Transactional | Low | Open | Pending - to be filed |
| BUG-05-LAM-009 | Performance issue (missing throttling, retry-storm amplification) | Spike | Auth-heavy | Low | Open | Pending - to be filed |

**Severity distribution:** 1 Critical (BUG-05-LAM-007), 1 High (BUG-05-LAM-003), 0 Medium, 2 Low (BUG-05-LAM-008, BUG-05-LAM-009)

---

## Detailed Findings

### BUG-05-LAM-007 - Checkout ignores the cart it is supposed to bill

**Type:** functional bug
**Scenario:** Load (confirmed here; the defect is a static code path, not load-induced, so it reproduces identically at Stress, Spike, Soak, or a single isolated request)
**Endpoint group:** Transactional
**Endpoint:** `POST /api/checkout`
**Severity:** Critical, order and payment data can be created with arbitrary, cart-unrelated totals, which is a business-invariant violation, not a cosmetic defect.

**Load conditions when observed**

| Field | Value |
| ----- | ----- |
| VUs at time of failure | Not load-dependent, reproducible at 1 VU / 1 request. Confirmed at 80 VU in the Load run (`23127216_Load_20260817.js`). |
| Elapsed time into run | N/A (present from the first checkout call) |
| Request rate | N/A (present at 35.5 RPS average in Load, and at every RPS level tested) |
| Backend CPU / RSS | Not relevant to this defect (it is a logic error, not a resource-exhaustion symptom) |

**Steps to reproduce**

1. `POST /api/login` with a valid account, obtain the JWT.
2. `POST /api/cart` one or more times with `Authorization: Bearer <token>` (or skip this step entirely and add nothing).
3. `POST /api/checkout` with `Authorization: Bearer <token>` and a body containing any `total_amount` and `shipping_address`, unrelated to what was added in step 2 (or with an empty cart).
4. Observe the response: `200 OK` with a generated `orderId`, regardless of cart state or the client-chosen `total_amount`.
5. `GET /api/cart` afterward: the items added in step 2 are still present, the cart was not cleared.

**Expected result**

Per `docs/eshop-sut/srs.md` FR-08 ("Thanh toan (Checkout)"): "Backend phai tu tinh lai tong tien; khong chap nhan gia tri `total_amount` do client gui len" (the backend must recompute the total itself, not accept a client-supplied `total_amount`), and "Sau thanh toan thanh cong, gio hang duoc xoa" (the cart is cleared after a successful checkout). Checkout should read the authenticated user's cart, compute `total_amount` from its contents, and clear it on success.

**Actual result**

`apps/backend/server.js:297-309` destructures `total_amount` and `shipping_address` directly from `req.body` and inserts an `orders` row with those client-supplied values, never reading `userCarts[userId]` (the same in-memory structure `POST /api/cart` writes to at `server.js:290-295`). The cart is never cleared on checkout either, since the handler makes no reference to `userCarts` at all. This is confirmed both by static code reading and by the test's own journey design: `artifacts/test-plans/lib/journey.js:268-277` builds the checkout payload from a random `total_amount` / `shipping_address` pair with an explicit comment that checkout "does NOT read the cart the previous step just built", and both requests succeed unconditionally in the raw log (`raw_load.csv:76` cart add at `ts=1786967987`, `raw_load.csv:247` checkout at `ts=1786967990`, both `status=200`, with no server-side linkage between them).

**Evidence**

- Code: `apps/backend/server.js:290-295` (`POST /api/cart` pushes to `userCarts[userId]`), `apps/backend/server.js:297-309` (`POST /api/checkout` reads `total_amount`/`shipping_address` from `req.body`, never touches `userCarts`)
- Test design confirmation: `artifacts/test-plans/lib/journey.js:268-277`, `artifacts/test-data/cart_checkout_payloads.csv:2-5` (checkout payloads carry a static `total_amount` independent of `product_id`/`quantity`)
- Raw log: `artifacts/results/raw/raw_load.csv:76` (cart, `ts=1786967987`, `status=200`), `artifacts/results/raw/raw_load.csv:247` (checkout, `ts=1786967990`, `status=200`)
- Spec: `docs/eshop-sut/srs.md`, FR-08 section (backend-side total recomputation and post-checkout cart clearing requirements)
- GitHub Issue: Pending - to be filed

**Notes**

Reproducible at a single request, not load-induced. Two distinct SRS violations live in the same code path: (1) the backend trusts a client-supplied `total_amount` instead of recomputing it, so a customer can set an arbitrary price for any order; (2) the cart is never cleared after checkout, so it also compounds BUG-05-LAM-003 (every successful checkout leaves its cart entries in `userCarts` forever, since nothing downstream of `POST /api/cart` ever removes them). Fixing checkout to read from and clear `userCarts` would address both this bug and part of the memory-growth root cause in BUG-05-LAM-003.

---

### BUG-05-LAM-003 - Unbounded in-memory `userCarts` causes continuous RSS growth with no plateau

**Type:** performance issue (resource exhaustion / memory leak)
**Scenario:** Endurance / Soak (`23127216_Soak_20260817.js`, primary confirmation), corroborated independently in Spike
**Endpoint group:** Transactional
**Endpoint:** `POST /api/cart`
**Severity:** High, memory never plateaus or self-recovers within the observed window; left running in production this is an eventual OOM / crash risk, but no crash or error response was observed within the 10.47-minute test window, so it falls short of Critical.

**Load conditions when observed**

| Field | Value |
| ----- | ----- |
| VUs at time of failure | 80 VU, constant (`constant-vus` executor, Soak run) |
| Elapsed time into run | Present from the first minute, growth is continuous through the full 10.47-minute run (628 monitor samples at 1/s) |
| Request rate | 178.5 RPS average (search+cart+checkout combined, per README.md Test Summary); cart step alone: 39,280 requests over the run (`soak_summary.json`, `overall[].step=="cart"`) |
| Backend CPU / RSS | RSS: 70,768 KB -> 216,444 KB (max 223,492 KB), +145,676 KB over 10.47 min (~13.9 MB/min). CPU: 17.5% avg / 18.7% max steady-state (excluding the ~30s startup burst which peaked at 29%) - CPU stays flat while RSS climbs, ruling out CPU-bound work as the cause. |

**Steps to reproduce**

1. Start the backend with a clean/seeded DB (fresh RSS baseline).
2. Run the shared journey (login -> search -> `POST /api/cart` -> `POST /api/checkout`) at a constant VU count for several minutes (`23127216_Soak_20260817.js`: 80 VU, `constant-vus`, 10m + 30s `gracefulStop`).
3. Sample backend RSS every 1s throughout the run (`artifacts/scripts/monitor.sh` -> `monitor_soak.csv`).
4. Plot RSS over elapsed time: it climbs monotonically, with no plateau, no sawtooth GC-recovery pattern.

**Expected result**

RSS should stabilize once the working set of active carts stops growing (e.g., a bounded per-user cart size, or entries that get released once an order is placed). A GC-driven sawtooth pattern (rise, then drop back down) would be normal; a straight, unbroken climb for the full run duration is not.

**Actual result**

RSS climbs from 70,768 KB to 216,444 KB (max observed 223,492 KB) over the 10.47-minute run, a monotonic, non-plateauing increase of +145,676 KB (~13.9 MB/min), while CPU stays flat at ~17.5% average. This is consistent with `apps/backend/server.js:14` (`const userCarts = {}`), a process-lifetime, unbounded, per-user in-memory object that `POST /api/cart` (`server.js:290-295`) `push()`es into on every call with no cap, TTL, or trim, and that `POST /api/checkout` never clears (see BUG-05-LAM-007). Independently, the same unbounded-growth signature reappears in the unrelated Spike scenario: `monitor_spike.csv` shows RSS climbing from 84,252 KB at t+45s to 230,248 KB by t+100s during the 200-VU surge, and it never drops back down through the end of monitoring at t+150s (last sample 231,824 KB), even after the VU count itself dropped from 200 back to 15 and then 0.

**Evidence**

- Code: `apps/backend/server.js:14` (`const userCarts = {}`), `apps/backend/server.js:290-295` (unbounded `push()`, no trim)
- Resource monitor (Soak): `artifacts/results/raw/monitor_soak.csv:2` (`2026-08-18T08:48:39.681Z`, `rss_kb=70768`), `artifacts/results/raw/monitor_soak.csv:627` (`2026-08-18T08:59:09.125Z`, `rss_kb=216444`)
- Aggregated numbers: `artifacts/results/raw/soak_summary.json`, `monitor` block (`rss_growth_kb=145676`, `rss_growth_kb_per_min=13918.09`, `rss_monotonic_nondecreasing=false`, `cpu_steady_avg_pct=17.51`)
- Cross-scenario corroboration (Spike): `artifacts/results/raw/monitor_spike.csv:56` (`07:57:24.162Z`, `rss_kb=93896`), `:73` (`07:57:41.293Z`, `rss_kb=216268`), `:90` (`07:57:58.408Z`, `rss_kb=226756`), `:112-117` (`07:58:20-25Z`, `rss_kb` holding at ~223,000-225,000, no drop)
- Resource monitor screenshot: `assets/screenshots/resource-monitor/23127216_Soak_20260817.png` (k6 running `23127216_Soak_20260817.js`, `monitor.sh` sampling backend PID 6863 into `monitor_soak.csv`, btop showing the `node` process's RES memory alongside)
- GitHub Issue: Pending - to be filed

**Notes**

`rss_monotonic_nondecreasing=false` in `soak_summary.json` means there are a few individual 1-second samples where RSS ticks down slightly (normal minor GC activity), but the overall trend across the whole run is a straight climb with no sustained plateau, this is the leak signature, not the per-sample noise. Root cause is a reasoned inference from the code (`userCarts` is the only unbounded, ever-growing, per-request-writable structure in the request path exercised by this journey) rather than a heap profiler trace; a future run with `--inspect` / heap snapshots would confirm the object identity directly, flagged as **needs human verification** for that specific level of proof. The RSS growth rate compounds directly with BUG-05-LAM-007 (checkout never clears the cart it should be consuming), so fixing checkout's cart handling should reduce, though not necessarily eliminate, this growth (a cap or TTL on `userCarts` entries is still needed independently, since even a "clear on checkout" fix leaves abandoned carts, e.g. dropped browser sessions, unbounded).

---

### BUG-05-LAM-008 - Isolated connection reset on `POST /api/cart` at the Stress breaking point (220 VU)

**Type:** performance issue (connection failure under peak concurrent load)
**Scenario:** Stress (`23127216_Stress_20260817.js`, `stage3_break_120-220VU`)
**Endpoint group:** Transactional
**Endpoint:** `POST /api/cart`
**Severity:** Low, a single occurrence out of 100,171 total Stress requests (0.001% of the run, 1/8,319 = 0.012% within its own stage/step bucket), not reproduced elsewhere in Load, Soak, or the rest of Stress, and it coincides with the already-documented latency cliff at the same 220 VU stage (checkout p95 jumps to 7,093ms in the same stage per README.md), so it reads as a symptom of the same peak-load saturation rather than a distinct defect.

**Load conditions when observed**

| Field | Value |
| ----- | ----- |
| VUs at time of failure | ~220 VU (`stage3_break_120-220VU`, target_vu=220) |
| Elapsed time into run | ~284s into the run (monitor start `2026-08-17T14:02:18.765Z`, event at `ts=1786975623` = `2026-08-17T14:07:03Z`), inside the stage3 window (elapsed 190-300s per `artifacts/scripts/analyze_raw.py` `STAGES`) |
| Request rate | Stage3 cart step: 8,319 requests over the ~110s stage window (~76 req/s for cart alone); overall Stress average 233 RPS (README.md) |
| Backend CPU / RSS | `cpu_pct=17.3`, `rss_kb=139660` at the nearest monitor sample (`2026-08-17T14:07:02.833Z`), not itself an outlier compared to the rest of Stress, so resource pressure alone does not obviously explain this one reset |

**Steps to reproduce**

1. Run the shared journey under a progressive stress ramp reaching ~220 VU (`23127216_Stress_20260817.js`, `stage3_break_120-220VU`).
2. Capture the raw `--out csv=` log for the whole run.
3. Filter `http_req_duration` rows for `POST /api/cart` with `status=0`.
4. Observe exactly one such row in the entire 430-second, 100,171-request run.

**Expected result**

Under peak concurrent load, requests should either complete with an HTTP response (2xx/4xx/5xx) or fail with a small, explainable, ideally-zero count of transport-level errors. A single isolated `read: connection reset by peer` is a soft signal of contention (accept-queue or socket-buffer pressure), not proof of an application defect.

**Actual result**

One `POST /api/cart` request (out of 8,319 cart requests in that stage) returned `status=0` with `error="read: connection reset by peer"` (`error_code=1220`), meaning the TCP connection was torn down before any HTTP response was produced. `error_code=1220` is k6's generic "connection reset" transport error, not an application-level error code from the SUT.

**Evidence**

- Raw log: `artifacts/results/raw/raw_stress.csv:683720-683728` (the full metric block for this one request; `http_req_duration` row at `:683721`), `timestamp=1786975623`, `error="read: connection reset by peer"`, `error_code=1220`, `scenario=stress`, `step=cart`
- Aggregated cross-check: `artifacts/results/raw/stress_percentiles_by_stage.json`, `stage3_break_120-220VU` / `step="cart"` row, `error_rate=0.00012020675561966583` (= 1/8,319), `count=8319`
- Resource monitor: `artifacts/results/raw/monitor_stress.csv:284` (`2026-08-17T14:07:02.833Z`, `rss_kb=139660`, `cpu_pct=17.3`); screenshot at `assets/screenshots/resource-monitor/23127216_Stress_20260817.png`
- GitHub Issue: Pending - to be filed

**Notes**

Not reproducible on demand from the evidence available, this is a single sample, and there is no retry in `journey.js` to show whether an immediate retry would have succeeded. Whole-file anomaly scans of `raw_load.csv` (13,988 requests) and `raw_soak.csv` (117,920 requests) found zero anomalies of any kind (0 rows with `status != 200` or non-empty `error`), so this failure mode only appears at or beyond the Stress breaking point (220 VU), consistent with generic OS-level connection/accept-queue exhaustion under extreme concurrency rather than a request-shape-specific application bug. **Needs human verification** if a definitive root cause (backend `listen()` backlog size, OS `somaxconn`, ephemeral port exhaustion) is required; the evidence here only supports "isolated, load-correlated, non-reproduced elsewhere."

---

### BUG-05-LAM-009 - Login retry-storm on already-locked accounts during the Spike surge, no server-side throttling signal

**Type:** performance issue (missing throttling / retry-storm amplification, elevated error rate)
**Scenario:** Spike (`23127216_Spike_20260817.js`, main `spike` scenario, not the `lockoutProbe` sub-scenario)
**Endpoint group:** Auth-heavy
**Endpoint:** `POST /api/login`
**Severity:** Low. The lockout mechanism itself matched FR-02 exactly and no incorrect data or user-facing correctness issue resulted; the finding is a missing hardening signal (no rate limiting / `Retry-After`) combined with a test-harness gap, not a SUT correctness defect.

**Load conditions when observed**

| Field | Value |
| ----- | ----- |
| VUs at time of failure | 200 VU (peak), failures concentrated during the ramp from 15 to 200 VU and the first ~30s of the 200-VU hold |
| Elapsed time into run | t+34s to t+68s from the first login of the run (absolute `2026-08-18T07:57:24Z` to `07:57:58Z`, run started `07:56:50Z`), overlapping the test plan's stage3 (5s climb, elapsed 30-35s) and the start of stage4 (30s hold at 200 VU, elapsed 35-65s) |
| Request rate | 7,886 failed logins compressed into a 34-second window, ~232 req/s of failed `POST /api/login` alone; overall Spike run average 161.3 RPS (README.md) |
| Backend CPU / RSS | CPU up to 15.9% within the window; RSS climbing from 93,896 KB (`monitor_spike.csv:56`) to 226,756 KB (`monitor_spike.csv:90`) across the same 34s, i.e. this window overlaps the RSS jump also cited under BUG-05-LAM-003 |

**Steps to reproduce**

1. Run (or have previously run) the `lockoutProbe` sub-scenario, which deliberately fails login 2+ times against 5 dedicated accounts (`perf_user_195..199`, `auth_credentials.csv` `valid_flag=false` rows), locking them for 180s (`server.js:56-58`).
2. Start the main `spike` scenario (ramp 15 -> 200 VU) without first running `artifacts/scripts/reset_lockout.js`, so those accounts are still inside their 180s lock window.
3. Because `ACCOUNTS` has exactly 200 entries and Spike peaks at exactly 200 VU (`__VU % ACCOUNTS.length` is a 1:1 bijection at peak, by the test plan's own design comment), each VU maps to a distinct account, so a locked account is only ever contacted by the one VU it belongs to, not by concurrent traffic from other VUs.
4. The VU(s) mapped to the still-locked accounts get `403` on their very first login attempt of the run, despite always sending the correct password (`journey.js`'s `login()` only ever uses `ACCOUNTS[__VU % ACCOUNTS.length]`, the real credential).
5. `journey.js:154-157` retries login on every subsequent iteration whenever `token` is `null`, with no backoff, and Spike runs with `THINK_MIN=0 THINK_MAX=0` (zero think-time for the whole scenario), so the affected VU(s) hammer `POST /api/login` back-to-back for as long as they stay alive.
6. `checks{step:login}` ends the run at a 2.43% pass rate, tripping its `rate>0.99` threshold.

**Expected result**

Per FR-02, an account should only lock after its own login failures reach the threshold, and a locked account should correctly reject all subsequent attempts (including correct-password ones) until the lock expires, this part is intentional per spec. Separately, a login endpoint under a retry storm from a small number of clients should ideally expose a throttling signal (e.g. `Retry-After`, or a distinct 429) so a well-behaved client can back off instead of re-attempting on every iteration.

**Actual result**

100% of the 7,886 failed spike-scenario login attempts returned `403` (locked), not `401` (wrong password), confirmed by a full scan of `raw_spike.csv` (0 rows with `scenario=spike, step=login, status=401`; 7,886 rows with `scenario=spike, step=login, status=403`). `apps/backend/server.js:40-44` returns `403` purely based on `user.locked_until` being in the future, checked before the password comparison at line 46, so this is fully consistent with pre-existing lock state, not a new lockout triggered by this run's own (always-correct) login traffic. The server returns a generic `403` with no `Retry-After` header or rate-limit signal, so `journey.js`'s no-backoff retry loop turned what is most plausibly a handful of already-locked accounts into 7,886 wasted requests concentrated in a 34-second window.

**Evidence**

- Console summary: `artifacts/results/raw/spike_console_summary.txt:8-28` (`checks{step:login} rate=2.43% FAIL (rate>0.99)`, `journey_login_failure_total: 7886`, `journey_relogin_total: 7883`)
- Status-code breakdown (derived this session by streaming `raw_spike.csv`, not a pre-existing committed summary): 7,886 `spike`-scenario `login` rows at `status=403`, 0 at `status=401`; separately, the `lockoutProbe` sub-scenario shows 7 rows at `status=401` and 8 rows at `status=403`, its own intended sequence
- Timing: failed-login timestamps span `1787039844` to `1787039878` (`2026-08-18T07:57:24Z` to `07:57:58Z`) in `raw_spike.csv`, all within the `step=login` rows for `scenario=spike`
- Code: `apps/backend/server.js:32-44` (lockout check precedes password comparison), `artifacts/test-plans/lib/journey.js:154-157` (no-backoff retry on null token), `artifacts/test-plans/23127216_Spike_20260817.js:31-32` (explicit comment: accounts `perf_user_195..199` are left locked from the previous run unless `reset_lockout.js` is run first), `artifacts/test-plans/config.js:23` (`ACCOUNTS` sized to `PERF_USER_COUNT`, confirmed 200 in `artifacts/test-data/auth_credentials.csv`'s companion pool)
- Resource monitor: `artifacts/results/raw/monitor_spike.csv:56,73,90` (RSS climbing through the same window); screenshot at `assets/screenshots/resource-monitor/23127216_Spike_20260817.png`
- Spec: `docs/eshop-sut/srs.md` FR-02 section
- GitHub Issue: Pending - to be filed

**Notes**

The lockout mechanism itself is **correct design**, it matches FR-02 and `server.js` exactly, and is not logged as a bug. What is flagged here is narrower: (1) a likely test-procedure gap, `reset_lockout.js` was probably not run before this particular capture, which is a process note for future runs more than a SUT defect; and (2) a genuine, if minor, SUT hardening gap, `POST /api/login` gives a locked-out client no signal (no `Retry-After`, no distinct rate-limit response) to discourage immediate retries, so a naive client can cheaply generate a disproportionate number of server-side requests against a small number of locked accounts. The exact number of distinct accounts affected (hypothesized as being close to the 5 `lockoutProbe` accounts, `perf_user_195..199`, since Spike's account-to-VU mapping is 1:1 and those VU numbers are only spun up during the ramp to 200, matching the observed failure window) **needs human verification**, the raw CSV carries no VU or account identifier, only aggregate request-level fields, so this cannot be confirmed to the account level from the artifacts alone. If confirmed, the fix is operational (always run `reset_lockout.js` before Spike) rather than a code change; if a broader concurrency-triggered lock is found instead on re-investigation with VU-level instrumentation, this severity should be revisited upward.
