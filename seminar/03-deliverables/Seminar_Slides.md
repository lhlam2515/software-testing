---
title: Mutation Testing & Test Effectiveness
transition: fade
slideNumber: true
---

<style>
:root {
  --bg: #0f172a;
  --panel: rgba(15, 23, 42, 0.82);
  --panel-2: rgba(30, 41, 59, 0.8);
  --text: #f8fafc;
  --muted: #cbd5e1;
  --accent: #3b82f6;
  --accent-2: #38bdf8;
  --good: #22c55e;
  --warn: #f59e0b;
  --bad: #ef4444;
  --line: rgba(148, 163, 184, 0.22);
  --shadow: 0 24px 80px rgba(2, 6, 23, 0.45);
}

.reveal {
  font-family: Inter, Poppins, Roboto, system-ui, sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.13), transparent 26%),
    radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.16), transparent 24%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08), transparent 20%),
    linear-gradient(180deg, #111827 0%, var(--bg) 100%);
}

.reveal section {
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.reveal h1, .reveal h2, .reveal h3 {
  letter-spacing: -0.04em;
  line-height: 0.96;
  text-transform: none;
}

.reveal h1 {
  font-size: 2.5em;
}

.reveal h2 {
  font-size: 1.65em;
}

.reveal p, .reveal li, .reveal td, .reveal th {
  color: var(--text);
}

.reveal .muted {
  color: var(--muted);
}

.reveal .gradient-text {
  background: linear-gradient(90deg, #f8fafc 0%, var(--accent-2) 45%, var(--accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.reveal .hero {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 0;
}

.reveal .hero::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 38%;
  width: min(72vw, 900px);
  height: min(72vw, 900px);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(59, 130, 246, 0.1) 28%, transparent 68%);
  filter: blur(14px);
  pointer-events: none;
}

.reveal .hero-inner {
  width: min(100%, 1120px);
  position: relative;
  z-index: 1;
}

.reveal .hero-kicker {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--accent-2);
  font-size: 0.34em;
  margin-bottom: 0.9rem;
}

.reveal .hero-title {
  font-size: 2.7em;
  line-height: 0.92;
  margin: 0;
}

.reveal .hero-subtitle {
  margin: 1.2rem auto 0;
  max-width: 820px;
  font-size: 1.08em;
  color: var(--accent-2);
}

.reveal .hero-tagline {
  margin: 1rem auto 0;
  max-width: 760px;
  font-size: 0.92em;
  color: var(--muted);
  line-height: 1.35;
}

.reveal .hero-meta {
  margin: 4.5rem auto 0;
  width: min(100%, 920px);
  padding: 0.75rem 0;
  border-top: 1px solid rgba(56, 189, 248, 0.28);
  border-bottom: 1px solid rgba(56, 189, 248, 0.28);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.reveal .hero-tech-item {
  color: var(--muted);
  font-size: 0.46em;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.reveal .hero-tech-item + .hero-tech-item::before {
  content: '•';
  color: rgba(56, 189, 248, 0.7);
  margin: 0 0.5rem 0 0;
}

.reveal .score-layout {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 0.85rem;
  align-items: center;
  margin-top: 0.25rem;
}

.reveal .score-formula {
  padding: 0.85rem 0.9rem;
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.58);
}

.reveal .score-title {
  font-size: 0.95em;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--accent-2);
  margin-bottom: 0.7rem;
}

.reveal .score-fraction {
  display: grid;
  justify-items: center;
  gap: 0.55rem;
}

.reveal .score-numerator,
.reveal .score-denominator {
  font-size: 1.25em;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.reveal .score-bar {
  width: 72%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.9), transparent);
}

.reveal .score-cards {
  display: grid;
  gap: 0.55rem;
}

.reveal .score-card {
  min-height: 0;
  padding: 0.62rem 0.8rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.56);
}

