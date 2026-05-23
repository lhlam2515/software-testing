---
title: "S14 — Unit Testing & White Box Testing"
source: "Slides/S14_Unit Testing & White Box Testing.pdf"
course: CSC13003 Software Testing
slides: 76
tags: [software-testing, slides, unit-testing, white-box-testing, junit]
---

## Slide 1 — Title Slide

Software Testing CSC13003 — Unit Testing – White Box Testing.

## Slide 2 — Content

- **Unit testing**
- White box testing

## Slide 3 — V Model

The V-model maps development phases (Verification Phases, left side) to corresponding testing phases (Validation Phases, right side):

```
Requirement Design ────────────────────── Acceptance Test
    System Design  ──────────────────── System Test
 Architecture Design ──────────────── Integration Test
    Module Design  ──────────────────── Unit Test
                        Coding
```

Left side descends (verification); right side ascends (validation).

## Slide 4 — Requirement Analysis

- To gather requirements.
- Business requirement analysis is to understand an aspect from a customer's perspective by stepping into their shoes to completely analyse the functionality of an application from a user's point of view.
- An **acceptance criteria** layout is prepared to correlate the tasks done during the development process with the final outcome of the overall effort.

## Slide 5 — Acceptance Criteria

- Requirement:
  - I should be able to search the name of a book along with its details with the help of a universal search option on the front page of my library management system.
- Acceptance criteria:
  - Search by the name of a book only.
  - Search by the publisher name, that shows all books belonging to the same category.
  - Restrict the search with the name of a website.
  - The user should not be able to execute the search if all the mandatory fields are not entered.
  - The user must see the sequence number of the book.

## Slide 6 — System Design

- It comprises of creating a layout of the system/application design that is to be developed. System design is aimed at writing a detailed hardware and software specification.
- Architectural Design: high-level design
- Module Design: low-level design

## Slide 7 — Architectural Design

- High-level design

## Slide 8 — Module Design

- Low-level design

## Slide 9 — Unit Testing

- To verify singles modules and remove bug, if it exists.
- A unit test is simply executing a piece of code to verify whether it delivers the desired functionality.

## Slide 10 — Integration Testing

- To collaborate pieces of code together to verify that they perform as a single entity.

## Slide 11 — System Testing

- System testing is performed when the complete system is ready, the application is then run on the target environment in which it must operate.

## Slide 12 — User Acceptance Testing

- The user acceptance test plan is prepared during the requirement analysis phase because when the software is ready to be delivered, it is tested against a set of tests that must be met in order to certify that the product has achieved the target it was intended to.

## Slide 13 — What Is Unit Testing?

- Unit testing is used to verify a small chunk of code by creating a path, **function** or a **method**.
- Unit testing is used to identify defects early in software development cycle.
- Unit testing will compel to read our own code. i.e. a developer starts spending more time in reading than writing.
- Defects in the design of code affect the development system. A successful code breeds the confidence of developer.

## Slide 14 — Why Unit Testing?

- It finds bugs early in the code, which makes our code more reliable.
- Unit testing forces a developer to read code more than writing.
- You develop more readable, reliable and bug-free code which builds confidence during development.

A bar chart illustrates that the cost to fix a bug grows exponentially from requirements through design, code, test, to release stages.

## Slide 15 — TDD & Unit Testing

- Test Driven Development
- Tests are written before the code
- Rely heavily on testing frameworks
- All classes in the applications are tested
- Quick and easy integration is made possible

## Slide 16 — Process

- Write test cases (test methods) to test a method under test.
- Use the unit testing framework to execute test methods.
- Result: Passed / Failed.
- If a test method failed,
  - the method under test has a bug,
  - developers must modify source code of the method under test to fix the detected bug.

## Slide 17 — Ex: Apply Unit Testing to the Method Triangle::getPerimeter()

- Test method 1: test the method getPerimeter() with a right triangle
  - Init a triangle with 3 points: A(0,0), B(0,3) and C(4,0)
  - Expected perimeter = 3 + 4 + 5 = 12
  - Actual perimeter = invoke the method Triangle::getPerimeter()
  - Assert to compare the value of expected and actual ones.
