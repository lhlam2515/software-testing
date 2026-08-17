# Manual Screenshot Checklist

Codex cannot capture the Windows desktop directly, so take these screenshots manually and place them in the matching evidence folders.

Required screenshots:

- `load-vscode-taskmanager.png`
- `stress-vscode-taskmanager.png`
- `spike-vscode-taskmanager.png`
- `endurance-vscode-taskmanager.png`
- `hardware-dxdiag.png`

For each scenario screenshot, make sure the image shows:

1. The JMeter run or terminal command that is executing the scenario.
2. Windows Task Manager with the CPU and Memory columns visible.
3. The backend process visible in Task Manager.
4. Both windows visible at approximately the same time.

For the hardware screenshot:

1. Open `dxdiag` or another system-information view.
2. Show the System tab with OS, CPU, memory, and computer name.
3. Capture the screen while the details are visible.

Notes:

- Do not use desktop-only shots that omit Task Manager or the running test.
- Do not claim a screenshot was captured unless the file is actually present.
- If a scenario was not rerun, leave the screenshot as `MANUAL ACTION REQUIRED` in the report.
