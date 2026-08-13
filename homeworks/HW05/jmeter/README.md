# HW05 JMeter Performance Tests

## Backend Findings

- Base URL: `http://localhost:3000`
- Login: `POST /api/login`
- Read-heavy workload: `GET /api/admin/orders`
- Transactional workload: `PUT /api/admin/orders/:id/status`
- Auth: JWT bearer token in `Authorization: Bearer <token>`

Admin seed account in the backend database:

- Email: `admin@eshop.com`
- Password: `Admin123!`

The backend seeds many orders already, and the JMeter plans also create a fresh order through `POST /api/checkout` before the status update step. That keeps the transactional request reproducible even when the database state changes between runs.

## Existing JMeter Structure

This folder already contained:

- 3 workload runner scripts:
  - `run-load.ps1`
  - `run-stress.ps1`
  - `run-spike.ps1`
- data files under `data/`
- generated report/output folders under `reports/` and `results/`

I extended that structure in place and now use three scenario-specific JMeter plans:

- [`plans/23127543_Load_20260813.jmx`](plans/23127543_Load_20260813.jmx)
- [`plans/23127543_Stress_20260813.jmx`](plans/23127543_Stress_20260813.jmx)
- [`plans/23127543_Spike_20260813.jmx`](plans/23127543_Spike_20260813.jmx)

## How Authentication Works

`POST /api/login` expects JSON:

```json
{
  "email": "admin@eshop.com",
  "password": "Admin123!"
}
```

The successful response contains:

- `message`
- `token`
- `user`

JMeter extracts `token` and reuses it as a bearer token in subsequent admin requests. No cookies or sessions are required.

## How Order IDs Are Chosen

The plan first calls `POST /api/checkout` using the authenticated admin token. The backend returns a fresh `orderId`, and the JMeter test extracts that value for the status update step.

This avoids depending on pre-existing order rows and prevents the update step from failing with `404 Not Found` when the seeded data is different or has already been consumed by a previous run.

## How Status Updates Work

`PUT /api/admin/orders/:id/status` expects:

```json
{
  "status": "confirmed"
}
```

The backend validates transitions. For repeated runs, `confirmed` is the safest target because the extractor selects a fresh `pending` order when available.

Backend-allowed transitions:

- `pending -> confirmed`
- `pending -> canceled`
- `confirmed -> shipping`
- `confirmed -> canceled`
- `shipping -> delivered`
- `canceled -> delivered`

## Data Files

The existing CSV files are sufficient:

- `data/admin-users.csv` for admin login
- `data/users.csv` remains available but is not required by this admin-only plan
- `data/products.csv` and `data/checkout-data.csv` are not required for the final admin workflow

No extra order/status CSV is needed because the plan uses live extraction from `POST /api/checkout`.

## Workloads

- Smoke/baseline: `1` thread, `1` ramp-up, `60` second duration, `1` loop
- Load: `10` threads, `60` ramp-up, `300` second duration, `2` loops
- Stress: `30` threads, `90` ramp-up, `600` second duration, `3` loops
- Spike: `50` threads, `8` ramp-up, `120` second duration, `1` loop

All four workloads use the same plan and differ only by runner parameters.

## How to Run

From `homeworks/HW05/jmeter`:

```powershell
.\run-smoke.ps1
.\run-load.ps1
.\run-stress.ps1
.\run-spike.ps1
```

To point at a specific JMeter installation:

```powershell
.\run-smoke.ps1 -JMeterHome 'C:\apache-jmeter-5.6.3'
```

If `JMETER_HOME` is set, the runner uses it automatically.

## Output

Each run writes:

- a `.jtl` results file under `results\<label>\`
- an HTML dashboard report under `results\<label>\report-<timestamp>\index.html`

Open the generated `index.html` in a browser to inspect the dashboard.

## Files in This JMeter Area

- `plans/23127543_Load_20260813.jmx`
- `plans/23127543_Stress_20260813.jmx`
- `plans/23127543_Spike_20260813.jmx`
- `Run-JMeter.ps1`
- `run-smoke.ps1`
- `run-load.ps1`
- `run-stress.ps1`
- `run-spike.ps1`
- `data/admin-users.csv`
- `data/users.csv`
- `data/products.csv`
- `data/checkout-data.csv`
