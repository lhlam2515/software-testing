# Automation & Regression Testing

> Source: *EN.Automation & Regression Testing AI-First (Redesigned)*, Software Testing AI-First (2026).
> Context: IT Faculty, HCMUS. Examples use Playwright, Selenium, and Cypress.

## Overview

This material explains what to automate, how to organise and run automated tests, and how AI-assisted and agentic approaches can now draft, execute, maintain, and triage tests. It frames test automation through six questions:

| Question | Core answer |
| --- | --- |
| **What** | Software executes tests and checks results repeatedly, without continuous human supervision. |
| **Why** | It provides speed, coverage, and repeatability at scale, and serves as a CI merge gate. |
| **When** | Use it for stable, repeated, regression-prone checks throughout the path from sprint work to release. |
| **Where** | It applies to web, mobile, desktop, APIs/services, and cloud device farms. |
| **Who** | SDETs, developers, QA testers, and the entire team participate; AI agents increasingly assist them. |
| **How** | Use appropriate frameworks such as POM and BDD, structure each test with the three A's, integrate it into CI, and increasingly use AI support. |

## 1. What test automation is and why it matters

Test automation means using code to drive an application, assert expected results, and report outcomes. It replaces slow and error-prone manual re-execution of tests, can run on every change without waiting for a human operator, and provides a fast pass/fail signal.

Its main benefits are:

- **Speed and repeatability at scale.** A computer can repeat the same check consistently and quickly.
- **Broader coverage.** Automated execution can cover more combinations and regression cases than manual testing alone.
- **More valuable human testing.** It frees testers to perform exploratory work and judgements that are difficult to formalise.
- **CI/CD enablement.** An automated suite can provide a merge gate: failing checks prevent unsafe changes from entering the shared branch.

## 2. Automation strategy: what to automate

Automation is an investment. It should be applied where repeated execution will repay implementation and maintenance cost.

### Good candidates

- **Repetitive or regression-prone flows:** for example, login and checkout smoke tests run on every build.
- **High-risk, business-critical behaviour:** for example, payment processing and order-total calculations.
- **Data-driven cases:** for example, testing twenty coupon codes across different carts.
- **Stable, mature features:** for example, product search and add-to-cart.

### Cases to leave manual, at least initially

- **One-off or rarely executed checks:** for example, a one-time data-migration check.
- **Unstable, fast-changing user interfaces:** for example, a checkout redesign changing every week.
- **Exploratory and usability work:** for example, a first-impression assessment of a new user flow.
- **Checks requiring human judgement:** for example, deciding whether a banner image is appealing.

> Rule of thumb: automate what is **repeated, stable, and objective**. Leave the one-off, fluid, and subjective work to humans.

## 3. When to automate and when it pays off

### Timing in the development lifecycle

- **Shift left:** automate unit and API tests from day one.
- **Wait for UI stability:** automate a UI flow once it is no longer churning.
- **Before every release:** run the regression suite.
- **Continuously:** run appropriate checks on every commit in CI.

### Return-on-investment conditions

Automation is most worthwhile when:

- the test will run many times as part of regression testing;
- manual execution is slow, tedious, or error-prone;
- requirements are stable and understood; and
- the cost of automating is lower than the accumulated cost of repeated manual execution.

## 4. Who performs test automation

| Participant | Primary contribution |
| --- | --- |
| **SDET / automation engineer** | Designs the framework, writes and maintains suites, and owns CI automation. |
| **Developers** | Write unit and API tests, make the product testable, and get fast shift-left feedback. |
| **Manual / QA testers** | Author codeless tests where useful and focus on exploratory testing that machines cannot perform well. |
| **Whole team and AI** | Quality is shared across the team. AI agents can draft, run, and heal tests; humans review the work. |

## 5. The automation pyramid

Automation should be concentrated in fast lower layers and kept comparatively thin at the UI layer.

1. **Unit tests:** the largest group. They are near-instant and pinpoint failures.
2. **API/integration tests:** more numerous than UI tests, relatively fast and stable, and focused on business logic.
3. **UI/end-to-end tests:** few in number, slower and more brittle because they exercise the complete system.

The anti-pattern is the **ice-cream cone**, where most tests are slow UI tests. It is expensive, flaky, and slow to execute.

## 6. Regression testing

Regression testing re-verifies that a change did not break behaviour that previously worked.

- Any bug fix or feature can silently damage an unrelated area.
- The regression task is to re-run existing tests after a change and identify such breakage.
- Manual execution becomes impractical as the suite grows large.
- Automation allows the full relevant suite to be re-run on every push.

