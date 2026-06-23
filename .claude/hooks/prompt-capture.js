#!/usr/bin/env node
// UserPromptSubmit hook: buffer prompt + timestamp trước khi Claude xử lý
const fs = require('fs'), path = require('path'), os = require('os');

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
if (process.env.CLAUDE_INVOKED_BY) process.exit(0);
const sessionId  = input.session_id;
const sessionPfx = sessionId.slice(0, 8);

const now = new Date();
const p   = n => String(n).padStart(2, '0');
const ts  = `${p(now.getHours())}:${p(now.getMinutes())} ${p(now.getDate())}/${p(now.getMonth()+1)}/${now.getFullYear()}`;

const pendingDir = path.join('.claude', 'hooks', 'pending');
fs.mkdirSync(pendingDir, { recursive: true });
fs.writeFileSync(
  path.join(pendingDir, `${sessionPfx}.json`),
  JSON.stringify({ sessionId, prompt: input.prompt || '', timestamp: ts })
);