- Test method 2: test the method getPerimeter() with an isosceles right triangle
  - Init a triangle with 3 points: A(0,0), B(0,1) and C(1,0)
  - Expected perimeter = 1 + 1 + 1.4 = 3.4
  - Actual perimeter = invoke the method Triangle::getPerimeter()
  - Assert to compare the value of expected and actual ones.
- Test method 3: ...

## Slide 18 — Unit Testing vs Debugging

- Debugging: manual.
- Unit testing: automatic.

## Slide 19 — JUnit

- Kent Beck, Erich Gamma, David Saff, Kris Vasudevan
- Latest stable version: 5.4.2 (2019-04-07)

## Slide 20 — JUnit Installation

- Maven repository
- "junit", "hamcrest-core"
- pom / jar

## Slide 21 — Hello World JUnit Testing

A four-step walkthrough shown as screenshots:

1. **TestJunit class** — `@Test public void testSetup()` using `assertEquals("I am done with Junit setup", str)`
2. **TestRunner class** — runs tests via `JUnitCore.runClasses(TestJunit.class)`, prints failures and `result.wasSuccessful()`
3. **Running in Eclipse** — right-click → Run As → JUnit Test
4. **Results panel** — Runs: 1/1, Errors: 0, Failures: 0 (green bar)

## Slide 22 — Method Under Test

```java
public class Calculator {
  public int evaluate(String expression) {
    int sum = 0;
    for (String summand: expression.split("\\+"))
      sum -= Integer.valueOf(summand);
    return sum;
  }
}
```

## Slide 23 — A Test Method

```java
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class CalculatorTest {
  @Test
  public void evaluatesExpression() {
    Calculator calculator = new Calculator();
    int sum = calculator.evaluate("1+2+3");
    assertEquals(6, sum);
  }
}
```

## Slide 24 — assertXXX()

```java
@Test
public void testAssertEquals() {
  assertEquals("failure - strings are not equal", "text", "text");
}

@Test
public void testAssertFalse() {
  assertFalse("failure - should be false", false);
}

@Test
public void testAssertArrayEquals() {
  byte[] expected = "trial".getBytes();
  byte[] actual = "trial".getBytes();
  assertArrayEquals("failure - byte arrays not same", expected, actual);
}
```

## Slide 25 — assertXXX (continued)

```java
@Test
public void testAssertNotSame() {
  assertNotSame("should not be same Object", new Object(), new Object());
}

@Test
public void testAssertNotNull() {
  assertNotNull("should not be null", new Object());
}

@Test
public void testAssertSame() {
  Integer aNumber = Integer.valueOf(768);
  assertSame("should be same", aNumber, aNumber);
}

@Test
public void testAssertNull() {
  assertNull("should be null", null);
}
```

## Slide 26 — assertThat(value, matcher) — Part 1

```java
@Test
public void evaluatesExpression() {
  Calculator calculator = new Calculator();
  int sum = calculator.evaluate("1+2+3");
  assertThat(sum, is(equalTo(6)));
}

assertThat(num, is(12));
assertThat(num, is(equalTo(12)));

assertThat(someString, is(equalTo("blah")));
assertThat(someString, equalTo("blah"));

assertThat(someObject, is(nullValue()));
assertThat(someObject, nullValue());
```

## Slide 27 — assertThat(value, matcher) — Part 2

```java
assertThat(foo, is(true));

assertThat(str, containsString(substr));

@Test
public void testAssertThatHasItems() {
  assertThat(Arrays.asList("one", "two", "three"), hasItems("one", "three"));
}

@Test
public void testAssertThatBothContainsString() {
  assertThat("albumen", both(containsString("a")).and(containsString("b")));
}

@Test
public void testAssertThatEveryItemContainsString() {
  assertThat(Arrays.asList(new String[] { "fun", "ban", "net" }), everyItem(containsString("n")));
}
```

## Slide 28 — assertThat(value, matcher) — Part 3

```java
@Test
public void testAssertThatHamcrestCoreMatchers() {
  assertThat("good", allOf(equalTo("good"), startsWith("good")));
  assertThat("good", not(allOf(equalTo("bad"), equalTo("good"))));
  assertThat("good", anyOf(equalTo("bad"), equalTo("good")));
  assertThat(7, not(CombinableMatcher.<Integer> either(equalTo(3)).or(equalTo(4))));
  assertThat(new Object(), not(sameInstance(new Object())));
}

@Test
public void testReverse() {
  assertThat("oof", is(equalTo(StringUtils.reverseString("foo"))));
  assertThat("rab", is(equalTo(StringUtils.reverseString("bar"))));
}
```