.reveal .score-killed { border-left: 4px solid #22c55e; }
.reveal .score-survived { border-left: 4px solid #ef4444; }
.reveal .score-equivalent { border-left: 4px solid #eab308; }

.reveal .score-card-title {
  font-size: 0.9em;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.reveal .score-card-text {
  font-size: 0.72em;
  line-height: 1.15;
  color: var(--muted);
}

.reveal .activity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
  align-items: start;
}

.reveal .activity-summary {
  padding: 0.9rem 1rem;
}

.reveal .activity-summary h3 {
  font-size: 1.2em;
  margin-bottom: 0.35rem;
}

.reveal .activity-summary p {
  font-size: 0.82em;
  line-height: 1.25;
}

.reveal .activity-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.reveal .activity-item {
  padding: 0.55rem 0.7rem;
  min-height: 0;
}

.reveal .activity-item-title {
  font-size: 0.95em;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.reveal .activity-item-text {
  font-size: 0.72em;
  line-height: 1.15;
  color: var(--muted);
}

.reveal .rules-checklist {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem 0.9rem;
  align-items: start;
}

.reveal .rules-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.38);
  font-size: 0.78em;
}

.reveal .rules-icon {
  color: var(--accent-2);
  font-weight: 700;
  flex: 0 0 auto;
}

.reveal .timeline-horizontal {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.45rem;
  align-items: stretch;
}

.reveal .timeline-step {
  padding: 0.55rem 0.65rem;
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.42);
}

.reveal .timeline-time {
  font-size: 0.72em;
  color: var(--accent-2);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
}

.reveal .timeline-label {
  font-size: 0.8em;
  line-height: 1.15;
}

.reveal .takeaway-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

.reveal .takeaway-card {
  padding: 0.75rem 0.8rem;
  min-height: 0;
}

.reveal .takeaway-card-title {
  font-size: 0.95em;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.reveal .takeaway-card-text {
  font-size: 0.8em;
  line-height: 1.2;
  color: var(--muted);
}

.reveal .roadmap {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.55rem;
  flex-wrap: nowrap;
}

.reveal .roadmap-step {
  flex: 1 1 0;
  padding: 0.65rem 0.7rem;
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.42);
}

.reveal .roadmap-title {
  font-size: 0.95em;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.reveal .roadmap-text {
  font-size: 0.75em;
  line-height: 1.15;
  color: var(--muted);
}

.reveal .roadmap-arrow {
  align-self: center;
  color: var(--accent-2);
  font-size: 1.2em;
  margin: 0 0.05rem;
}

.reveal .ai-layout {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 0.8rem;
  align-items: stretch;
}

.reveal .ai-column {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
}

.reveal .ai-node {
  padding: 0.55rem 0.7rem;
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.42);
}

.reveal .ai-node-title {
  font-size: 0.95em;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.reveal .ai-node-text {
  font-size: 0.75em;
  line-height: 1.15;
  color: var(--muted);
}

.reveal .ai-gate {
  padding: 0.75rem 0.85rem;
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.58);
}

.reveal .ai-gate-title {
  font-size: 0.95em;
  font-weight: 700;
  color: var(--accent-2);
  margin-bottom: 0.45rem;
}

.reveal .ai-gate-line {
  font-size: 0.78em;
  line-height: 1.15;
  color: var(--muted);
}

.reveal .ai-placeholder {
  margin-top: 0;
  min-height: 0;
  flex: 1 1 auto;
}

.reveal .section-title {
  font-size: 2.2em;
  margin-bottom: 0.15em;
}

.reveal .eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.4em;
  color: var(--accent-2);
  margin-bottom: 0.5rem;
}

.reveal .card, .reveal .metric, .reveal .quote-box, .reveal .callout, .reveal .warning, .reveal .success {
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.86), rgba(15, 23, 42, 0.92));
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
}

.reveal p {
  margin: 0.35rem 0;
}

.reveal h1, .reveal h2, .reveal h3 {
  margin: 0 0 0.35em 0;
}

.reveal .card {
  padding: 0.7rem 0.85rem;
}

.reveal .metric {
  padding: 0.7rem 0.8rem;
  text-align: center;
}

.reveal .metric .value {
  font-size: 2.2em;
  font-weight: 800;
  color: #fff;
}

.reveal .metric .label {
  font-size: 0.62em;
  color: var(--muted);
  margin-top: 0.2rem;
}

.reveal .quote-box {
  padding: 0.8rem 1rem;
  border-left: 4px solid var(--accent-2);
}

.reveal .callout {
  padding: 0.8rem 0.9rem;
}

