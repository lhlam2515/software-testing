# HW05 - Performance Testing

Student ID: `23127543`

This folder prepares the HW05 deliverables for the EShop SUT without fabricating execution evidence.

## Selected Endpoint Groups

- Auth-heavy: `POST /api/login`
- Read-heavy: `GET /api/admin/orders`
- Transactional: `POST /api/checkout`

## Workflow

See [`docs/workflow.md`](docs/workflow.md) for the recommended end-to-end workflow and identity split.

## Directory Overview

- `docs/` - requirements checklist, endpoint analysis, workflow, parameters, execution guidance, endurance plan, human review, and known limitations
- `jmeter/` - CSV data, JMeter plan templates, result output folders, and report folders
- `evidence/` - placeholders for real screenshots and hardware evidence
- `ai/` - prompts, analysis templates, and AI audit log
- `report/` - report skeleton and critique template
- `skill/` - reusable performance-testing skill scaffold
- `github/` - planned commit log
- `video/` - YouTube link placeholder

## TODOs Requiring Real Execution

- Load execution
- Stress execution
- Spike execution
- Endurance / soak execution
- Raw `.jtl` files
- HTML report folders
- Task Manager / resource monitor screenshots
- Hardware screenshots
- GitHub issue screenshots for genuine problems
- YouTube demo video
- AI analysis of real JTL data

## Execution Note

This scaffold is designed for the actual backend behavior documented in the repo and requirements. Any request body or assertion that is not confirmed in the available API documentation is marked as TODO in the relevant file.

