---
title: "S11 — Security Testing & Performance Testing"
source: "Slides/S11.1_Security Testing.pdf + Slides/S11.2_Performance Testing.pdf"
course: CSC13003 Software Testing
merged_from: [S11.1_security-testing.md, S11.2_performance-testing.md]
slides: 60
tags: [software-testing, slides, security-testing, performance-testing]
---

<!-- ============================================================ -->
<!-- PART 1: Security Testing (S11.1 — 29 slides)                 -->
<!-- ============================================================ -->

## Slide 1 — Title: Security Testing

Software Testing — CSC13003

Security Testing

## Slide 2 — Content Overview

- What is Security Testing?
- Why to do Security Testing?
- Types of Security Testing
- Security Testing Tools

## Slide 3 — Section Marker: What is Security Testing?

*(current section)*

## Slide 4 — Definition of Security Testing

Security testing is a type of non-functional testing that uncovers vulnerabilities, threats, risks in a software application.

## Slide 5 — Main Goals of Security Testing

- The main goal is to
  - identify assets
  - identify threats and vulnerabilities
  - identify risk
  - perform remediation

## Slide 6 — Key Principles of Security Testing

| Principle | Description |
| --- | --- |
| **Confidentiality** | Limiting access to sensitive data managed by a system |
| **Integrity** | Ensuring data is consistent, accurate, and trustworthy; cannot be modified by unauthorized entities |
| **Authentication** | Verifying the identity of the individual accessing sensitive systems or data |
| **Authorization** | Properly controlling access for authenticated users according to roles/permissions |
| **Availability** | Ensuring critical systems or data are available when needed |
| **Non-repudiation** | Ensuring data sent or received cannot be denied, by exchanging authentication info with a provable timestamp |

## Slide 7 — Example Security Test Cases: Authentication

- Check password rules — test the password security level required by the site
- Identify username enumeration vulnerabilities — check if error differs depending on whether user exists
- Test password strength — the minimum requirements to create a password
- Identify account recovery vulnerabilities — check if attacks can recover accounts
- Check username strength — ensure usernames are unique
- Identify fail-open authentication — check if system provides open access even when authentication fails
- Verify cookie scoping — check if cookies are scoped to the domain or if attackers can steal them

## Slide 8 — Example Security Test Cases: Input Validation

- Fuzz request parameters — check for reflected parameters and open redirection
- Identify SQL injection vulnerabilities — check if the system handles parameters as SQL
- Identify SOAP injection vulnerabilities — check if the application responds to SOAP
- Identify LDAP injection vulnerabilities — test for failure to sanitize inputs
- Identify XML injection vulnerabilities — check if injected XML impacts the application
- Identify XXE injection vulnerabilities — check if attackers can inject external entities

## Slide 9 — Example Security Test Cases: Application and Business Logic

- Determine the application logic attack surface — what the application does
- Check data transmission from clients — see if information transfers differ between applications
- Identify input validation on the client-side — check where the application bases its logic
- Identify logic flaws in multi-step processes — check if bypassing steps is possible
- Test incomplete input handling — check if the application processes faulty input
- Check trust relationships — for example, if users can access admin functions

## Slide 10 — Example Security Test Cases: Other Tests

- DOM vulnerabilities like XSS
- Lack of HTTP security headers
- Local privacy vulnerabilities
- Weak and persistent cookies
- Weak SSL ciphers
- URL parameters containing sensitive information

## Slide 11 — Section Marker: Why to do Security Testing?

*(current section)*

## Slide 12 — Top 10 Biggest Data Breaches of All Time

| Rank | Company | People Affected | What Got Leaked |
|---|---|---|---|
| 1 | Court Square Ventures | 200 million | names, addresses, bank details |
| 2 | US voter records | 191 million | birth dates, phone numbers, party affiliations |
| 3 | Adobe | 150 million | e-mail, password, credit card details |
| 4 | eBay | 145 million | names, addresses, passwords, emails |
| 5 | Heartland | 130 million | credit card details |
| 6 | Target | 110 million | names, addresses, credit card details |
| 7 | TK Maxx | 94 million | credit card details |
| 8 | Anthem | 88 million | social security numbers, employment information |
| 9 | PlayStation | 77 million | names, addresses, e-mail, birth dates |
| 10 | Mossack Fonseca | 11.5 million | 11.5 million leaked documents, 214,000 offshore companies |

## Slide 13 — WannaCry Ransomware Attack Statistics

- Affected systems: >220,000
- Affected countries: 150
- Ransom per system: $300

Average ransom in past ransomware attacks: 2014: $373 · 2015: $294 · 2016: $1,007

## Slide 14 — Reasons to do Security Testing