.reveal .warning { border-left: 4px solid var(--warn); padding: 0.8rem 0.9rem; }
.reveal .success { border-left: 4px solid var(--good); padding: 0.8rem 0.9rem; }

.reveal .grid {
  display: grid;
  gap: 0.5rem;
}

.reveal .grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.reveal .grid.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.reveal .timeline {
  position: relative;
  margin: 0.7rem 0;
  padding-left: 1.2rem;
  border-left: 2px solid rgba(56, 189, 248, 0.35);
}

.reveal .step {
  position: relative;
  margin-bottom: 0.75rem;
  padding-left: 0.8rem;
}

.reveal .step::before {
  content: '';
  position: absolute;
  left: -1.02rem;
  top: 0.35rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.08);
}

.reveal .process {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
  flex-wrap: wrap;
}

.reveal .process .node {
  flex: 1 1 160px;
  min-width: 160px;
  position: relative;
}

.reveal .process .node:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -0.8rem;
  top: 42%;
  color: var(--accent-2);
  font-size: 1.4rem;
}

.reveal .glow {
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.12), 0 0 24px rgba(59, 130, 246, 0.18);
}

.reveal .floating {
  animation: float 6s ease-in-out infinite;
}

.reveal .pulse {
  animation: pulse 2.2s ease-in-out infinite;
}

.reveal .fade-in {
  animation: fadeIn 0.8s ease both;
}

.reveal .slide-up {
  animation: slideUp 0.75s ease both;
}

.reveal .glow-animation {
  animation: glow 2.8s ease-in-out infinite;
}

.reveal .progress {
  height: 0.4rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
  overflow: hidden;
}

.reveal .progress > span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.reveal table {
  font-size: 0.72em;
}

.reveal th, .reveal td {
  border-color: rgba(148, 163, 184, 0.18);
}

.reveal code {
  color: #bfdbfe;
}

.reveal pre {
  box-shadow: var(--shadow);
  border-radius: 14px;
}

.reveal .center {
  text-align: center;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 170px;
  border: 1px dashed rgba(56, 189, 248, 0.45);
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.55);
  color: var(--muted);
  font-size: 0.9em;
  text-align: center;
  padding: 0.75rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.99); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.12), 0 0 24px rgba(59, 130, 246, 0.14); }
  50% { box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.22), 0 0 32px rgba(59, 130, 246, 0.28); }
}
</style>

# Mutation Testing & Test Effectiveness
## From coverage to confidence

<div class="hero">
<div class="hero-inner">
<div class="hero-kicker fragment fade-in">T10 · Software Testing</div>
<p class="hero-subtitle fragment fade-up">From coverage to confidence</p>
<p class="hero-tagline fragment fade-in">Coverage lies.<br>Mutation testing tells the truth.</p>
<div class="hero-meta fragment fade-in">
<span class="hero-tech-item">EShop</span>
<span class="hero-tech-item">StrykerJS</span>
<span class="hero-tech-item">Claude / ChatGPT</span>
</div>
</div>
</div>

notes:
Chào lớp, nhóm mình là T10. Một câu mở: "coverage nói dối - mutation testing mới cho biết test có bắt được lỗi không". Cả buổi xoay quanh chứng minh điều đó ngay trên EShop, và dành 20 phút để các bạn tự tay "giết mutant".

---

## Agenda
<div class="grid two">
<div class="card fragment fade-up">
<div class="eyebrow">Pitch</div>
<h3>Why coverage is not enough</h3>
<p class="muted">The first 10 minutes build the case.</p>
</div>
<div class="card fragment fade-up">
<div class="eyebrow">Method</div>
<h3>How mutation testing works</h3>
<p class="muted">Mutants, scores, levels, and strategy.</p>
</div>
<div class="card fragment fade-up">
<div class="eyebrow">Demo</div>
<h3>Live workflow on EShop</h3>
<p class="muted">StrykerJS plus AI-assisted assertions.</p>
</div>
<div class="card fragment fade-up">
<div class="eyebrow">Activity</div>
<h3>Kill the mutants</h3>
<p class="muted">Teams write assertions, then we validate them.</p>
</div>
</div>

notes:
Đây là bản đồ của buổi nói: phần pitch, phần phương pháp, demo live, rồi activity. Nhắc lớp là activity sẽ là trung tâm, còn slide chỉ để dẫn đường.