### Retesting versus regression testing

| Aspect | Retesting | Regression testing |
| --- | --- | --- |
| **Purpose** | Confirm that one specific reported bug is fixed. | Confirm that nothing else broke. |
| **Scope** | Only the previously failed test case. | The surrounding or broader suite. |
| **Input data** | The same data that previously failed. | Broad and varied inputs. |
| **Automation fit** | Usually manual and targeted. | The prime candidate for automation. |

### Strategies for choosing what to re-run

| Strategy | Method | Characteristic |
| --- | --- | --- |
| **Procedural** | Re-run a fixed suite every time. | Simple and safe, but slow as the suite grows. |
| **Risk-based** | Prioritise by risk and expected change impact. | Focuses effort where breakage would hurt most. |
| **Test impact analysis** | Run only tests that a code diff can affect. | Uses AI or graph-based mapping to select a subset, reducing runs from hours to minutes. |

### Test impact analysis

Test impact analysis avoids running, for example, 10,000 tests for a one-line change. It works by:

1. Mapping tests to the code files they exercise.
2. Inspecting a diff and selecting the tests that could be affected.
3. Running those tests first for fast feedback, while deferring the rest of the suite to a nightly run.

Example:

```bash
# Identify changed code.
git diff --name-only main...HEAD
# Example output: src/checkout/coupon.ts

# Ask Jest to run tests related to the changed file.
npx jest --findRelatedTests src/checkout/coupon.ts
```

Relevant tools include Launchable (CloudBees), Sealights, Jest's `--findRelatedTests`, and Nx `affected`.

> Trend: selective regression is presented as the frontier for keeping merge gates fast as test suites grow.

## 7. Anatomy of an automated test: Arrange, Act, Assert

Every automated test follows three ordered stages:

| Stage | Meaning | Typical focus |
| --- | --- | --- |
| **Arrange** | Identify an element and establish known state. | Locators and fixtures. |
| **Act** | Perform the behaviour under test: click, type, submit, or call an API. | One specific user or system action. |
| **Assert** | Verify the observed outcome against the expected result. | One clear and meaningful check. |

Keeping these steps ordered makes each test easier to read, diagnose, and maintain.

## 8. Automation framework patterns

How a suite is organised determines whether it remains scalable and resilient to change.

| Pattern | Idea and appropriate use |
| --- | --- |
| **Linear / record-playback** | One script per test case. Useful for quick demonstrations, but the worst option for long-term maintenance. |
| **Modular** | Reusable functions per screen or component. Suitable for medium-sized suites. |
| **Data-driven** | One script executed against many data rows. Best for the same flow with many inputs. |
| **Keyword-driven** | Actions represented as keywords in a table, enabling non-programmers to author cases. |
| **BDD** | Gherkin `Given`/`When`/`Then` scenarios and step definitions, creating a shared language with business stakeholders. |
| **Hybrid** | A combination of patterns; this is what most real production suites become. |

### Page Object Model and DRY

The **Page Object Model (POM)** separates what a screen can do from what a test checks:

- Create one page-object class per page, containing locators and actions.
- Apply **DRY**: do not repeat a selector; define it once and reuse it.
- Let tests express user intent instead of raw CSS selector details.
- For very large suites, the **Screenplay** pattern extends POM through actors and tasks.

This means a selector change is updated in one place rather than across hundreds of tests.

```ts
// login.page.ts - the Page Object
class LoginPage {
  email = () => page.getByLabel("Email");
  submit = () => page.getByRole("button", { name: "Sign in" });
}

// The test reads like intent.
await login.email().fill("a@x.vn");
await login.submit().click();
```

## 9. Flaky tests and the discipline of treating tests as code

A **flaky test** passes and fails on the same application code. It erodes trust and trains a team to ignore failures.

| Cause | Example and mitigation |
| --- | --- |
| **Timing** | Races, fixed sleeps, and lack of automatic waits. Use web-first assertions and auto-waiting. |
| **Ordering** | Tests share state, so one passes alone but fails in a suite. Isolate each test and reset state. |
| **Environment** | CPU load, network instability, and drifting test data. Pin or mock dependencies where appropriate. |
| **The real fix** | Use auto-wait, independent tests, and root-cause analysis. Retries are a signal, not a cure. |

GUI automation is programming and must be treated as production code:

- design, review, refactor, and version it as real code;
- expect an upfront cost; its ROI comes only after many re-runs;
- mitigate UI-selector brittleness through POM and auto-waiting; and
- do not automate checks where a human eye is substantially better.