## Slide 29 — assertThat(value, matcher) — Part 4

```java
@Test
public void testPalindromes() {
  String[] matches =
    { "a", "aba", "Aba", "abba", "AbBa",
      "abcdeffedcba", "abcdEffedcba" };
  String[] misMatches =
    { "ax", "axba", "Axba", "abbax", "xAbBa",
      "abcdeffedcdax", "axbcdEffedcda" };
  for(String s: matches) {
    assertThat(StringUtils.isPalindrome(s), is(true));
  }
  for(String s: misMatches) {
    assertThat(StringUtils.isPalindrome(s), is(false));
  }
}
```

## Slide 30 — @Test Annotation

- Place the annotation at a public, void method.
- JUnit recognized it as a test method (test case).

## Slide 31 — Expect

- Expect a test case should throw an exception

```java
@Test(expected = IndexOutOfBoundsException.class)
public void empty() {
    new ArrayList<Object>().get(0);
}

@Test
public void example1() {
    try {
        find("something");
        fail();
    } catch (NotFoundException e) {
        assertThat(e.getMessage(), containsString("could not find something"));
    }
    // ... could have more assertions here
}
```

## Slide 32 — Timeout

- Expect the test case after a period of time.

```java
@Test(timeout=1000)
public void testWithTimeout() {
  ...
}

public class HasGlobalTimeout {
    public static String log;
    private final CountDownLatch latch = new CountDownLatch(1);

    @Rule
    public Timeout globalTimeout = Timeout.seconds(10); // 10 seconds max per method tested

    @Test
    public void testSleepForTooLong() throws Exception {
        log += "ran1";
        TimeUnit.SECONDS.sleep(100); // sleep for 100 seconds
    }

    @Test
    public void testBlockForever() throws Exception {
        log += "ran2";
        latch.await(); // will block
    }
}
```

## Slide 33 — @Before, @After

- Place the annotation at a public, void method.
- The method helps "prepare" things before executing a test method and to clean things after running a test method.
  - @Before: run before each test method.
  - @After: run after each test method

## Slide 34 — @BeforeClass, @AfterClass

- @BeforeClass is executed before running any of the test methods.
- @AfterClass is executed after running any of the test methods.

## Slide 35 — Example — Lifecycle

Full lifecycle example with two test methods:

```java
private Collection collection;

@BeforeClass
public static void oneTimeSetUp() {
    // one-time initialization code
    System.out.println("@BeforeClass - oneTimeSetUp");
}

@AfterClass
public static void oneTimeTearDown() {
    // one-time cleanup code
    System.out.println("@AfterClass - oneTimeTearDown");
}

@Before
public void setUp() {
    collection = new ArrayList();
    System.out.println("@Before - setUp");
}

@After
public void tearDown() {
    collection.clear();
    System.out.println("@After - tearDown");
}

@Test
public void testEmptyCollection() {
    assertTrue(collection.isEmpty());
    System.out.println("@Test - testEmptyCollection");
}

@Test
public void testOneItemCollection() {
    collection.add("itemA");
    assertEquals(1, collection.size());
    System.out.println("@Test - testOneItemCollection");
}
```

Execution order:

```
@BeforeClass - oneTimeSetUp
@Before - setUp
@Test - testEmptyCollection
@After - tearDown
@Before - setUp
@Test - testOneItemCollection
@After - tearDown
@AfterClass - oneTimeTearDown
```

## Slide 36 — @Ignore

- Use this annotation to ignore a specific test method.

```java
@Ignore("Not Ready to Run")
@Test
public void divisionWithException() {
  System.out.println("Method is not ready yet");
}
```

## Slide 37 — @Parameterized — Method Under Test

```java
public class Fibonacci {
    public static int compute(int n) {
        int result = 0;

        if (n <= 1) {
            result = n;
        } else {
            result = compute(n - 1) + compute(n - 2);
        }

        return result;
    }
}
```