---

## Why This Matters
<div class="quote-box center">
<div class="gradient-text" style="font-size:1.25em;font-weight:800;">Coverage answers: “Did a test run this line?”</div>
<div class="fragment" style="margin-top:0.8rem;">It does <strong>not</strong> answer: “Would a test fail if this line were wrong?”</div>
</div>

<div class="grid three" style="margin-top:1rem;">
<div class="metric fragment">
<div class="value">96%</div>
<div class="label">coverage, but only 34% mutation score</div>
</div>
<div class="metric fragment">
<div class="value">100%</div>
<div class="label">coverage can still hide almost no assertions</div>
</div>
<div class="metric fragment">
<div class="value">~4%</div>
<div class="label">mutation score seen in some full-coverage suites</div>
</div>
</div>

<div class="image-placeholder fragment" style="margin-top:1rem;">[IMAGE PLACEHOLDER: Coverage vs Mutation Score]</div>

notes:
Đặt vấn đề: coverage chỉ cho biết code có được chạy qua hay không, không cho biết test có phát hiện lỗi hay không. Dẫn 2 số liệu thật: 96% coverage nhưng mutation score chỉ 34%, và có suite 100% coverage mà mutation score khoảng 4%. Chốt ý: test có thể nhìn rất đẹp nhưng vẫn yếu.

---

## Coverage vs Mutation
<div class="grid two">
<div class="card">
<div class="eyebrow">Coverage</div>
<p class="fragment">Executed lines.</p>
<p class="fragment">Useful signal.</p>
</div>
<div class="card glow">
<div class="eyebrow">Mutation score</div>
<p class="fragment">Faults detected.</p>
<p class="fragment">Stronger signal.</p>
</div>
</div>

<div class="callout fragment" style="margin-top:1rem;">
Real tests fail on real faults. Weak tests let the mutant survive.
</div>

notes:
Giữ nhịp ngắn: coverage là "chạy qua", mutation score là "có bắt lỗi không". Câu chốt là suite mạnh phải làm mutant fail.

---

## What Is a Mutant?
<div class="grid two">
<div class="card">
<h3>Mutant</h3>
<p class="fragment">One small fault seeded into source.</p>
<p class="fragment"><code>&gt;</code> → <code>&gt;=</code></p>
<p class="fragment"><code>-</code> → <code>+</code></p>
<p class="fragment"><code>true</code> → <code>false</code></p>
<p class="fragment">Remove <code>return</code></p>
</div>
<div class="card">
<h3>Outcome</h3>
<p class="fragment"><strong>Killed</strong> — a test failed ✓</p>
<p class="fragment"><strong>Survived</strong> — all tests passed ✗</p>
<p class="fragment"><strong>Equivalent</strong> — behaviour unchanged, exclude as noise</p>
</div>
</div>

notes:
Giải thích cơ chế: tool sửa nhẹ source để sinh mutant rồi chạy lại test. Killed là mong muốn, survived cho thấy lỗ hổng test, equivalent là trường hợp logic không đổi nên phải loại khỏi mẫu số.

---

## Mutation Score
<div class="score-layout">
<div class="score-formula fragment fade-in">
<div class="score-title">Mutation Score</div>
<div class="score-fraction">
<div class="score-numerator">Killed</div>
<div class="score-bar"></div>
<div class="score-denominator">Total − Equivalent</div>
</div>
</div>

<div class="score-cards">
<div class="score-card score-killed fragment fade-up">
<div class="score-card-title">🟢 Killed</div>
<div class="score-card-text">Tests failed</div>
<div class="score-card-text">Good</div>
</div>
<div class="score-card score-survived fragment fade-up">
<div class="score-card-title">🔴 Survived</div>
<div class="score-card-text">Tests passed</div>
<div class="score-card-text">Missing assertions</div>
</div>
<div class="score-card score-equivalent fragment fade-up">
<div class="score-card-title">🟡 Equivalent</div>
<div class="score-card-text">Behavior unchanged</div>
<div class="score-card-text">Excluded</div>
</div>
</div>
</div>

notes:
Nói rõ công thức mutation score: Killed chia cho Total trừ Equivalent. Gợi ý ví dụ nhanh: nếu đổi toán tử `>` thành `>=`, một test boundary tốt sẽ giết mutant; nếu không có assert boundary thì mutant sống sót.

