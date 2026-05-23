---
title: "S05 — Decision Table Testing"
source: "Slides/S05_Decision Table Testing.pdf"
course: CSC13003 Software Testing
slides: 15
tags: [software-testing, slides, decision-table]
---

## Slide 1 — Title: Decision Table Testing

**Software Testing**
CSC13003

Decision Table Testing

---

## Slide 2 — Example: Open Credit Card Discount

- If you want to open a credit card account then there are three conditions
  1. If you are a new customer, you will get a 15% discount on all your purchases today
  2. If you are an existing customer and you hold a loyalty card, you get a 10% discount
  3. If you have a coupon, you can get 20% off today (but it can not be used with the new customer discount).
  - Discount amounts are added, if applicable.

- Different input combinations?
- Need how many Test Cases?

---

## Slide 3 — Decision Table Testing: Overview

- A software testing technique based on Decision Table, a tabular representation of inputs versus rules/cases/test conditions.
- Helps to test different combinations of conditions and provide better test coverage for complex business logic.
- Disadvantage: when the number of input increases the table will become more complex.

| **Causes** | **Values** | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| *Cause 1* | Y, N | Y | Y | Y | Y | N | N | N | N |
| *Cause 2* | Y, N | Y | Y | N | N | Y | Y | N | N |
| *Cause 3* | Y, N | Y | N | Y | N | Y | N | Y | N |
| **Effects** | | | | | | | | | |
| *Effect 1* | | X | | X | | | X | | |
| *Effect 2* | | | X | | | X | X | | |

---

## Slide 4 — Decision Table Testing: 4 Steps

- 4 steps
  1. Identify Causes and Effects
  2. Create Decision Table
  3. Reduce Decision Table
  4. Transform each column in Decision table into a Test Case

---

## Slide 5 — 1. Identify Causes & Effects

- Causes
  - C1: you are a new customer
  - C2: you are an existing customer and you hold a loyalty card
  - C3: you have a coupon
- Effects
  - E1: 15% discount
  - E2: 10% discount
  - E3: 20% discount

---

## Slide 6 — 2. Create Decision Table

| **Cause** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** |
|---|---|---|---|---|---|---|---|---|
| C1 (new) | T | T | T | T | F | F | F | F |
| C2 (loyalty) | T | T | F | F | T | T | F | F |
| C3 (coupon) | T | F | T | F | T | F | T | F |
| **Effect** | | | | | | | | |
| E1 (15%) | | | X | X | | | | |
| E2 (10%) | | | | | X | X | | |
| E3 (20%) | | | | | X | | X | |
| E4 (impossible) | X | X | | | | | | |
| Discount | - | - | 15% | 15% | 30% | 10% | 20% | 0% |

---

## Slide 7 — 3. Reduced Decision Table

After removing impossible combinations (columns 1, 2, and merging column 3 & 4 since C3 is irrelevant when C1=T and C2=F):

| **Cause** | **3** | **5** | **6** | **7** | **8** |
|---|---|---|---|---|---|
| C1 (new) | T | F | F | F | F |
| C2 (VIP) | F | T | T | F | F |
| C3 (coupon) | _ | T | F | T | F |
| **Effect** | | | | | |
| E1 (15%) | X | | | | |
| E2 (10%) | | X | X | | |
| E3 (20%) | | X | | X | |
| Chiết khấu | 15% | 30% | 10% | 20% | 0% |

**Each column in Decision Table is a Test Case**

---

## Slide 8 — 4. Generate Test Cases

| **#TC** | **New** | **VIP** | **Coupon** | **Expected Output (Chiết khấu)** |
|---|---|---|---|---|
| TC1 | Y | N | Y | 15% |
| TC2 | N | Y | Y | 30% |
| TC3 | N | Y | N | 10% |
| TC4 | N | N | Y | 20% |
| TC5 | N | N | N | 0% |

**Each column in Decision Table is a Test Case**

---

## Slide 9 — Next Date Problem: Variable Definitions

- M1 = {month | month has 30 days}
- M2 = {month | month has 31 days}
- M3 = {month | month is December}
- M4 = {month | month is February}
- D1 = {day | 1 ≤ day ≤ 27}
- D2 = {day | day = 28}
- D3 = {day | day = 29}
- D4 = {day | day = 30}
- D5 = {day | day = 31}
- Y1 = {year | year is a leap year}
- Y2 = {year | year is a common year}