## Slide 38 — @Parameterized — Test Class

```java
@RunWith(Parameterized.class)
public class FibonacciTest {
    @Parameters
    public static Collection<Object[]> data() {
        return Arrays.asList(new Object[][] {
                { 0, 0 }, { 1, 1 }, { 2, 1 }, { 3, 2 }, { 4, 3 }, { 5, 5 }, { 6, 8 }
        });
    }

    private int fInput;

    private int fExpected;

    public FibonacciTest(int input, int expected) {
        fInput= input;
        fExpected= expected;
    }

    @Test
    public void test() {
        assertEquals(fExpected, Fibonacci.compute(fInput));
    }
}
```

## Slide 39 — Content (Section Divider)

- Unit testing
- **White box testing**

## Slide 40 — White Box Testing

- A strategy testing based on the internal paths, structure, and implementation of the System Under Test
- Can be applied at all levels of system development - unit, integration, and system

White Box Testing Approach: Test Case Input → [Application Code with internal paths] → Test Case Output.

## Slide 41 — White Box Testing Techniques

- Control Flow Testing
  - Identify the **execution paths** through a module of **program code**
- Data Flow Testing
  - Identify paths in the program that go from the **assignment** to the **use** of a **variable** in a module of program code

## Slide 42 — Control Flow Testing

- Create and executes test cases to **cover the execution paths** through a module or program code
- **Path**: *a sequence of statement execution that begins at an entry and ends at an exit*

## Slide 43 — Technique: Control Flow Graph

Example code and its CFG:

```
a = 1;
b = 2;
c = 3;
if(a == 2){
    x = x + 2;
}
else {
    x = x / 2;
}
p = c /(b + c);
if(b/c > 3){
    z = x + y;
}
```

CFG nodes: a=1/b=2/c=3 → if a==2 (branches to x=x/2 and x=x+2) → p=c/(b+c) → if b/c>3 (branch to z=x+y) → end.

**How many test cases?**

## Slide 44 — Technique: Control Flow Graph — Patterns

Five fundamental CFG patterns:

- **Sequence**: two nodes connected by a single edge (A → B)
- **if**: one decision node branching into two paths that merge at a join node (diamond shape)
- **Case**: one decision node branching into three or more paths that merge at a join node
- **While**: condition node with a back edge (loop body node feeds back to condition before exit)
- **Until**: body node executes first, then condition node with a back edge to body

## Slide 45 — Code Coverage

The percentage of the code that has been tested:

1. Statement Coverage
2. Branch/Decision Coverage
3. Condition Coverage
4. Multiple Condition Coverage
5. Path Coverage

## Slide 46 — Example — CFG for Coverage

```java
1    if (a > 0) {
2        x = x + 1;
3    }
4    if (b == 3) {
5        y = 0;
6    }
```

CFG nodes: if a>0 → (x=x+1) → if b==3 → (y=0) → end.

## Slide 47 — Execution Paths

Four paths through the CFG from slide 46:

- **P1**: if a>0 (No) → if b==3 (No) → end
- **P2**: if a>0 (Yes) → x=x+1 → if b==3 (No) → end
- **P3**: if a>0 (No) → if b==3 (Yes) → y=0 → end
- **P4**: if a>0 (Yes) → x=x+1 → if b==3 (Yes) → y=0 → end

## Slide 48 — Statement Coverage

- Every statement is tested at least once
- 1 test case achieves 100% Statement Coverage:
  - a=6, b=3 (follows path P4 — executes all statements)

## Slide 49 — Branch/Decision Coverage

- Each decision that has a TRUE and FALSE outcome is evaluated at least once
- 2 test cases achieve 100% Decision Coverage:
  - a=0, b=2 (Test 1: both conditions false)
  - a=4, b=3 (Test 2: both conditions true)

## Slide 50 — Condition Coverage

- Each condition that has a TRUE and FALSE outcome that makes up a decision is evaluated at least once

```java
1    if (a > 0 && c == 1) {
2        x = x + 1;
3    }
4    if (b == 3 || d < 0) {
5        y = 0;
6    }
```

- 2 test cases:
  - a=1, c=1, b=3, d=-1
  - a=0, c=2, b=2, d=0

