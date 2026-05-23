---
title: "S12 — Automation Testing"
source: "Slides/S12_Automation testing.pdf"
course: CSC13003 Software Testing
slides: 27
tags: [software-testing, slides, automation-testing]
---

## Slide 1 — Title Slide

Software Testing CSC13003 — Automation Testing.

## Slide 2 — Content

- What is Automation Testing?
- Why Do We Need Automation Testing?
- Which Test Cases To Automate?
- Why Test Automation Fails?

## Slide 3 — What is Automation Testing? (Part 1)

- Utilizes specialized automation testing tools to automatically run a suite of test cases.
- The process of running the same test suite repeatedly is time-consuming, so by leveraging a test automation tool, it is much faster to write the test suite, re-play it as required, reduce human intervention, and improve testing ROI.

## Slide 4 — What is Automation Testing? (Part 2)

- With automation testing, you can effortlessly input test data into the System Under Test, compare expected outcomes with actual results, and generate comprehensive test reports.

## Slide 5 — Why Do We Need Automation Testing? — Improved Accuracy

- Improved Accuracy
  - Automation testing reduces the likelihood of human errors as automated tests are designed to strictly follow a set of predefined steps.
  - Automated tests eliminate the chances of human testers introducing errors like forgetting a certain step while executing the tests.

## Slide 6 — Why Do We Need Automation Testing? — Increased Speed

- Increased Speed
  - Automated tests can run continuously, in parallel, 24/7, without the need for human intervention, further increasing the speed of test execution and reducing the overall testing time.

## Slide 7 — Why Do We Need Automation Testing? — Consistency

- Consistency
  - With automation testing, test cases are executed in exactly the same way every time they are run.
  - They can also be run multiple times a day, ensuring that new issues are quickly identified and resolved, leading to improved confidence in the software quality.

## Slide 8 — Why Do We Need Automation Testing? — Cost Savings

- Cost Savings
  - The costs of time, technologies and human resources are often the biggest blockers to automation adoption.
  - Not only pertaining to software test automation, setting up and standardizing automated workflows don't happen overnight.
  - However, the long-term ROI in accuracy, speed, and consistency is guaranteed.

## Slide 9 — Why Do We Need Automation Testing? — Enhanced Test Coverage

- Enhanced Test Coverage
  - Automated test suites can be reused to run against multiple browsers, devices and operating systems combinations.
  - Using cloud environments is also an effective practice to test on older versions of browsers, devices and operating systems (e.g., iOS 13).

## Slide 10 — Why Do We Need Automation Testing? — Improved Test Reusability

- Improved Test Reusability
  - Once automated tests are created, they can be stored and reused across multiple systems with the click of a button, and testers do not need to spend time re-creating and executing tests for each testing cycle.

## Slide 11 — Why Do We Need Automation Testing? — Continuous Testing

- Continuous Testing
  - Automated tests can be run frequently and at any stage of the development process, whether it's during the development phase, integration phase, or after deployment.
  - They can even be integrated into the development pipeline, so that they are run automatically every time new changes are made to the software.

## Slide 12 — Which Test Cases To Automate? — Ideal Candidates

- Following test cases are ideal candidates for test automation:
  - Tests prone to failure due to human error
  - Monotonous and repetitive tests
  - Extensive tests utilizing multiple data sets
  - Tests not feasible for manual execution
  - Manually intensive tests taking significant time
  - Tests with high potential risk
  - Tests requiring execution on multiple hardware and software platforms

## Slide 13 — Which Test Cases To Automate? — Not All Suitable

- It is also important to note that not all test cases are suitable for automation.
- Test cases for which the requirements are frequently changing and test cases executed on an ad-hoc basis should not be automated due to their unpredictable nature.

## Slide 14 — Which Test Cases To Automate? — Industries

- Industries
  - Automated testing is widely used in many industries, most commonly being IT, eCommerce, Banking & Finance, Insurance, Telecommunications, Gaming, and even Education.
  - Any industry with business models revolving around high functionality, stability, digital presence, or top-notch user experience can benefit tremendously by adopting automation testing.

## Slide 15 — Which Test Cases To Automate? — Application Under Tests

