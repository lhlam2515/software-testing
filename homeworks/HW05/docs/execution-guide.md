# Execution Guide

## Backend start

TODO: confirm backend start command from the live backend source or project README.

The available documentation says:

- install dependencies
- initialize database with `node database.js`
- start server on `http://localhost:3000`

## JMeter commands

### Load

```powershell
jmeter -n -t .\jmeter\plans\23127543_Load_20260811.jmx -l .\jmeter\results\23127543_Load_20260811.jtl
jmeter -g .\jmeter\results\23127543_Load_20260811.jtl -o .\jmeter\reports\load
```

### Stress

```powershell
jmeter -n -t .\jmeter\plans\23127543_Stress_20260811.jmx -l .\jmeter\results\23127543_Stress_20260811.jtl
jmeter -g .\jmeter\results\23127543_Stress_20260811.jtl -o .\jmeter\reports\stress
```

### Spike

```powershell
jmeter -n -t .\jmeter\plans\23127543_Spike_20260811.jmx -l .\jmeter\results\23127543_Spike_20260811.jtl
jmeter -g .\jmeter\results\23127543_Spike_20260811.jtl -o .\jmeter\reports\spike
```

## TODOs

- Verify the exact backend start command
- Verify the exact checkout request body
- Verify whether cart preparation requires `POST /api/cart` or can be done via UI/session state
- Verify whether the login endpoint returns a token field name that can be extracted in JMeter