## 10. Web automation tools and framework choice

The deck characterises the 2026 web-automation market as having shifted toward Playwright for new projects.

| Attribute | Playwright | Selenium | Cypress |
| --- | --- | --- | --- |
| **New-project adoption (as stated in the deck)** | 45%, leading | 22%, declining | 14% |
| **Languages** | TypeScript, Python, Java, C# | All major languages | JavaScript only |
| **Waiting model** | Auto-wait on every action | Manual waits | Assertion retry |
| **Parallel execution** | Free and built in | Grid or cloud infrastructure | Paid cloud offering |

The deck also cites approximate weekly npm-download figures: Playwright 7.4M, Selenium 2.1M, and Cypress 6M, attributed to 2026 framework surveys.

### Selecting a web framework

| Select | When it fits |
| --- | --- |
| **Playwright** | New projects; teams using TypeScript, Python, Java, or C#; multi-tab and cross-origin flows; free parallel execution; AI test generation. |
| **Cypress** | JavaScript-only teams building a single-origin SPA that value the time-travel debugger. |
| **Selenium** | Teams requiring Ruby, Kotlin, or other languages; stable legacy suites; Appium mobile integration; or the W3C standard. |

No framework is universally best; the selection should fit the team and application.

## 11. Automation across platforms

The discipline is shared, but each platform uses different drivers, locators, environments, and failure mitigations.

| Platform | Typical environment and tools |
| --- | --- |
| **Web** | Browsers and the DOM; Playwright, Selenium, Cypress. |
| **Mobile** | Native and hybrid apps across iOS and Android; Appium, Espresso, XCUITest. |
| **Desktop** | Native Windows/macOS applications; UI Automation, WinAppDriver, FlaUI. |
| **API/services** | No UI, fast and stable; Postman and REST Assured. |
| **Cloud device farms** | Real devices at scale; BrowserStack, Sauce Labs, LambdaTest. |
| **Cross-platform** | One script across many targets where appropriate; Appium and Playwright. |

### Mobile automation tools

| Tool | Role |
| --- | --- |
| **Appium** | Cross-platform iOS and Android automation using the WebDriver standard and one API. |
| **Espresso** | Google's Android-native, fast, in-process, white-box framework. |
| **XCUITest** | Apple's fast, Xcode-integrated iOS-native framework. |
| **Maestro** | A modern tool with simple YAML flows and auto-waiting; described as resilient and rising in 2025. |
| **Detox** | A grey-box, synchronisation-aware framework for React Native with reduced flakiness. |
| **Device farms** | BrowserStack, Sauce Labs, LambdaTest, Kobiton, and AWS services for running on actual devices. |

Native and hybrid applications have different constraints, and mobile suites should run on real devices as well as, rather than only, emulators.

#### Mobile example: Appium and Maestro

For mobile, accessibility IDs are preferred stable cross-platform locators. They are also used by screen readers.

```ts
// Appium + WebdriverIO
const btn = await driver.$("~loginBtn"); // accessibility id
await btn.click();
await driver.$("~email").setValue("a@x.vn");
await expect(driver.$("~welcome")).toBeDisplayed();
```

```yaml
# Maestro - flow.yaml; execute with: maestro test flow.yaml
- launchApp
- tapOn: "Sign in"
- inputText: "a@x.vn"
- assertVisible: "Welcome"
```

Appium drives a real device or emulator via an Appium server or device farm. One API can support iOS and Android capabilities; Maestro offers a simpler YAML alternative with auto-waiting and less flakiness.

### Desktop automation tools

Desktop automation should use object-based interaction when possible and image/pixel-based automation only as a fallback.

| Tool | Role |
| --- | --- |
| **Appium for Windows/macOS** | WinAppDriver and Mac2 drivers using the WebDriver standard; open source. |
| **FlaUI / White** | .NET tooling built on Windows UI Automation; object-based and open source. |
| **WinAppDriver** | Microsoft's Windows driver; object-based, with maintenance described as slowing. |
| **Ranorex / TestComplete** | Commercial tooling with record-playback and AI object recognition. |
| **SikuliX / AutoIt** | Image/pixel-based fallback for applications that do not expose UI objects. |
| **Playwright / Selenium** | Appropriate for Electron and web-based desktop applications. |

#### Desktop example: WinAppDriver and FlaUI

Use **AutomationId** as the desktop equivalent of a stable test ID. Image automation should be a last resort.