---

## Goal
<div class="grid two">
<div class="card">
<div class="eyebrow">Goal</div>
<h3>Test the test suite, not just production code</h3>
<p class="fragment">Measure and raise test effectiveness.</p>
</div>
<div class="card">
<div class="eyebrow">Why it matters</div>
<p class="fragment">Exposes fake coverage: high coverage, weak or missing asserts.</p>
<p class="fragment">Pinpoints the exact line or boundary missing a test.</p>
<p class="fragment">Creates a real safety net for refactoring.</p>
</div>
</div>

notes:
Nhấn mạnh mục tiêu tối thượng: không phải đi tìm bug trong code, mà kiểm tra và nâng chất lượng chính bộ test. Ba lý do: bóc tách test giả tạo, chỉ đúng chỗ thiếu test, và là lưới an toàn cho refactor.

---

## Level and Method
<div class="grid two">
<div class="card">
<h3>Level</h3>
<p class="fragment"><strong>Primarily Unit</strong> - fast enough to run across many mutants, and isolated enough to give useful signal.</p>
<p class="fragment">Integration: limited, using Extreme Mutation.</p>
<p class="fragment">System/E2E: impractical.</p>
</div>
<div class="card">
<h3>Method</h3>
<p class="fragment"><strong>Automated White-box</strong> (Glass-box)</p>
<p class="fragment">Needs AST/source access to seed mutants and coverage to optimize.</p>
<p class="fragment">Humans review survivors; automation handles the scale.</p>
</div>
</div>

notes:
Trả lời hai câu: level chủ yếu là unit vì nhanh và cô lập; integration chỉ dùng hạn chế; system/E2E gần như không thực tế. Phương pháp là white-box vì cần đọc cấu trúc source để sinh mutant, và automated vì số lượng mutant quá lớn.

---

## Strategy for Any Project
<div class="roadmap">
<div class="roadmap-step fragment">
<div class="roadmap-title">Foundation</div>
<div class="roadmap-text">70-80% coverage first</div>
</div>
<div class="roadmap-arrow fragment">↓</div>
<div class="roadmap-step fragment">
<div class="roadmap-title">Limit Scope</div>
<div class="roadmap-text">Focus on core modules</div>
</div>
<div class="roadmap-arrow fragment">↓</div>
<div class="roadmap-step fragment">
<div class="roadmap-title">Optimize</div>
<div class="roadmap-text">Incremental + coverage-guided</div>
</div>
<div class="roadmap-arrow fragment">↓</div>
<div class="roadmap-step fragment">
<div class="roadmap-title">CI/CD</div>
<div class="roadmap-text">Run before PR + nightly</div>
</div>
</div>

notes:
Đây là chiến lược tổng quát cho dự án bất kỳ. Cần nhấn mạnh thứ tự: có test nền tảng trước, rồi mới mở rộng phạm vi, tối ưu và đưa vào CI/CD nhưng không chặn merge nếu quá lâu.

---

## Where AI Fits
<div class="ai-layout">
<div class="ai-column">
<div class="ai-node fragment">
<div class="ai-node-title">① Predict</div>
<div class="ai-node-text">Mutate high-risk code only</div>
</div>
<div class="ai-node fragment">
<div class="ai-node-title">② Mutate</div>
<div class="ai-node-text">Run StrykerJS</div>
</div>
<div class="ai-node fragment">
<div class="ai-node-title">③ AI Review</div>
<div class="ai-node-text">Review survivors</div>
</div>
<div class="ai-node fragment">
<div class="ai-node-title">④ Generate Assertions</div>
<div class="ai-node-text">Generate assertions</div>
</div>
</div>
<div class="ai-column">
<div class="ai-gate fragment">
<div class="ai-gate-title">Validation Gate</div>
<div class="ai-gate-line">PASS Original</div>
<div class="ai-gate-line">FAIL Mutant</div>
<div class="ai-gate-line" style="margin-top:0.35rem;color:var(--warn);">Validate AI output</div>
</div>
<div class="image-placeholder ai-placeholder fragment">[IMAGE PLACEHOLDER: AI Workflow]</div>
</div>
</div>