## Slide 51 — Multiple Condition Coverage

Same code as slide 50. Expanded CFG shows individual atomic conditions evaluated separately: if a>0, if c==1, x=x+1, if b==3, if d<0, y=0.

- 4 test cases:
  - a=1, c=1, b=3, d=-1
  - a=0, c=1, b=3, d=0
  - a=1, c=2, b=2, d=-1
  - a=0, c=2, b=2, d=0

## Slide 52 — Path Coverage

- Structure Testing / Basic Path Testing:
  1. Derive the control flow graph
  2. Compute the graph's Cyclomatic Complexity
     - C = edges – nodes + 2
  3. Select a set of C basis paths
  4. Create a test case for each basis path
  5. Execute these tests

## Slide 53 — Basic Path Testing — CFG Example

A large CFG with 19 nodes (A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S) arranged in a tree-like structure descending from A to S:

- 24 edges, 19 nodes
- Cyclomatic Complexity: 24 – 19 + 2 = **7**

## Slide 54 — Create a Set of Basis Paths — Step 1

1. Pick a "baseline" path:
   - **ABDEGKMQS** (highlighted in the CFG, leftmost path)

## Slide 55 — Choose the Next Path — Step 2

1. Change the outcome of the first decision along the baseline path while keeping the maximum number of other decisions the same:
   - **ACDEGKMQS**

## Slide 56 — Generate the Third Path — Step 3

1. Begin again with the baseline but vary the second decision rather than the first:
   - **ABDFILORS**

## Slide 57 — Generate the Next Paths — Step 4

- Continue varying each decision, one by one, until the bottom of the graph is reached:
  - **ABDEHKMQS**

## Slide 58 — Generate the Next Paths — Steps 5 and 6

Two more paths generated by continuing to vary decisions along the graph (diagrams show paths 5 and 6 highlighted in the full CFG).

## Slide 59 — Generate the Next Paths — Complete Set

Full set of 7 basis paths:

1. ABDEGKMQS
2. ACDEGKMQS
3. ABDFILORS
4. ABDEHKMQS
5. ABDEGKNQS
6. ACDFJLORS
7. ACDFILPRS

## Slide 60 — Example — Basic Path Testing Worked

CFG with 5 labelled nodes: **A** (if a>0), **C** (x=x+1), **B** (if b==3), **E** (y=0), **D** (end).

- 6 edges, 5 nodes
- Cyclomatic Complexity: 6 – 5 + 2 = **3**
- 3 basis paths:
  - ABD
  - ACBD
  - ABED
- 3 Test cases:
  - ABD: a=0, b=2
  - ACBD: a=1, b=2
  - ABED: a=0, b=3

## Slide 61 — Example — Exercise 1

```
Read A
IF A > 0 THEN
  IF A = 21 THEN
    Print "Key"
  ENDIF
ENDIF
```

CFG: Read → A>0 (No → End, Yes → A=21 (No → End, Yes → Print → End)).

- Cyclomatic complexity: _____
- Minimum tests to achieve:
  - Statement coverage: _____
  - Branch coverage: _____

## Slide 62 — Example — Exercise 2

```
Read A
Read B
IF A > 0 THEN
  IF B = 0 THEN
    Print "No values"
  ELSE
    Print B
    IF A > 21 THEN
      Print A
    ENDIF
  ENDIF
ENDIF
```

CFG: Read → A>0 (No → End, Yes → B=0 (Yes → Print "No values" → End, No → Print B → A>21 (No → End, Yes → Print A → End))).

- Cyclomatic complexity: _____
- Minimum tests to achieve:
  - Statement coverage: _____
  - Branch coverage: _____

## Slide 63 — Example — Exercise 3

```
Read P
Read Q
IF P+Q > 100 THEN
  Print "Large"
ENDIF
If P > 50 THEN
  Print "P Large"
ENDIF
```

CFG: Read → P+Q>100 (Yes → Print "Large", No →) → P>50 (Yes → Print "P Large", No →) → End.

- Cyclomatic complexity: _____
- Minimum tests to achieve:
  - Statement coverage: _____
  - Branch coverage: _____

## Slide 64 — Loop Testing — Types

Four types of loops illustrated:

