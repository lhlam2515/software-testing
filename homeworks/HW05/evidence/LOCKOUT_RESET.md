# Lockout Reset

Status: `MANUAL ACTION REQUIRED`

No confirmed 3-failed-login lockout was observed in the workspace evidence for the current pass, so there is no verified reset procedure to record yet.

If a lockout is triggered during Stress or Spike, record:

- which test triggered it
- the exact error response
- the reset procedure used
- the verification login that succeeded afterward
- the evidence file names

Backend code reference:

- `apps/backend/server.js` checks `locked_until` during `POST /api/login`
- successful login resets `login_attempts` to `0` and clears `locked_until`
- the database seed lives in `apps/backend/database.js`

Possible verified reset paths, if needed later:

1. Wait until `locked_until` expires and login successfully again.
2. Clear the lock directly in SQLite by resetting `login_attempts` and `locked_until`.

Do not claim either path was used until it is actually observed.
