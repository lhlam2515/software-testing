## 1. ChatGPT Hallucination in Legal Proceedings — Mata v. Avianca (2023)

- **Source URL:** [Mata v. Avianca, Inc. — Wikipedia](https://en.wikipedia.org/wiki/Mata_v._Avianca,_Inc.)
- **Description:** The defect involves large language model (LLM) "hallucination," wherein the autoregressive model generates highly plausible but entirely fabricated information due to probabilistic token prediction rather than factual lookup. In this instance, OpenAI's ChatGPT generated non-existent legal precedents, fictitious case citations, and bogus judicial quotes when prompted for legal research.
- **Severity:** High
  - *Justification:* While it does not cause catastrophic infrastructure failure or a data breach, it directly compromises the integrity of federal legal proceedings and exposes legal practitioners to severe judicial sanctions.
- **Real-world consequences:** The plaintiff's attorneys unknowingly submitted an opposition brief containing six completely fabricated judicial decisions to the U.S. District Court for the Southern District of New York. The deception was uncovered by opposing counsel and the judge, resulting in a $5,000 fine levied against the lawyers for acting in "subjective bad faith." In a separate and unrelated order, the court dismissed the personal injury lawsuit because the claim was time-barred under the Montreal Convention's two-year filing window — a procedural defect that existed entirely independent of the AI incident.
- **Solution/Remediation:** The law firm implemented stricter internal review policies banning unverified AI-generated content, while the American Bar Association (ABA) issued its first formal ethics guidance explicitly detailing attorneys' responsibilities to independently verify any generative AI outputs.

---

## 2. Air Canada Chatbot False Refund Policy Hallucination (2024)

- **Source URL:** [BC Tribunal Decision — American Bar Association](https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/)
- **Description:** The chatbot presented an inaccurate refund policy that did not reflect Air Canada's current documentation. The chatbot's underlying architecture was not disclosed in legal proceedings; its output — a specific policy with a concrete 90-day window and a defined application mechanism — is consistent with a rule-based or intent-classification system reading from an outdated policy database, not probabilistic text generation. The incident predates the commercial deployment of LLM-based enterprise chatbots.
- **Severity:** Medium
  - *Justification:* The issue represents a localized operational failure resulting in financial misrepresentation and minor damages rather than an enterprise-wide system exploit.
- **Real-world consequences:** A passenger flying under bereavement guidelines relied on the chatbot's false promises, purchased full-price tickets, and was subsequently denied a refund by human agents. The British Columbia Civil Resolution Tribunal ruled against Air Canada, creating a global legal precedent that corporations are legally liable for the claims made by their AI systems.
- **Solution/Remediation:** Air Canada suspended the chatbot pending a review of its policy data sources. No public disclosure confirms an architectural upgrade to RAG or any generative AI system.

---

## 3. Samsung Employee Data Leak via ChatGPT (2023)

- **Source URL:** [The 2023 Samsung ChatGPT Incident — AuthenTech AI](https://authentech.ai/shadow-ai/samsung-chatgpt-incident/)
- **Description:** This defect is a data-loss prevention (DLP) vulnerability caused by "shadow AI" usage, where a public, multi-tenant LLM endpoint lacks data residency controls and automatically uses prompt histories for continuous model training. Highly confidential intellectual property pasted directly into the public ChatGPT web interface was ingested into OpenAI's external infrastructure with no mechanism for deletion or access restriction.
- **Severity:** High
  - *Justification:* The vulnerability resulted in the direct exposure of proprietary trade secrets and corporate intellectual property to an external third-party environment without non-disclosure agreements.
- **Real-world consequences:** Over a 20-day period, Samsung engineers inadvertently leaked sensitive intellectual property across three separate incidents, including proprietary semiconductor database source code, equipment defect detection algorithms, and recorded internal executive meeting transcripts.
- **Solution/Remediation:** Following discovery of the leaks, Samsung first implemented an emergency measure in early April 2023 — limiting each employee's ChatGPT prompt to 1,024 bytes — while permitting limited continued use. Approximately one month later, Samsung issued a formal company-wide ban on May 1, 2023, covering ChatGPT, Microsoft Bing, and Google Bard across all corporate devices and internal networks. An internal April survey cited in the ban memo found that 65% of respondents perceived generative AI tools as a security risk. Samsung simultaneously began developing an internal AI assistant as a governed replacement.

---

## 4. GitHub Copilot Generating Vulnerable Code Patterns (2022–2023)

- **Source URL:** [GitHub Copilot Security Risks — Precogs AI](https://www.precogs.ai/security/github-copilot-security)
- **Description:** This systemic defect relates to uncurated training data quality, where an AI code assistant reproduces historical software flaws present in its open-source training data. GitHub Copilot was trained on public code repositories that naturally contain historical bugs, insecure patterns, and deprecated practices accumulated over decades of human development — distinct from "training dataset poisoning," which requires deliberate adversarial data injection (no such attack is documented here). When prompted with security-relevant contexts, the model frequently completes snippets using insecure coding patterns, specifically producing path traversal vulnerabilities (CWE-022) and SQL injection vulnerabilities via raw string concatenation (CWE-089).
- **Severity:** High
  - *Justification:* It introduces exploitable software vulnerabilities directly into the software supply chains of millions of production applications at the time of development.
- **Real-world consequences:** Academic studies (including research from NYU and Stanford) confirmed that GitHub Copilot generated insecure or vulnerable code in roughly 40% of security-critical scenarios, presenting a significant risk of data exhilaration or remote code execution for developers who blindly accepted suggestions.
- **Solution/Remediation:** GitHub introduced an LLM-powered vulnerability prevention system that operates as an inline scanner to intercept, block, and filter out insecure patterns in real-time before they are surfaced to the developer.

---

## 5. Google Gemini Racially Inaccurate Historical Image Generation (Feb 2024)

- **Source URL:** [Google Explains Gemini Image Generation Failure — PCMag](https://www.pcmag.com/news/google-explains-what-went-wrong-with-geminis-image-generation)
- **Description:** This defect involves an over-corrective algorithmic bias mitigation failure within the image-generation pipeline of the Gemini model. To counter systemic societal biases, Google integrated automated prompt-expansion layers that injected demographic diversity metrics into human descriptions; however, the system failed to bound these rules, leading to severe historical context violations.
- **Severity:** Medium
  - *Justification:* The failure was a public relations and programmatic error that compromised model utility and brand reputation rather than a security breach or data threat.
- **Real-world consequences:** Gemini generated nonsensical and historically inaccurate depictions, including racially diverse World War II-era German soldiers, a female Pope, and Native American or Black founding fathers of the United States. The widespread public backlash caused Google's stock price to drop significantly, wiping out billions in market value.
- **Solution/Remediation:** Google suspended Gemini's people-image generation on February 22, 2024. Initial patch attempts produced new regressions, and the feature remained fully offline for approximately six months. Google's actual solution was building an entirely new image generation engine — **Imagen 3** — announced at Google I/O in May 2024 and launched for premium users on August 28, 2024, with general rollout in October 2024.

---

## 6. Apple Intelligence False BBC News Summary — Luigi Mangione (Dec 2024)

- **Source URL:** [Apple's AI Disastrously Rewrote a BBC Headline — Gizmodo](https://gizmodo.com/apples-ai-disastrously-rewrote-a-bbc-headline-to-say-luigi-mangione-shot-himself-2000538599)
- **Description:** This flaw is an algorithmic notification-summarization error within the iOS Apple Intelligence engine. When compressing multiple, distinct push notifications from a single app into a single, cohesive preview bullet, the model correctly separated three BBC notifications into three distinct clauses but generated a factually false statement within a single clause — an isolated hallucination, not a cross-notification context contamination event.
- **Severity:** High
  - *Justification:* The defect actively manufactures and disseminates high-profile defamation and misinformation to thousands of user lock screens under the trusted banner of authoritative news organizations.
- **Real-world consequences:** Users who received multiple BBC alerts saw an Apple-generated summary falsely stating that high-profile murder suspect Luigi Mangione had shot himself, an event that never occurred. The incident sparked a formal complaint from the BBC and prompted calls from international bodies like Reporters Without Borders demanding Apple disable the unpolished feature.
- **Solution/Remediation:** Apple announced updates to its notification-summary feature and modified how summaries are labelled and presented. The company did not publicly disclose the specific technical mechanism of the fix.

---

## 7. DeepSeek Unsecured ClickHouse Database Exposure (Jan 2025)

- **Source URL:** [DeepSeek Cyber Attack and Database Leak — Critical Mission Alliance](https://www.cm-alliance.com/cybersecurity-blog/deepseek-cyber-attack-timeline-impact-and-lessons-learned)
- **Description:** This defect is a critical cloud infrastructure misconfiguration where two backend ClickHouse analytical database instances used by the AI platform (`oauth2callback.deepseek.com:9000` and `dev.deepseek.com:9000`) were deployed directly to the public internet without an authentication layer. This allowed any remote actor uninhibited access to execute arbitrary queries and intercept raw, internal telemetry and logging pipelines.
- **Severity:** Critical
  - *Justification:* The database offered full control, exposing sensitive, real-time user communications and security credentials with no authentication required.
- **Real-world consequences:** Cybersecurity researchers at Wiz discovered over one million sensitive log entries sitting fully exposed. The compromised data included plaintext user chat histories, active API secret keys, backend operational metadata, and authentication tokens, presenting a catastrophic privacy violation at the height of the platform's global adoption.
- **Solution/Remediation:** Upon responsible disclosure by Wiz Research, DeepSeek secured the exposure by: (1) restricting public network access to both ClickHouse instances; (2) revoking unauthorized access and restricting developer-instance access; (3) updating API security policies. No public source confirms the deployment of automated configuration auditing tools as part of this remediation.

---

## 8. Microsoft Recall Plaintext Screenshot Capture (May 2024)

- **Source URL:** [Microsoft Windows Recall Data Extraction Vulnerability — CSO Online](https://www.csoonline.com/article/4159643/microsofts-windows-recall-still-allows-silent-data-extraction.html)
- **Description:** This architectural flaw involves a missing security control in the initial design of Windows Recall. The OS-level feature continuously captured high-frequency desktop screenshots, applied Optical Character Recognition (OCR), and stored the resulting plaintext data and indices inside an unencrypted SQLite database located in a standard user directory, with no encryption and no hardware-enforced isolation present in the original design (CWE-311: Missing Encryption of Sensitive Data) — an architectural omission, not a bypass of an existing control.
- **Severity:** Critical
  - *Justification:* It essentially built an automated, local spyware infrastructure that allowed any infostealer malware running in the user context to silently exfiltrate every password, email, and bank detail ever displayed on the screen.
- **Real-world consequences:** Security researcher Alexander Hagenah (alias "xaitax") built and published an open-source tool, TotalRecall, demonstrating trivial extraction of the database contents in seconds. The severe privacy backlash forced Microsoft to pull the highly anticipated feature from its Copilot+ PC launch phase.
- **Solution/Remediation:** Microsoft pulled the tool back to development and completely re-engineered the architecture to make it strictly opt-in, encrypted the database using Windows Hello Enhanced Sign-in Security (ESS), and isolated the entire data processing pipeline inside a secure, hardware-protected Virtualization-Based Security (VBS) Enclave.
