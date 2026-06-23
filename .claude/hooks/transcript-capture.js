#!/usr/bin/env node
// Stop hook: ghi raw transcript entry (prompt + response + session ID)
// Khác với global hook: ghi vào context/transcripts/ của workspace
const fs = require('fs'), path = require('path'), os = require('os');

const input = JSON.parse(fs.readFileSync(0, 'utf8'));

// Guard: tránh ghi duplicate khi Stop re-fires do Stop hook block
if (input.stop_hook_active) process.exit(0);
// Guard: skip flush agent sessions to prevent circular transcript capture
if (process.env.CLAUDE_INVOKED_BY) process.exit(0);

const { session_id, last_assistant_message, cwd } = input;
const sessionPfx = session_id.slice(0, 8);

// Đọc pending buffer (set bởi UserPromptSubmit)
const pendingFile = path.join('.claude', 'hooks', 'pending', `${sessionPfx}.json`);
let prompt = '[prompt unavailable]';
let timestamp = (() => {
  const now = new Date(), p = n => String(n).padStart(2, '0');
  return `${p(now.getHours())}:${p(now.getMinutes())} ${p(now.getDate())}/${p(now.getMonth()+1)}/${now.getFullYear()}`;
})();

if (fs.existsSync(pendingFile)) {
  try {
    const pending = JSON.parse(fs.readFileSync(pendingFile, 'utf8'));
    prompt    = pending.prompt    || prompt;
    timestamp = pending.timestamp || timestamp;
    fs.unlinkSync(pendingFile);
  } catch (_) {}
}

// Ghi raw entry vào context/transcripts/{date}.md
const today       = new Date().toISOString().slice(0, 10);
const transcripts = path.join(cwd || process.cwd(), 'context', 'transcripts');
try { fs.mkdirSync(transcripts, { recursive: true }); } catch (_) {}

const entry = [
  `## Session: ${session_id} - Timestamp: ${timestamp}`,
  `**Prompt:** ${prompt}`,
  ``,
  `**Response:** ${last_assistant_message || '[response unavailable]'}`,
  '',
  '---',
  '',
].join('\n');

try { fs.appendFileSync(path.join(transcripts, `${today}.md`), entry); } catch (_) {}