---

## Slide 10 — Decision Table (Next Date Problem, columns 1–10)

| **Cause** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **10** |
|---|---|---|---|---|---|---|---|---|---|---|
| C1: month in | M1 | M1 | M1 | M1 | M1 | M2 | M2 | M2 | M2 | M2 |
| C2: day in | D1 | D2 | D3 | D4 | D5 | D1 | D2 | D3 | D4 | D5 |
| C3: year in | - | - | - | - | - | - | - | - | - | - |
| **Effect** | | | | | | | | | | |
| E1: Impossible | | | | | X | | | | | |
| E2: Increment day | X | X | X | | | X | X | X | X | |
| E3: Reset day | | | | X | | | | | | X |
| E4: Increment month | | | | X | | | | | | X |
| E5: reset month | | | | | | | | | | |
| E6: Increment year | | | | | | | | | | |

---

## Slide 11 — Decision Table (Next Date Problem, columns 11–22)

| **Cause** | **11** | **12** | **13** | **14** | **15** | **16** | **17** | **18** | **19** | **20** | **21** | **22** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C1: month in | M3 | M3 | M3 | M3 | M3 | M4 | M4 | M4 | M4 | M4 | M4 | M4 |
| C2: day in | D1 | D2 | D3 | D4 | D5 | D1 | D2 | D2 | D3 | D3 | D4 | D5 |
| C3: year in | - | - | - | - | - | - | Y1 | Y2 | Y1 | Y2 | - | - |
| **Effect** | | | | | | | | | | | | |
| E1: Impossible | | | | | | | | | | X | X | X |
| E2: Increment day | X | X | X | X | | X | X | | | | | |
| E3: Reset day | | | | | X | | | X | X | | | |
| E4: Increment month | | | | | X | | | X | X | | | |
| E5: reset month | | | | | | | | | | | | |
| E6: Increment year | | | | | X | | | | | | | |

> Note: Column 15 (M3, D5) = December 31 triggers reset day, reset month, and increment year (New Year's Eve). Columns 20–22 (February, D3/D4/D5 with common year or no year) are impossible.

---

## Slide 12 — Test Cases (Next Date Problem, TC1–TC8)

| **#TC** | **Day** | **Month** | **Year** | **Expected Output (Next Date)** |
|---|---|---|---|---|
| TC1 | 2 | 4 | 2013 | 4/3/2013 |
| TC2 | 28 | 4 | 2013 | 4/29/2013 |
| TC3 | 29 | 4 | 2013 | 4/30/2013 |
| TC4 | 30 | 4 | 2013 | 5/1/2013 |
| TC5 | 31 | 2 | 2013 | Error |
| TC6 | 2 | 5 | 2013 | 5/3/2013 |
| TC7 | 28 | 5 | 2013 | 5/29/2013 |
| TC8 | 29 | 5 | 2013 | 5/30/2013 |

---

## Slide 13 — Test Cases (Next Date Problem, TC9–TC15)

| **#TC** | **Day** | **Month** | **Year** | **Expected Output (Next Date)** |
|---|---|---|---|---|
| TC9 | 30 | 5 | 2013 | 5/31/2013 |
| TC10 | 31 | 5 | 2013 | 6/1/2013 |
| TC11 | 2 | 12 | 2013 | 12/3/2013 |
| TC12 | 28 | 12 | 2013 | 12/29/2013 |
| TC13 | 29 | 12 | 2013 | 12/30/2013 |
| TC14 | 30 | 12 | 2013 | 12/31/2013 |
| TC15 | 31 | 12 | 2013 | 1/1/2014 |

---

## Slide 14 — Test Cases (Next Date Problem, TC16–TC22)

| **#TC** | **Day** | **Month** | **Year** | **Expected Output (Next Date)** |
|---|---|---|---|---|
| TC16 | 2 | 2 | 2013 | 2/3/2013 |
| TC17 | 28 | 2 | 2000 | 2/29/2000 |
| TC18 | 28 | 2 | 2013 | 3/1/2013 |
| TC19 | 29 | 2 | 2000 | 3/1/2000 |
| TC20 | 29 | 2 | 2013 | Error |
| TC21 | 30 | 2 | 2013 | Error |
| TC22 | 31 | 2 | 2013 | Error |

---

## Slide 15 — Q&A

Q&A