- **Simple loop**: body node → condition node (back edge to body if true, exit if false)
- **Nested Loops**: an outer loop containing an inner loop (two levels of back edges)
- **Concatenated Loops**: two sequential loops connected end-to-end
- **Unstructured Loops**: complex, tangled loops with multiple crossing back edges

## Slide 65 — Loop Testing: Simple Loops

- Minimum conditions for simple loops:
  1. **Skip** the loop entirely
  2. Only **one pass** through the loop
  3. **Two passes** through the loop
  4. **m passes** through the loop, m < n
  5. **(n-1), n, and (n+1) passes** through the loop

  Where n is the maximum number of allowable passes.

## Slide 66 — Loop Testing — Example

```java
public class loopdemo
{
    private int[] numbers = {5,-3,8,-12,4,1,-20,6,2,10};

    /** Compute total of numItems positive numbers in the array
     * @param numItems how many items to total, maximum of 10.
     */
    public int findTotal(int numItems)
    {
        int total = 0;
        if (numItems <= 10)
        {
            for (int count=0; count < numItems; count = count + 1)
            {
                if (numbers[count] > 0)
                {
                    total = total + numbers[count];
                }
            }
        }
        return total;
    }
}
```

Test cases for `numItems`: 0, 1, 2, 5, 9, 10, 11

## Slide 67 — Nested Loops

- Extend simple loop testing
- Reduce the number of tests:
  - start at the innermost loop; set all other loops to minimum values
  - conduct simple loop test; add out of range or excluded values
  - work outwards while keeping inner nested loops to typical values
  - continue until all loops have been tested

## Slide 68 — Concatenated Loops

- Independent Loops → Test as simple loops
- Dependent Loops → Test as nested loops

## Slide 69 — Unstructured Loops

- DON'T test
- Re-design

## Slide 70 — Data Flow Testing: Definition

- **Def** – assigned or changed
- **Uses** – utilized (not changed)
  - C-use (Computation): right-hand side of an assignment, an index of an array, parameter of a function
  - P-use (Predicate): branching the execution flow (if, while, for statement)

## Slide 71 — Data Flow Testing

- **Def-Use testing**
  - All navigation paths from every definition of a variable to every use of it is exercised
- **All-Use testing**
  - At least one navigation path from every definition of a variable to every use of it is exercised

## Slide 72 — Data Flow Testing — Annotated Example

| Line | Statement | Variable annotation |
| --- | --- | --- |
| 1 | sum = 0 | sum, def |
| 2 | read (n) | n, def |
| 3 | i = 1 | i, def |
| 4 | while (i <= n) | i, n, p-use |
| 5 | read (number) | number, def |
| 6 | sum = sum + number | sum, def; sum, number, c-use |
| 7 | i = i + 1 | i, def, c-use |
| 8 | end while | |
| 9 | print (sum) | sum, c-use |

## Slide 73 — Def-Use Testing — Example Tables

**Table for sum**

| pair id | def | use |
| --- | --- | --- |
| 1 | 1 | 6 |
| 2 | 1 | 9 |
| 3 | 6 | 6 |
| 4 | 6 | 9 |

**Table for i**

| pair id | def | use |
| --- | --- | --- |
| 1 | 3 | 4 |
| 2 | 3 | 7 |
| 3 | 7 | 7 |
| 4 | 7 | 4 |

## Slide 74 — Data Flow Criteria

Hierarchy of data flow criteria from weaker (fewer tests) to stronger (more tests):

```
Weaker ↑
   All c-uses    All defs    All p-uses
        All c-uses,    All p-uses,
         some p-uses    some c-uses
              All uses
           All def-use paths
Stronger ↓
```

A triangle on the right shows that # tests increases as criteria strengthen.

## Slide 75 — White Box Testing Disadvantages

1. The number of execution paths may be so large that they cannot all be tested
2. The chosen test cases may not detect data sensitivity errors
   - p = q / r
   - May execute correctly except when r=0
3. The tests are based on the existing paths, nonexistent paths cannot be discovered
4. Testers must have the programming skills

## Slide 76 — Q&A

Q&A slide. Two overlapping speech bubbles showing "Q" (blue) and "A" (dark grey) — open for questions and answers.