- Protecting Sensitive Information
- Preventing Unauthorized Access
- Maintaining Customer Trust
- Compliance with Regulations
- Preventing Financial Loss
- Ensuring Business Continuity
- Adapting to Evolving Threats

## Slide 15 — Section Marker: Types of Security Testing

*(current section)*

## Slide 16 — Types Overview

Seven types (chain): Vulnerability Scanning → Risk Assessment → Security Scanning → Penetration Testing → Security Auditing → Ethical Hacking → Posture Assessment

**Vulnerability Scanning** — Uses automated software to scan systems against predetermined vulnerabilities.

## Slide 17 — Types: Risk Assessment

**Risk Assessment** — Analysis of security risks in the application, software, or network. Once identified, classified as low/medium/high/critical and mitigation enacted by priority.

## Slide 18 — Types: Security Scanning

**Security Scanning** — Manual or automated testing to locate network or system weaknesses.

## Slide 19 — Types: Penetration Testing

**Penetration Testing** — Simulates an attack from a malicious party; clearly identifies critical vulnerabilities.

## Slide 20 — Types: Security Auditing

**Security Auditing** — Internal inspection of all operating systems and applications to find security flaws; results passed to teams for correction.

## Slide 21 — Types: Ethical Hacking

**Ethical Hacking** — Hired experts attempt to hack into a system or network to expose flaws in existing security measures.

## Slide 22 — Types: Posture Assessment

**Posture Assessment** — Combination of ethical hacking, security scanning, and risk assessments to snapshot overall security within the organization.

## Slide 23 — Section Marker: Security Testing Tools

*(current section)*

## Slide 24 — Security Testing Tools Overview

- **SAST** — Static Application Security Testing
- **DAST** — Dynamic Application Security Testing
- **IAST** — Interactive Application Security Testing
- **SCA** — Software Composition Analysis

## Slide 25 — SAST: Static Application Security Testing

- Assess the source code while at rest
- Identify exploitable flaws
- Detect issues: input validation, numerical errors, path traversals, race conditions
- Can also be used on compiled code

## Slide 26 — DAST: Dynamic Application Security Testing

- Examine the application during runtime
- Detect exploitable flaws while running
- Uses fuzzing — throw large volumes of known invalid errors and unexpected test cases
- Checks: scripting, sessions, data injection, authentication, interfaces, responses, and requests

## Slide 27 — IAST: Interactive Application Security Testing

- Leverage both static and dynamic testing (hybrid)
- Determine if known source code vulnerabilities are exploitable during runtime
- Reduce false positives
- Combines: multiple advanced attack scenarios, pre-collected data/application flow info, recursive dynamic analysis

## Slide 28 — SCA: Software Composition Analysis

- Manage and secure open-source components
- Track and analyze open-source components deployed in projects
- How: detect all relevant components/libraries/dependencies; identify vulnerabilities and suggest remediation

## Slide 29 — Q&A (Security Testing)

Q&A session slide.

---

<!-- ============================================================ -->
<!-- PART 2: Performance Testing (S11.2 — 31 slides)              -->
<!-- ============================================================ -->

## Slide 30 — Title: Performance Testing

Software Testing — CSC13003

Performance Testing

## Slide 31 — Content Overview

- What is Performance Testing?
- Why to do Performance Testing?
- Types of Performance Testing
- How to do Performance Testing?

## Slide 32 — Section Marker: What is Performance Testing?

*(current section)*

## Slide 33 — Definition of Performance Testing

Performance testing is a type of non-functional testing that ensures software applications perform properly under their expected workload.

## Slide 34 — Main Goals and Focus of Performance Testing

- The main goal is
  - not to find bugs
  - to eliminate performance bottlenecks
- The focus is on
  - **speed** — whether the application responds quickly
  - **scalability** — the maximum user load the application can handle
  - **stability** — if the application is stable under varying loads

## Slide 35 — Common Performance Problems

- Long load time — long initial time to start an application
- Poor response time — delayed output response to an input
- Poor scalability — does not support a large enough number of users
- Bottlenecks — obstacles that degrade overall system performance

## Slide 36 — Example Performance Test Cases

- Verify response time is not more than 4 secs when 1000 users access the website simultaneously
- Verify response time under load is within an acceptable range when network connectivity is slow
- Check the maximum number of users the application can handle before it crashes
- Check database execution time when 500 records are read/written simultaneously
- Check CPU and memory usage under peak load conditions
- Verify response time under low, normal, moderate, and heavy load conditions

## Slide 37 — Performance Testing Metrics (Overview)