```csharp
// WinAppDriver - Appium-style C#
session.FindElementByName("Seven").Click();
session.FindElementByName("Plus").Click();
session.FindElementByName("Eight").Click();
Assert.AreEqual("15", display.Text);
```

```csharp
// FlaUI - directly drives UI Automation
var win = app.GetMainWindow(automation);
win.FindFirstDescendant(
  cf.ByAutomationId("btn7")).AsButton().Click();
```

FlaUI drives UI Automation directly without a server. SikuliX or AutoIt is used only when the application exposes no usable object model.

### Cross-platform comparison

| Aspect | Web | Mobile | Desktop |
| --- | --- | --- | --- |
| **Driver** | WebDriver or CDP | Appium, Espresso, XCUITest | UIA, WinAppDriver, image-based tooling |
| **Locators** | CSS, XPath, role | Accessibility ID, XPath | Automation ID, UIA, image |
| **Environment** | Browsers | Emulators and real devices | OS versions and native controls |
| **Parallel execution** | Easy and inexpensive | Device farms | Harder and VM-bound |
| **Main challenge** | Cross-browser variation | Device fragmentation | Lack of a stable object model |

## 12. Other automation layers

Automation also applies below and around the browser UI:

| Layer | Tools and purpose |
| --- | --- |
| **API** | Postman/Newman, REST Assured, and Playwright `APIRequest`; fast and stable checks without a UI. |
| **Visual** | Applitools and Percy use AI visual differences to catch changes conventional assertions miss. |
| **Accessibility** | `axe-core` in the delivery pipeline automates accessibility checks. |
| **Contract** | Pact automates API contracts between services. |
| **Desktop** | WinAppDriver and Playwright for Electron applications. |
| **Mobile** | Appium, Espresso, and XCUITest. |

## 13. Codeless and low-code automation

Low-code and codeless tools let non-programmers author tests and can reduce initial setup and maintenance effort.

- **Natural-language testing:** testRigor and TestBooster allow a case to be expressed in plain English.
- **Record and refine:** Katalon, Selenium IDE, and Playwright codegen can scaffold scripts.
- **Enterprise low-code:** Tricentis Tosca, mabl, Reflect, and Testim.

The trade-off is a fast start versus the risks of vendor lock-in and opaque test logic.

## 14. AI-first test automation

AI can now write, maintain, and stabilise tests, but people must steer and review it.

| Capability | What it does | Example tools |
| --- | --- | --- |
| **Self-healing locators** | When a UI changes, finds the intended element again rather than simply failing. | Testim, mabl, Healenium |
| **Visual AI** | Compares screenshots, ignores inconsequential noise, and flags meaningful visual change. | Applitools, Percy |
| **Natural-language test generation** | Converts described intent into a draft test that a human reviews. | testRigor, Playwright MCP |

### Agentic testing

The deck describes a 2026 shift from scripts toward agents and notes that Gartner tracks **Agentic Software Quality Assurance**: AI that performs testing rather than merely assisting a person.

An agent may:

1. **Explore:** crawl an application and propose test cases from its UI or specification.
2. **Generate and run:** write, execute, and report tests autonomously.
3. **Self-heal:** repair broken locators and update flows as the application changes.
4. **Use MCP tools:** drive Playwright and browsers through Model Context Protocol tools, while a human reviews resulting diffs.

> Humans remain in the loop: agents draft and heal, but a person reviews the intended behaviour, owns the assertions, and signs off.

## 15. Modern Playwright practices

Role and label locators, web-first assertions, and automatic waiting make browser tests more stable and readable.

```ts
// Playwright + TypeScript: checkout happy path
test("checkout with a coupon", async ({ page }) => {
  await page.goto("/cart");
  await page.getByLabel("Coupon").fill("SAVE10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByTestId("total")).toHaveText("90.00");
});
```

Key practices shown by the example:

- Prefer **role and label locators**, which are resilient to many markup changes.
- Use **web-first assertions**: `expect()` automatically retries until the condition becomes true or times out.
- Avoid manual sleeps; automatic waiting removes a common cause of flakes.
- Run tests in parallel across browsers in CI.

### Data-driven testing and resilient selectors

Data-driven tests run one flow against many inputs and expected outcomes.

```ts
// One flow, many rows.
const cases = [
  { coupon: "SAVE10", total: "90.00" },
  { coupon: "BOGO", total: "50.00" },
  { coupon: "BAD", total: "error" },
];

for (const c of cases) {
  test(`coupon ${c.coupon}`, async ({ page }) => {
    /* arrange, act, assert using c */
  });
}
```