notes:
Vẽ luồng AI 4 hộp. Nêu rõ AI chỉ là bản nháp: mọi assertion sinh ra phải qua validation gate, nghĩa là pass code gốc và fail mutant. Nhắc các ví dụ nghiên cứu chỉ là tham khảo được xác minh trong guide.

---

## Why StrykerJS + Claude/ChatGPT
<div class="grid two">
<div class="card">
<h3>StrykerJS</h3>
<p class="fragment">JS/TS-native mutation engine.</p>
<p class="fragment">Uses Jest runner.</p>
<p class="fragment">Outputs HTML and JSON reports.</p>
<p class="fragment">Fits the EShop stack: Node/CommonJS.</p>
</div>
<div class="card">
<h3>Claude / ChatGPT</h3>
<p class="fragment">Used for assertion synthesis.</p>
<p class="fragment">Stryker does not natively generate assertions.</p>
<p class="fragment">This pairing satisfies the required traditional + AI rule.</p>
</div>
</div>



notes:
Giải thích lý do chọn công cụ: EShop là Node/CommonJS nên StrykerJS là lựa chọn native, còn PIT hay mutmut không phù hợp. Stryker không tự sinh assertion nên ghép với Claude/ChatGPT để đáp ứng yêu cầu traditional + AI.

---

## Live Demo
<div class="grid two">
<div class="card fragment">
<div class="eyebrow">Step 1</div>
<h3>Run Stryker</h3>
<p class="muted">Run <code>npx stryker run</code> on <code>server.js</code>.</p>
</div>
<div class="card fragment">
<div class="eyebrow">Step 2</div>
<h3>Inspect survivors</h3>
<p class="muted">Open the HTML report and find the coupon endpoint.</p>
</div>
<div class="card fragment">
<div class="eyebrow">Step 3</div>
<h3>Ask AI for a draft</h3>
<p class="muted">Use Claude or ChatGPT to propose an assertion.</p>
</div>
<div class="card fragment">
<div class="eyebrow">Step 4</div>
<h3>Validate</h3>
<p class="muted">Pass on original, fail on mutant, score rises.</p>
</div>
</div>

<div class="image-placeholder fragment" style="margin-top:0.8rem;min-height:170px;">[IMAGE PLACEHOLDER: Stryker Report]</div>

notes:
Đây là phần demo thực tế, không có slide trình bày thêm. Chạy Stryker, mở report, lấy survivor ở route coupon, đưa vào AI để sinh assertion, rồi chạy validation gate. Kết luận là mutation score tăng dù coverage không đổi.

---

## Activity
<div class="activity-grid">
<div class="card activity-summary">
<div class="eyebrow">Your turn</div>
<h3>Kill the Mutant</h3>
<p class="fragment">Write one assertion per mutant.</p>
<p class="fragment">Aim for the highest score.</p>
</div>
<div class="activity-card-grid">
<div class="card activity-item fragment">
<div class="activity-item-title">🧪 5 Mutants</div>
<div class="activity-item-text">Surviving suite</div>
</div>
<div class="card activity-item fragment">
<div class="activity-item-title">✍ One Assertion</div>
<div class="activity-item-text">Per mutant</div>
</div>
<div class="card activity-item fragment">
<div class="activity-item-title">✅ Pass Original</div>
<div class="activity-item-text">Validate source</div>
</div>
<div class="card activity-item fragment">
<div class="activity-item-title">🏆 Highest Score</div>
<div class="activity-item-text">Most kills wins</div>
</div>
</div>
</div>

notes:
Chuyển sang phần thực hành do facilitator dẫn. Nêu luật chơi rõ: có 5 mutant sống sót, mỗi nhóm viết 1 assertion/mutant để giết. Nhắc worksheet đã phát 3 ngày trước.

---

## Rules and Setup
<div class="rules-checklist">
<div class="rules-item fragment"><span class="rules-icon">✔</span><span>Teams of 3-4</span></div>
<div class="rules-item fragment"><span class="rules-icon">✔</span><span>One note-taker</span></div>
<div class="rules-item fragment"><span class="rules-icon">✔</span><span>AI allowed</span></div>
<div class="rules-item fragment"><span class="rules-icon">✔</span><span>Validate AI output</span></div>
<div class="rules-item fragment"><span class="rules-icon">✔</span><span>Use provided backend</span></div>
<div class="rules-item fragment"><span class="rules-icon">✔</span><span>Submit minute paper</span></div>
</div>

