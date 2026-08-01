# Troubleshooting

## Route handler hangs the whole browser session

`page.route()` handlers run in the browser's execution context, not Node — `setTimeout`
is `undefined` there. A handler like this throws immediately and **never calls
`route.continue()`/`route.fulfill()`**, so the intercepted request hangs forever and
the whole page gets stuck "loading":

```bash
# BROKEN — setTimeout is not defined in this context
playwright-cli run-code "async page => {
  await page.route('**/api/**', async route => {
    await new Promise(r => setTimeout(r, 1500));
    await route.continue();
  });
}"
```

Use Playwright's own delay instead — it's async-native and doesn't depend on a global timer:

```bash
# WORKS
playwright-cli run-code "async page => {
  await page.route('**/api/**', async route => {
    await page.waitForTimeout(1500);
    await route.continue();
  });
}"
```

If a route handler ever leaves requests hanging (page stuck loading, every subsequent
`eval`/`snapshot`/`click` times out), don't debug in place — `playwright-cli unroute`
often can't reach a session that's already wedged. Recover with:

```bash
playwright-cli close
playwright-cli open <url>   # re-open and re-authenticate if needed
```

For a one-off delayed-load screenshot (e.g. testing a loading skeleton/spinner) without
touching routes at all, race a reload against an immediate screenshot instead — simpler
and can't hang the session:

```bash
(playwright-cli reload > /tmp/reload.log 2>&1 &)
sleep 0.3
playwright-cli screenshot --filename=loading-state.png
```

## Locator strict-mode violation from duplicate responsive DOM

Many responsive layouts render **two copies** of the same control (a mobile variant and
a desktop variant, one hidden via CSS) with identical accessible names/placeholders. A
`getByRole`/`getByPlaceholder`-style locator or `el.parentElement` walk then resolves to
2+ elements and throws:

```
Error: locator.screenshot: Error: strict mode violation: locator(...) resolved to 2 elements:
    1) <div class="flex h-12 ...">  aka locator('.flex.h-12')
    2) <div class="flex h-10 ...">  aka locator('.flex.h-10').first()
```

Playwright's error message already lists disambiguating selectors/classes for each
match — use one of those (or `.first()`) instead of the generic role/placeholder locator:

```bash
playwright-cli run-code "async page => {
  const el = page.locator('.flex.h-10.w-64');  // pick the specific variant, not .first() blindly
  await el.screenshot({path: 'crop.png'});
}"
```