For resilient location, prefer semantic hooks in this order: **role, label, and test ID**, rather than brittle CSS or XPath paths. Self-healing tools can re-find an element when attributes shift, but every proposed healing change must be reviewed instead of blindly accepted. Locating by intent is also the information self-healing AI relies on.

## 16. Why automation is hard and how to address it

| Challenge | Why it is difficult | Countermeasure |
| --- | --- | --- |
| **Flaky tests** | Timing, ordering, and environment issues undermine trust in the suite. | Auto-wait; isolate and reset state; fix root causes rather than merely adding retries. |
| **Maintenance cost** | UI changes break selectors; a suite decays without continuous care. | POM/DRY, stable locators, and AI self-healing selectors. |
| **Dynamic elements** | Shifting IDs, asynchronous loading, animations, iframes, and shadow DOM complicate location and timing. | Role/test-ID locators, explicit waits where needed, and web-first assertions. |
| **Scope and ROI** | Not every check is worth automating; 100% automation is a myth. | Risk-based selection; retain manual exploratory testing; measure ROI. |
| **Test data and environments** | Realistic data, setup/teardown, and unstable dependencies are difficult to control. | Manage isolated data and dependencies deliberately. |
| **Skills gap** | Teams may underestimate that automated tests are software. | Treat tests as code, train testers, and pair them with developers. |
| **Fragmentation** | Browsers, OS versions, and devices multiply execution combinations. | Cloud device farms, impact-based selection, and parallel execution. |

AI self-healing, natural-language authoring, and agentic runners can reduce maintenance burden and flakiness, but they do not remove the team's responsibility for correct assertions.

## 17. Automated tests in CI/CD

Automated tests provide the most value when they are integrated into a delivery pipeline:

1. A **push or pull request** triggers the workflow.
2. **Unit and API tests** run first as a fast gate.
3. Selected **UI tests** run in parallel for key flows.
4. The system publishes a **report and artifacts**.
5. The outcome becomes a **merge gate**.

Keep the pipeline fast: parallelise work, execute unit/API checks on every pull request, and reserve heavier UI/end-to-end work for merge or nightly execution. A failing automated test should block the merge; that enforcement is a core reason for automating it.

## 18. Process discipline: dos and don'ts

| Do | Do not |
| --- | --- |
| Automate stable, high-value, repeated tests. | Chain tests so that one failure cascades. |
| Keep tests independent and self-contained. | Automate an unstable, continually changing UI. |
| Use POM/DRY and review tests like production code. | Rely on fixed sleeps and brittle XPath. |
| Run suites in CI and treat flakes as bugs. | Chase 100% UI automation. |
|  | Ignore failures by saying “just re-run it.” |

Most automation initiatives fail for process reasons, not simply because of the tool selection.

## 19. Metrics for automation health

Track whether the suite is an asset or a liability.

| Dimension | Metrics |
| --- | --- |
| **Value** | Automation coverage; requirements covered; time saved versus manual execution; escaped defects. |
| **Health** | Flakiness rate; pass/fail trend; mean time to repair; suite runtime. |
| **Efficiency** | Percentage of tests selected through impact analysis; parallel speed-up; maintenance cost per release; locator-heal rate. |

## 20. Suggested free stack and AI-first workflow

### Free, open-source, CI-friendly stack

- **Playwright:** web and API testing with Trace Viewer.
- **Appium:** mobile automation.
- **Cucumber:** optional BDD.
- **Healenium:** self-healing for Selenium.
- **GitHub Actions:** CI execution.

### AI-first workflow

1. AI drafts tests from a user story or the UI.
2. A human reviews the test's intent and assertions.
3. CI executes the test; impact analysis selects the relevant subset.
4. Self-healing proposes fixes for broken locators.
5. AI triages failures; a human decides the actual fix.

## Final takeaways

- Automate stable, repeated, high-value tests.
- Keep UI automation thin and push checks down the test pyramid.
- Treat regression as running only what a change can break where impact analysis is available.
- The deck identifies Playwright as the leading choice for new web projects in 2026.
- AI can self-heal and draft tests, but humans remain accountable for assertions.

### Further reading named in the deck

- Playwright documentation
- Google Testing Blog
- Gartner material on Agentic QA
- Applitools and Testim blogs

### Suggested practical deliverable

Build an EShop Playwright suite with Page Objects, data-driven cases, CI execution, and impact-based test selection.