notes:
Nêu điều kiện tham gia: nhóm 3-4 người, có 1 người ghi chú. Môi trường đã được cung cấp sẵn nên không cần internet sau setup. AI được phép nhưng phải kiểm tra tay vì test pass trên mutant thì không giết được mutant nào.

---

## Activity Flow
<div class="timeline-horizontal">
<div class="timeline-step fragment">
<div class="timeline-time">00:00</div>
<div class="timeline-label">Introduction</div>
</div>
<div class="timeline-step fragment">
<div class="timeline-time">03:00</div>
<div class="timeline-label">Write Assertions</div>
</div>
<div class="timeline-step fragment">
<div class="timeline-time">13:00</div>
<div class="timeline-label">Peer Review</div>
</div>
<div class="timeline-step fragment">
<div class="timeline-time">18:00</div>
<div class="timeline-label">Sandbox Test</div>
</div>
<div class="timeline-step fragment">
<div class="timeline-time">22:00</div>
<div class="timeline-label">Winner</div>
</div>
</div>

notes:
Chiếu bảng thời gian để cả lớp bám theo đồng hồ. Ba phút xem diff, mười phút viết, năm phút đổi chéo review, bốn phút chạy sandbox tally, một phút nhóm thắng giải thích thiết kế.

---

## Debrief
<div class="grid two">
<div class="card">
<p class="fragment"><strong>Q1:</strong> What surprised you most?</p>
<p class="fragment"><strong>Q2:</strong> Where did AI save time vs add work?</p>
</div>
<div class="card">
<p class="fragment"><strong>Q3:</strong> One failure mode you'd prevent next time?</p>
<p class="fragment"><strong>Q4:</strong> With one more hour, what next?</p>
</div>
</div>

<div class="quote-box fragment" style="margin-top:1rem;">
Write one answer each on the minute-paper.
</div>

notes:
Đặt 4 câu debrief và mời một đến hai nhóm trả lời nhanh. Nhấn lại bài học: assertion chỉ kiểm tra `typeof` hay `success` thường không giết được mutant giá trị; boundary là chỗ hay bị sót; AI hữu ích nhưng vẫn cần validation gate.

---

## Takeaways
<div class="takeaway-grid">
<div class="card takeaway-card fragment">
<div class="takeaway-card-title">✓ Practical Goal</div>
<div class="takeaway-card-text">70-80%</div>
<div class="takeaway-card-text">Mutation Score</div>
</div>
<div class="card takeaway-card fragment">
<div class="takeaway-card-title">⚠ Equivalent Mutants</div>
<div class="takeaway-card-text">Need Manual Review</div>
</div>
<div class="card takeaway-card fragment">
<div class="takeaway-card-title">🤖 AI</div>
<div class="takeaway-card-text">Generate Drafts</div>
<div class="takeaway-card-text">Always Validate</div>
</div>
</div>

notes:
Chốt 3 điều mang về: mục tiêu 70-80% là tốt, đừng đuổi 100%; equivalent mutants phải review tay; AI chỉ là nháp và cần validation. Nếu còn thời gian, nhắc lại hai bug coupon EShop để minh hoạ rằng mutation testing đo độ nhạy của test chứ không tự xác nhận spec.

---

## Q&A
<div class="center">
<h2 class="gradient-text">Questions?</h2>
<p class="fragment muted">Contact: <em>[team emails]</em></p>
</div>

<div class="grid two" style="margin-top:1rem;">
<div class="card fragment">
<h3>Backup topics</h3>
<p class="muted">Equivalent-mutant deep dive</p>
<p class="muted"><code>stryker.config.mjs</code></p>
<p class="muted">Full mutation report</p>
</div>
<div class="card fragment">
<h3>Thank you</h3>
<p class="muted">We appreciate your time and your questions.</p>
</div>
</div>

notes:
Mở Q&A. Nếu có câu hỏi sâu thì dùng backup slide về config, report đầy đủ, hoặc equivalent mutant. Trả lời trung thực, nếu chưa chắc thì nói sẽ kiểm tra lại. Cảm ơn lớp và nhắc nộp minute-paper.
