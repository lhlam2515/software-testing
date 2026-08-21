# CI/CD Integration Report

## 1. Objective
Newman is used to execute the Postman API tests automatically in GitHub Actions so the suite can pass when the collection is healthy and fail when a test is intentionally broken.

## 2. Pipeline Configuration
The workflow file in the repository is [`./.github/workflows/api-tests.yml`](.github/workflows/api-tests.yml). It runs on pushes and pull requests to `main`.

Pipeline steps:
- checkout
- Node.js setup
- backend dependency installation
- backend startup
- readiness check
- Newman installation
- Postman collection execution
- Postman environment loading
- Newman HTML report generation

Relevant workflow excerpt:

```yaml
- name: Run Postman API tests
  run: |
    newman run homeworks/HW06/postman/EShop-API.postman_collection.json \
      -e homeworks/HW06/postman/EShop-Environment.postman_environment.json \
      -r cli,htmlextra \
      --reporter-htmlextra-export homeworks/HW06/reports/newman-report.html
```

## 3. Sample Run 1 — All Passing
- Commit SHA: `37b75001011d03cebe7b02ea8aafaa40fa6d83de`
- Commit message: `all tests pass`
- Branch: `Vu/feat/HW02`
- GitHub Actions run link: `https://github.com/lhlam2515/software-testing/actions/runs/32460848523`
- Result: passed
- Test summary: 172 requests, 172 assertions, 0 failed tests
- Screenshot: [`evidence/CI/CD/success.png`](evidence/CI/CD/success.png)

## 4. Sample Run 2 — One Failing Test
- Commit SHA: `0c18a69b1f03ade39d899265355e95f14d4b2332`
- Commit message: `test: demonstrate failing API test in CI`
- Branch: `Vu/feat/HW02`
- GitHub Actions run link: `https://github.com/lhlam2515/software-testing/actions/runs/32462497192`
- Intentionally modified test: one Postman test assertion was changed in the collection to force a CI failure
- Expected result: one failing test
- Actual result: failed CI run
- Screenshot: [`evidence/CI/CD/fail.png`](evidence/CI/CD/fail.png)

## 5. Conclusion
The CI workflow behaves correctly: it passes when the Postman/Newman suite passes and fails when a test assertion is intentionally broken.
