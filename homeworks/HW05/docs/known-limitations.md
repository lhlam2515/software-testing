# Known Limitations

- Live backend source code is not present in this workspace, so implementation details must be confirmed against the running SUT.
- The available docs are sufficient to prepare a conservative HW05 scaffold, but not to validate every request body.
- `GET /api/admin/orders` requires admin authorization, so customer and admin behavior must be separated.
- Any checkout path may have persistent side effects and should be treated as destructive under load.
- Real performance numbers, screenshots, and JTL files still require manual execution.