| # | Metric |
|---|--------|
| 01 | CPU utilization |
| 02 | Memory utilization |
| 03 | Response times |
| 04 | Average load time |
| 05 | Throughput |
| 06 | Average latency/wait time |
| 07 | Bandwidth |
| 08 | Requests per second |
| 09 | Error rate |
| 10 | Transactions passed/failed |

## Slide 38 — Performance Testing Metrics (Part 1)

- **CPU utilization** — percentage of CPU capacity utilized
- **Memory utilization** — utilization of the primary memory
- **Response times** — time between sending request and receiving response
- **Average load time** — time to complete the loading process
- **Throughput** — the number of transactions handled in a second

## Slide 39 — Performance Testing Metrics (Part 2)

- **Average latency/Wait time** — time spent by a request in a queue before getting processed
- **Bandwidth** — volume of data transferred per second
- **Requests per second** — number of requests handled per second
- **Error rate** — percentage of requests resulting in errors
- **Transactions Passed/Failed** — percentage of passed/failed transactions

## Slide 40 — Section Marker: Why to do Performance Testing?

*(current section)*

## Slide 41 — Business Impact of Poor Performance

- Most users click away after 8 seconds of delay
- $4.4 billion business revenue loss due to poor web application performance
- Aberdeen found that inadequate performance could impact revenue by up to 9%
- Business performance begins to suffer at 5.1 seconds of delay in response times (3.9 for critical applications)

## Slide 42 — Real-World Cost Examples

- Only a **5-minute downtime** of Google.com (19-Aug-13) is estimated to cost **$545,000**
- Companies lost sales worth **$1,100 per second** due to a recent Amazon Web Service Outage

## Slide 43 — Impact of 1-Second Page Load Delay

A 1-second delay in page load time equals:

- 7% loss in conversion
- 11% fewer page views
- 16% decrease in customer satisfaction

In dollar terms: if your site earns $100,000/day, this year you could lose **$2.5 MILLION** in sales.

## Slide 44 — Reasons to do Performance Testing

- Help ensure the software
  - meets the expected levels of service
  - provides a positive user experience
- Highlight improvements relative to speed, stability, and scalability
- Absence of testing might lead to different types of problems that damage brand reputation

## Slide 45 — Section Marker: Types of Performance Testing

*(current section)*

## Slide 46 — Types of Performance Testing Overview

Six types (sequential): Load Testing → Endurance Testing → Stress Testing → Volume Testing → Spike Testing → Scalability Testing

## Slide 47 — Types: Load Testing

**Load testing** — Checks the product's ability to perform under anticipated user loads. Objective: identify performance congestion before software product is launched.

## Slide 48 — Types: Endurance Testing

**Endurance testing** — Ensures the software can handle the expected load over a long period of time.

## Slide 49 — Types: Stress Testing

**Stress testing** — Tests a product under extreme workloads to see whether it handles high traffic. Objective: identify the breaking point of a software product.

## Slide 50 — Types: Volume Testing

**Volume testing** — Large number of data is saved in a database and the overall software system's behavior is observed. Objective: check product's performance under varying database volumes.

## Slide 51 — Types: Spike Testing

**Spike testing** — Tests the product's reaction to sudden large spikes in the load generated by users.

## Slide 52 — Types: Scalability Testing

**Scalability testing** — Determines software application's effectiveness in scaling up to support an increase in user load. Helps in planning capacity addition to your software system.

## Slide 53 — Section Marker: How to do Performance Testing?

*(current section)*

## Slide 54 — Performance Testing Process Overview

Seven-step process:

```
Identify test       Determine          Plan and      Configure test    Implement test
environment    -->  performance   -->  design    -->  environment   -->  design
                    criteria
                                                                            |
                                                                            v
                                                   Analyze and  <--  Run tests
                                                   retest
```

## Slide 55 — Step 1: Identify Test Environment

- Identify the testing environment and what testing tools are available
- Understand hardware, software and network configurations ahead of time

## Slide 56 — Step 2: Determine Performance Criteria

- Identify the general performance metrics
- Identify the performance success criteria

## Slide 57 — Step 3: Plan and Design

- Identify key scenarios by considering user variability, test data, and performance planning
- Simulate a variety of use cases
- Outline what metrics will be gathered

## Slide 58 — Steps 4 and 5: Configure and Implement

**Step 4 — Configure test environment**: Arrange all the necessary testing tools and monitoring resources.

**Step 5 — Implement test design**: Design performance tests according to performance criteria and metrics.

## Slide 59 — Steps 6 and 7: Run Tests and Analyze

**Step 6 — Run tests**: Execute and monitor the performance tests.

**Step 7 — Analyze and retest**: Analyze the finding and fine tune the test again to see an increase or decrease in performance. Run the tests again using the same or different parameters.

## Slide 60 — Q&A (Performance Testing)

Q&A session slide.
