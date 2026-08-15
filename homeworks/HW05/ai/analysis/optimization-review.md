# Optimization Review

| Recommendation | Evidence | Feasible/Hallucinated | Human Reasoning |
| --- | --- | --- | --- |
| Add database indexing for order lookups | Stress/Spike latencies grow sharply while `/api/admin/orders` is repeatedly read and the update path loads the order by id | Feasible | The backend issues repeated `SELECT status FROM orders WHERE id = ?` and joins orders/users for admin reads. Indexing `orders.id` already exists via primary key, but broader query tuning may still help the admin list path. |
| Add connection pooling | Long-running stress run shows average latency above 500 ms with zero errors | Feasible | The app uses SQLite, so classic pool tuning is less relevant than with client/server databases, but concurrency control and serialized access improvements are plausible. |
| Enable SQLite WAL | Stress/Spike show contention-like latency inflation with no functional failures | Feasible | WAL could improve read/write concurrency for SQLite-backed workloads if the backend is currently using default journaling. |
| Increase threads to "fix" spike latency | Spike already uses 50 threads and the system remains functionally correct | Hallucinated / Not justified | More threads would worsen the signal, not fix it, and the assignment wants observed performance behavior, not artificial normalisation. |
| Cache the entire login endpoint response | Login is already extremely fast in Load | Hallucinated / Not justified | The evidence does not justify application-level login response caching, and it could weaken correctness/security. |
