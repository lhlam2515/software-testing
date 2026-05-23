#!/usr/bin/env python3
"""
audit_logger.py — Claude Code Hook cho CS423/CSC13003
=====================================================
Xử lý 2 event: UserPromptSubmit và Stop

Logic xác định log path (theo thứ tự ưu tiên):
  1. Nếu cwd nằm trong homeworks/HW{id}/ → ghi vào cwd/prompt_log.md
  2. Nếu cwd là project root nhưng có subfolder homeworks/HW{id} khớp
     với requirement tag trong prompt → ghi vào đó
  3. Fallback → ghi vào cwd/prompt_log.md

Yêu cầu: python3 >= 3.8, không cần thư viện ngoài
"""

import json
import os
import re
import sys
from datetime import datetime

# ── Constants ─────────────────────────────────────────────────────────────────

RESPONSE_PLACEHOLDER = "> _(pending)_"

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

# ── Path Resolution ───────────────────────────────────────────────────────────

def detect_hw_id(cwd: str) -> str:
    """
    Trích HW ID từ cwd.
    Ví dụ: .../homeworks/HW01/src → 'HW01'
            .../homeworks/HW02     → 'HW02'
    """
    parts = cwd.replace("\\", "/").split("/")
    for i, part in enumerate(parts):
        if re.fullmatch(r"HW\d{2}", part, re.IGNORECASE):
            return part.upper()
    return ""


def resolve_log_path(cwd: str, prompt: str = "") -> str:
    """
    Xác định đường dẫn tới prompt_log.md.

    Ưu tiên 1: cwd đang nằm trong homeworks/HW{id}
    Ưu tiên 2: project root + subfolder homeworks/HW{id} tồn tại
               + prompt chứa tag HW{id}
    Fallback:  cwd/prompt_log.md
    """
    # Ưu tiên 1 — cwd đã trong đúng thư mục HW
    hw_id = detect_hw_id(cwd)
    if hw_id:
        return os.path.join(cwd, "prompt_log.md")

    # Ưu tiên 2 — detect từ prompt tag, tìm subfolder tương ứng
    if prompt:
        tag_match = re.search(r'\bHW(\d{2})\b', prompt, re.IGNORECASE)
        if tag_match:
            candidate = os.path.join(cwd, "homeworks", f"HW{tag_match.group(1)}", "prompt_log.md")
            hw_dir = os.path.dirname(candidate)
            if os.path.isdir(hw_dir):
                return candidate

    # Fallback
    return os.path.join(cwd, "prompt_log.md")


def ensure_log_exists(path: str) -> None:
    """Tạo file với header nếu chưa tồn tại."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        hw_id = detect_hw_id(os.path.dirname(path)) or "HW__"
        with open(path, "w", encoding="utf-8") as f:
            f.write(TEMPLATE_HEADER.format(hw_id=hw_id))


# ── Session State ────────────────────────────────────────────────────────────

def _session_file() -> str:
    """Path tới file lưu trạng thái session (.claude/.audit_session.json)."""
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", ".")
    return os.path.join(project_dir, ".claude", ".audit_session.json")


def save_session(log_path: str) -> None:
    sf = _session_file()
    os.makedirs(os.path.dirname(sf), exist_ok=True)
    with open(sf, "w", encoding="utf-8") as f:
        json.dump({"log_path": log_path}, f)


def load_session() -> str:
    """Trả về log_path đã lưu, hoặc '' nếu không có."""
    sf = _session_file()
    if not os.path.exists(sf):
        return ""
    try:
        with open(sf, "r", encoding="utf-8") as f:
            return json.load(f).get("log_path", "")
    except Exception:
        return ""


# ── File Helpers ──────────────────────────────────────────────────────────────

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
    cwd    = data.get("cwd", ".")
    prompt = data.get("prompt", "").strip()
    ts     = datetime.now().strftime("%H:%M %d/%m/%Y")
    path   = resolve_log_path(cwd, prompt)

    ensure_log_exists(path)
    save_session(path)

    entry = (
        f"\n## [{ts}]\n\n"
        f"### (1) Prompt\n"
        f"```text\n{prompt}\n```\n\n"
        f"### (2) AI Output\n"
        f"> _(pending)_\n\n"
        f"### (3) Verdict\n"
        f"<!-- VALID · INVALID · INCOMPLETE -->\n"
        f"**Verdict:** ___\n\n"
        f"### (4) Reasoning\n"
        f"<!-- 2–5 câu, trích dẫn ISTQB section hoặc slide tuần tương ứng -->\n"
        f"> ___\n\n"
        f"### (5) Student Fix\n"
        f"<!-- Phiên bản đã sửa/bổ sung. Nếu VALID → ghi 'Accepted as-is' -->\n"
        f"> ___\n\n"
        f"---\n"
    )
    append(path, entry)


def on_stop(data: dict) -> None:
    cwd      = data.get("cwd", ".")
    response = data.get("last_assistant_message", "").strip()

    # Ưu tiên path đã được lưu khi prompt submit
    path = load_session() or resolve_log_path(cwd)

    if not os.path.exists(path):
        return  # Không có session nào đang mở, bỏ qua

    # Indent toàn bộ response thành blockquote, KHÔNG truncate
    quoted = "\n".join(f"> {line}" for line in response.splitlines())

    replace_last(path, RESPONSE_PLACEHOLDER, quoted)


# ── Entry Point ───────────────────────────────────────────────────────────────

def main() -> None:
    try:
        data  = json.load(sys.stdin)
        event = data.get("hook_event_name", "")

        if event == "UserPromptSubmit":
            on_prompt_submit(data)
        elif event == "Stop":
            on_stop(data)

    except Exception as e:
        # Non-blocking: ghi lỗi vào stderr để Claude Code log,
        # không làm gián đoạn session
        print(f"[audit_logger] error: {e}", file=sys.stderr)

    sys.exit(0)


if __name__ == "__main__":
    main()