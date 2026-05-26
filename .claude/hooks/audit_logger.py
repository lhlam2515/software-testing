#!/usr/bin/env python3
"""
audit_logger.py — Claude Code Hook cho CS423/CSC13003
=====================================================
Xử lý 3 event: UserPromptSubmit, PostToolUse, Stop

Log path được cấu hình tại .claude/audit_config.json:
  {"log_path": "homeworks/HW01/prompt_log.md"}

Path relative to $CLAUDE_PROJECT_DIR, hoặc absolute.
Sửa file config khi chuyển HW — không cần keyword hay cwd đúng.

Yêu cầu: python3 >= 3.8, không cần thư viện ngoài
"""

import json
import os
import re
import sys
from datetime import datetime

# ── Constants ─────────────────────────────────────────────────────────────────

RESPONSE_PLACEHOLDER = "> _(pending)_"
FILE_MARKER = "<!-- auto-tracked -->"

TEMPLATE_HEADER = """\
# Prompt Log & AI Audit Report
<!-- [AI-02] compliant — CS423/CSC13003 Software Testing 2026 -->

## Student Information

| Field | Value |
|---|---|
| Student Name | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Assignment ID | {hw_id} |
| Submission Date | ___/___/2026 |
| AI Tool(s) Used | Claude Code |
| AI Category | Cat.4 - AI-Assisted Production |

---
"""

# ── Config ────────────────────────────────────────────────────────────────────

def get_log_path() -> str:
    """
    Đọc log_path từ .claude/audit_config.json.
    Trả về absolute path, hoặc '' nếu config không tồn tại / thiếu key.
    """
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", ".")
    config_path = os.path.join(project_dir, ".claude", "audit_config.json")

    if not os.path.exists(config_path):
        print("[audit_logger] .claude/audit_config.json không tồn tại — bỏ qua", file=sys.stderr)
        return ""

    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    log_path = cfg.get("log_path", "")
    if not log_path:
        print("[audit_logger] audit_config.json thiếu key 'log_path' — bỏ qua", file=sys.stderr)
        return ""

    if not os.path.isabs(log_path):
        log_path = os.path.join(project_dir, log_path)

    return log_path


# ── File Helpers ──────────────────────────────────────────────────────────────

def ensure_log_exists(path: str) -> None:
    """Tạo file với header nếu chưa tồn tại."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        m = re.search(r"HW\d{2}", path, re.IGNORECASE)
        hw_id = m.group(0).upper() if m else "HW__"
        with open(path, "w", encoding="utf-8") as f:
            f.write(TEMPLATE_HEADER.format(hw_id=hw_id))


def append(path: str, text: str) -> None:
    with open(path, "a", encoding="utf-8") as f:
        f.write(text)


def replace_last(path: str, old: str, new: str) -> None:
    """Thay thế lần xuất hiện CUỐI CÙNG của `old` trong file."""
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    idx = content.rfind(old)
    if idx == -1:
        return
    with open(path, "w", encoding="utf-8") as f:
        f.write(content[:idx] + new + content[idx + len(old):])


# ── Event Handlers ────────────────────────────────────────────────────────────

def on_prompt_submit(data: dict) -> None:
    log_path = get_log_path()
    if not log_path:
        return

    prompt = data.get("prompt", "").strip()
    ts     = datetime.now().strftime("%H:%M %d/%m/%Y")

    ensure_log_exists(log_path)

    entry = (
        f"\n## [{ts}]\n\n"
        f"### (1) Prompt\n"
        f"```text\n{prompt}\n```\n\n"
        f"### (2) AI Output\n"
        f"{RESPONSE_PLACEHOLDER}\n\n"
        f"**Artifacts:**\n"
        f"{FILE_MARKER}\n\n"
        f"---\n"
    )
    append(log_path, entry)


def on_post_tool_use(data: dict) -> None:
    tool = data.get("tool_name", "")
    if tool not in ("Write", "Edit"):
        return

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path:
        return

    log_path = get_log_path()
    if not log_path or not os.path.exists(log_path):
        return

    with open(log_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Chỉ inject khi entry đang mở
    if RESPONSE_PLACEHOLDER not in content:
        return
    # Không tự log chính prompt_log.md
    if os.path.abspath(file_path) == os.path.abspath(log_path):
        return
    # Tránh duplicate
    if f"`{file_path}`" in content:
        return

    new_line = f"\n- `{file_path}` ({tool})"
    # Inject sau lần xuất hiện CUỐI CÙNG của marker (entry đang mở)
    idx = content.rfind(FILES_MARKER)
    if idx == -1:
        return
    insert_at = idx + len(FILES_MARKER)
    content = content[:insert_at] + new_line + content[insert_at:]

    with open(log_path, "w", encoding="utf-8") as f:
        f.write(content)


def on_stop(data: dict) -> None:
    log_path = get_log_path()
    if not log_path or not os.path.exists(log_path):
        return

    response = data.get("last_assistant_message", "").strip()
    quoted   = "\n".join(f"> {line}" for line in response.splitlines())
    replace_last(log_path, RESPONSE_PLACEHOLDER, quoted)


# ── Entry Point ───────────────────────────────────────────────────────────────

def main() -> None:
    try:
        data  = json.load(sys.stdin)
        event = data.get("hook_event_name", "")

        if event == "UserPromptSubmit":
            on_prompt_submit(data)
        elif event == "PostToolUse":
            on_post_tool_use(data)
        elif event == "Stop":
            on_stop(data)

    except Exception as e:
        print(f"[audit_logger] error: {e}", file=sys.stderr)

    sys.exit(0)


if __name__ == "__main__":
    main()