- Application Under Tests
  - Automation testing can be used to test various quality aspects of websites, mobile applications, desktop applications, and API.
  - For example, tests to verify the functionality, performance, security and usability of a website can easily be automated.
  - Mobile applications can be tested for compatibility with different operating systems, devices, and screen sizes.

## Slide 16 — Which Test Cases To Automate? — Testing Types

- Testing types
  - Testers can automate a wide range of testing types, including regression testing, acceptance testing, unit testing, or integration testing, to name a few.

## Slide 17 — Which Test Cases To Automate? — Testing Environment

- Testing environment
  - Automation testing can be used across different operating systems, browsers, and devices.

## Slide 18 — Why Test Automation Fails? — Lack of Planning

- Problem: Lack of proper planning and strategy
- Solution:
  - Determine the scope of automation
  - Select the right tool
  - Prepare test data
  - Design & execute test cases
  - Maintain and update tests
  - Monitor and report results

## Slide 19 — Why Test Automation Fails? — Insufficient Understanding of AUT

- Problem: Insufficient understanding of the application under test
  - The more familiar you are with the application, the easier it will be to identify which test cases are suitable for automation, especially the ones that are critical, time-consuming, and repetitive, and which test cases should be done manually.
- Solution:
  - Start by reading through the requirements and specifications of the application to know its purpose and functionality, as well as its components and dependencies.
  - Conduct exploratory testing on the application to familiarize yourself with its features and behaviors.
  - Work closely with the development team to gain insights into the design and implementation of the application.

## Slide 20 — Why Test Automation Fails? — Not Using Cloud Environments

- Problem: Not using cloud environments
- Solution:
  - Essentially, with on-cloud testing, QA teams can execute automated tests across a wide range of browsers and devices instead of investing into physical machines.
  - This practice can bring the agility, flexibility, and cost savings needed to deliver high-quality software.
  - Cloud testing environment can accurately simulate the real-world conditions in which the application will be used, minus the cost of setting up the right hardware-software configuration.
  - Not just that, testers can even schedule tests to run automatically at a predetermined time, which is ideal for regression testing, saving plenty of time and effort.

## Slide 21 — Why Test Automation Fails? — Lack of Collaboration

- Problem: Lack of collaboration between development and testing teams
  - Both teams must work together to ensure that the testing process is integrated into the development process, and that any issues are quickly addressed.
- Solution:
  - Clearly define roles and responsibilities
  - Joint planning and testing
  - Use a common toolset

## Slide 22 — Why Test Automation Fails? — Wrong Tool Selection (Compatibility & Functionality)

- Problem: Wrong tool selection
- Solution:
  - Compatibility: this automation testing tool should be compatible with your software development environment, including your operating system, programming language, and any other tools you are using.
  - Functionality: the tool should have the necessary functionalities to create, run, report and debug tests. Additionally, assess whether the tool's strength (e.g., web UI testing) matches with your testing needs most.

## Slide 23 — Why Test Automation Fails? — Wrong Tool Selection (Usability & Scalability)

- Problem: Wrong tool selection
- Solution:
  - Usability: the automated testing tool should have a user-friendly interface that is easy to navigate with clear instructions to help you perform your tests effectively.
  - Scalability: a good testing tool should be scalable to meet the demands of your testing needs, both now and in the future, as your software evolves and grows.

## Slide 24 — Why Test Automation Fails? — Wrong Tool Selection (Integration & Support)

- Problem: Wrong tool selection
- Solution:
  - Integration: a good automation testing tool should be able to integrate with other tools you are using, such as your bug tracking system or continuous integration platform, to help streamline your testing process.
  - Support: the tool should have good customer support and a vibrant community, with resources such as forums, online tutorials, and knowledge bases.

## Slide 25 — Why Test Automation Fails? — Wrong Tool Selection (Security & Reputation)

- Problem: Wrong tool selection
- Solution:
  - Security: the tool should have adequate security measures in place to protect your data and ensure that your tests are performed securely.
  - Reputation: The tool should have a good reputation in the testing community, with positive reviews and recommendations from other users and experts.

## Slide 26 — Reference

- katalon.com/resources-center/blog/what-is-automation-testing

## Slide 27 — Q&A

Q&A slide. Two overlapping speech bubbles showing "Q" (blue) and "A" (dark grey) — open for questions and answers.
