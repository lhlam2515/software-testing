# Automation Workflow Skill

Agent skill hỗ trợ workflow tự động hoá test case bằng Playwright cho e-Shop SUT:
sinh script data-driven, chạy multi-browser (Chromium/Firefox/Edge), và xuất
HTML report có `Run by: {StudentID}`.

## Status

| Version | Trạng thái | Forge tại |
|---------|-----------|-----------|
| v0 | ⬜ Scaffold (README + CHANGELOG) | _TBD_ |

## Dự kiến khi v0.1 được forge

- Đọc test case nguồn (domain-testing.md / bva.md từ HW02) cho từng feature
- Sinh Playwright script data-driven, đọc test data từ `.csv`/`.json` riêng biệt (không hardcode)
- Áp dụng tối thiểu 3 assertion pattern khác nhau
- Cấu hình chạy trên 3 browser (Chromium/Firefox/Edge) và xuất HTML report có `Run by: {StudentID}`
- Ghi log bug thật (assertion fail vì SUT sai) vào `bugs/BUG_REPORT.md` + GitHub Issues

## Vị trí SKILL.md

`SKILL.md` sẽ được tạo khi workflow được áp dụng lần đầu trên một feature thật
(FR-02 / FR-09 / FR-16). Skill tuân thủ format: YAML frontmatter + numbered steps,
theo cùng convention với `domain-testing` skill ở HW02.
