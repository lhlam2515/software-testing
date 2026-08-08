# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: FR-16/csv-import.spec.ts >> FR-16 — CSV Product Import (EP + BVA) >> TC-15 — Gap Probe: category_id does not exist in DB (dangling FK)
- Location: tests/FR-16/csv-import.spec.ts:18:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByText(/Import hoàn tất/)
Expected substring: "0/1"
Received string:    "✅ Import hoàn tất: 1/1 sản phẩm được thêm"
Timeout: 5000ms

Call log:
  - Expect "soft toContainText" with timeout 5000ms
  - waiting for getByText(/Import hoàn tất/)
    14 × locator resolved to <p>✅ Import hoàn tất: 1/1 sản phẩm được thêm</p>
       - unexpected value "✅ Import hoàn tất: 1/1 sản phẩm được thêm"

```

```yaml
- paragraph: "✅ Import hoàn tất: 1/1 sản phẩm được thêm"
```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('listitem').filter({ hasText: /^Hàng \d+:/ })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "soft toHaveCount" with timeout 5000ms
  - waiting for getByRole('listitem').filter({ hasText: /^Hàng \d+:/ })
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

```
Error: TC-15: products count remains unchanged; observed [1,1,1,1,1,1,1,1,1,1]

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

```
Error: product not created: Test invalid category [TC-15-pw-193761]

expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Test source

```ts
  338 |   }
  339 |   for (const [field, expectedType] of Object.entries(api.fieldTypes ?? {})) {
  340 |     const actualType = Array.isArray(body[field]) ? 'array' : typeof body[field];
  341 |     expect.soft(actualType, `typeof response.${field}`).toBe(expectedType);
  342 |   }
  343 |   if (api.errorMentions) {
  344 |     const aliases: Record<string, RegExp> = {
  345 |       name: /name|tên/i,
  346 |       price: /price|giá/i,
  347 |     };
  348 |     const errors = Array.isArray(body.errors) ? body.errors.join(' ') : String(body.error ?? '');
  349 |     expect.soft(errors).toMatch(aliases[api.errorMentions] ?? new RegExp(api.errorMentions, 'i'));
  350 |   }
  351 |   for (const row of api.errorRows ?? []) {
  352 |     const errors = Array.isArray(body.errors) ? body.errors.join(' ') : '';
  353 |     expect.soft(errors).toContain(`Hàng ${row}:`);
  354 |     if (api.errorRowsMention && Array.isArray(body.errors)) {
  355 |       const rowError = body.errors.find((error) => String(error).startsWith(`Hàng ${row}:`));
  356 |       const aliases: Record<string, RegExp> = { price: /price|giá/i, name: /name|tên/i };
  357 |       expect
  358 |         .soft(String(rowError ?? ''))
  359 |         .toMatch(
  360 |           aliases[api.errorRowsMention] ?? new RegExp(api.errorRowsMention, 'i'),
  361 |         );
  362 |     }
  363 |   }
  364 |   if (api.requestContentType) {
  365 |     expect.soft(capture.requestContentType).toContain(api.requestContentType);
  366 |   }
  367 |   if (api.requestProductsCount !== undefined) {
  368 |     const products = capture.requestBody?.products;
  369 |     expect.soft(Array.isArray(products) ? products.length : undefined).toBe(
  370 |       api.requestProductsCount,
  371 |     );
  372 |   }
  373 | }
  374 | 
  375 | function resolvedName(tc: ImportCase, baseName: string): string {
  376 |   const bodyRows = Array.isArray(tc.act.rawBody?.products)
  377 |     ? (tc.act.rawBody.products as ImportRow[])
  378 |     : [];
  379 |   const rows = [...(tc.act.csvRows ?? []), ...bodyRows];
  380 |   const index = rows.findIndex((row) => row.name === baseName);
  381 |   return index >= 0
  382 |     ? materializeRows([rows[index]], tc.id)[0].name ?? baseName
  383 |     : baseName;
  384 | }
  385 | 
  386 | async function expectStable(
  387 |   probe: () => number | boolean,
  388 |   expected: number | boolean,
  389 |   message: string,
  390 | ): Promise<void> {
  391 |   const deadline = Date.now() + DB_STABILITY_WINDOW_MS;
  392 |   const observations: Array<number | boolean> = [];
  393 |   do {
  394 |     observations.push(probe());
  395 |     await new Promise<void>((resolve) => setTimeout(resolve, DB_STABILITY_POLL_MS));
  396 |   } while (Date.now() < deadline);
  397 |   expect.soft(
  398 |     observations.every((value) => Object.is(value, expected)),
  399 |     `${message}; observed ${JSON.stringify(observations)}`,
  400 |   ).toBe(true);
  401 | }
  402 | 
  403 | /** Pattern #3: persisted products and atomic count changes, retried against SQLite. */
  404 | export async function assertDb(
  405 |   tc: ImportCase,
  406 |   state: ArrangeState,
  407 | ): Promise<void> {
  408 |   const db = tc.assert.db;
  409 |   if (!db) return;
  410 | 
  411 |   if (db.productExists) {
  412 |     const expectedName = resolvedName(tc, db.productExists);
  413 |     await expect
  414 |       .soft
  415 |       .poll(() => Boolean(getProductByName(expectedName)), {
  416 |         message: `product exists: ${expectedName}`,
  417 |       })
  418 |       .toBe(true);
  419 |   }
  420 |   if (db.productCountDelta !== undefined) {
  421 |     if (db.productCountDelta === 0) {
  422 |       await expectStable(
  423 |         () => countProducts() - state.productCountBefore,
  424 |         0,
  425 |         `${tc.id}: products count remains unchanged`,
  426 |       );
  427 |     } else {
  428 |       await expect
  429 |         .soft
  430 |         .poll(() => countProducts() - state.productCountBefore, {
  431 |           message: `${tc.id}: products count delta`,
  432 |         })
  433 |         .toBe(db.productCountDelta);
  434 |     }
  435 |   }
  436 |   for (const name of db.productsNotCreated ?? []) {
  437 |     const expectedName = resolvedName(tc, name);
> 438 |     expect.soft(Boolean(getProductByName(expectedName)), `product not created: ${expectedName}`).toBe(false);
      |                                                                                                  ^ Error: product not created: Test invalid category [TC-15-pw-193761]
  439 |   }
  440 |   if (db.productNameLength !== undefined) {
  441 |     const expectedName = materializeRows(tc.act.csvRows, tc.id).find(
  442 |       (row) => row.name?.length === db.productNameLength,
  443 |     )?.name;
  444 |     if (!expectedName) {
  445 |       throw new Error(`${tc.id}: no generated row has name length ${db.productNameLength}`);
  446 |     }
  447 |     await expect
  448 |       .soft
  449 |       .poll(() => {
  450 |         const product = getProductByName(expectedName) as { name?: string } | undefined;
  451 |         return product?.name?.length;
  452 |       }, { message: `${tc.id}: persisted product name length` })
  453 |       .toBe(db.productNameLength);
  454 |   }
  455 |   if (db.persistedRowsMatchInput) {
  456 |     for (const row of materializeRows(tc.act.csvRows, tc.id)) {
  457 |       if (!row.name) continue;
  458 |       await expect
  459 |         .soft
  460 |         .poll(() => getProductByName(row.name!) as Record<string, unknown> | undefined, {
  461 |           message: `${tc.id}: persisted row ${row.name}`,
  462 |         })
  463 |         .toMatchObject({
  464 |           name: row.name,
  465 |           price: Number(row.price),
  466 |           description: row.description ?? '',
  467 |           imageUrl: row.imageUrl ?? '',
  468 |           category_id: Number(row.category_id ?? 1),
  469 |         });
  470 |     }
  471 |   }
  472 | }
  473 | 
  474 | export function cleanupCase(state: ArrangeState, prepared?: PreparedUi): void {
  475 |   for (const filePath of prepared?.filePaths ?? []) cleanupCsvFixture(filePath);
  476 |   deleteProductsByName(state.productNames);
  477 | }
  478 | 
  479 | export const IMPORT_ENDPOINT = `${API_BASE_URL}/api/admin/import-products`;
  480 | 
```