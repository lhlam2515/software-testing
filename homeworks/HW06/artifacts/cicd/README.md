# CI/CD Artifacts

This directory will contain a copy of the pipeline configuration, or a link to it, plus screenshots of the two sample runs required by REQUIREMENTS.md section 6: one all-passing run and one run with a single failing test. These files will support the CI/CD report required by section 14.

TODO: add pipeline config/link and the two sample-run screenshots after the workflow is drafted and run. Suggested approach: run the SUT (`node apps/backend/server.js`) and `npx newman run <collection> -e <environment>` in the same job — no external secret should be needed.
