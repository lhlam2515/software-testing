import fs from 'node:fs';
import path from 'node:path';
import type { APIRequestContext, Page } from '@playwright/test';
import { expect } from './run-meta';
import { API_BASE_URL, authHeader, loginViaApi } from './api';
import {
  categoryExists,
  countProducts,
  deleteProductsByName,
  getProductByName,
} from './db';
import {
  cleanupCsvFixture,
  type CsvColumn,
  type CsvRow,
  writeCsvFixture,
} from './csv';
import { AdminImportPage } from './pom/admin-import.page';

const CREDENTIALS: Record<string, string> = {
  'admin@eshop.com': 'Admin123!',
  'test@eshop.com': 'Test1234!',
};
const RUN_TAG = `pw-${process.pid}`;
const DB_STABILITY_WINDOW_MS = Number(process.env.DB_STABILITY_WINDOW_MS ?? 1000);
const DB_STABILITY_POLL_MS = Number(process.env.DB_STABILITY_POLL_MS ?? 100);

export interface ImportRow extends CsvRow {
  nameFillChar?: string;
  nameLength?: number;
}

export interface ImportCase {
  id: string;
  hw02Ref: string;
  title: string;
  layer: 'ui' | 'api' | 'hybrid';
  type: 'positive' | 'negative' | 'edge';
  arrange: {
    loginAs?: string;
    assertCategoryMissing?: number;
  };
  act: {
    authMode?: 'none' | 'validNonAdmin';
    csvRows?: ImportRow[];
    rawBody?: Record<string, unknown>;
    fileName?: string;
    fileContentIsValidCsv?: boolean;
    csvColumns?: CsvColumn[];
    validCsvComparison?: boolean;
  };
  assert: {
    ui?: {
      previewCount?: number;
      resultTextIncludes?: string;
      errorsCount?: number;
      acceptCsvOnly?: boolean;
      fileRejectedBeforeUpload?: boolean;
      errorRows?: number[];
      errorRowsMention?: string;
      validResultTextIncludes?: string;
    };
    api?: {
      status?: number;
      inserted?: number;
      errorsCount?: number;
      errorMentions?: string;
      hasError?: boolean;
      hasFields?: string[];
      fieldTypes?: Record<string, 'string' | 'number' | 'array'>;
      errorRows?: number[];
      errorRowsMention?: string;
      requestContentType?: string;
      requestProductsCount?: number;
    };
    db?: {
      productExists?: string;
      productCountDelta?: number;
      productsNotCreated?: string[];
      productNameLength?: number;
      persistedRowsMatchInput?: boolean;
    };
  };
  note?: string;
  knownDefect: string | null;
}

export interface ArrangeState {
  productCountBefore: number;
  productNames: string[];
}

export interface PreparedUi {
  importPage: AdminImportPage;
  filePaths: string[];
  rows: CsvRow[];
}

export interface ImportCapture {
  status?: number;
  body?: Record<string, unknown>;
  requestContentType?: string;
  requestBody?: Record<string, unknown>;
}

export function loadCases(fixture: 'FR-16'): ImportCase[] {
  const casesPath = path.resolve(process.cwd(), `test-data/${fixture}/cases.json`);
  return JSON.parse(fs.readFileSync(casesPath, 'utf-8'));
}

export function materializeRows(rows: ImportRow[] = [], namespace?: string): CsvRow[] {
  return rows.map(({ nameFillChar, nameLength, ...row }) => ({
    ...row,
    ...(nameLength !== undefined
      ? { name: (nameFillChar ?? 'X').repeat(nameLength) }
      : row.name
        ? { name: `${row.name} [${namespace ?? 'case'}-${RUN_TAG}]` }
        : {}),
  }));
}

function productNamesFor(tc: ImportCase): string[] {
  const bodyProducts = Array.isArray(tc.act.rawBody?.products)
    ? (tc.act.rawBody.products as ImportRow[])
    : [];
  return [
    ...materializeRows(tc.act.csvRows, tc.id),
    ...materializeRows(bodyProducts, tc.id),
  ]
    .map((row) => row.name)
    .filter((name): name is string => Boolean(name));
}

export function applyArrange(tc: ImportCase): ArrangeState {
  if (
    tc.arrange.assertCategoryMissing !== undefined &&
    categoryExists(tc.arrange.assertCategoryMissing)
  ) {
    throw new Error(
      `${tc.id}: category ${tc.arrange.assertCategoryMissing} must not exist`,
    );
  }
  const categories = materializeRows(tc.act.csvRows, tc.id)
    .map((row) => Number(row.category_id))
    .filter((id) => Number.isInteger(id) && id !== tc.arrange.assertCategoryMissing);
  for (const id of new Set(categories)) {
    if (!categoryExists(id)) throw new Error(`${tc.id}: required category ${id} does not exist`);
  }
  const productNames = productNamesFor(tc);
  deleteProductsByName(productNames);
  return {
    productCountBefore: countProducts(),
    productNames,
  };
}

export async function prepareUi(page: Page, tc: ImportCase): Promise<PreparedUi> {
  const email = tc.arrange.loginAs ?? 'admin@eshop.com';
  const password = CREDENTIALS[email];
  if (!password) throw new Error(`${tc.id}: no fixture password for ${email}`);

  const importPage = new AdminImportPage(page);
  await importPage.gotoLogin();
  await importPage.login(email, password);
  await importPage.goToProducts();

  const rows = materializeRows(tc.act.csvRows, tc.id);
  const fileName = tc.act.fileName ?? `${tc.id}.csv`;
  const filePath = writeCsvFixture(fileName, rows, undefined, tc.act.csvColumns);
  await importPage.uploadCsv(filePath);
  return { importPage, filePaths: [filePath], rows };
}

/** Pattern #1 before submit: preview and client-side file constraints. */
export async function assertUiBeforeSubmit(
  prepared: PreparedUi,
  ui: ImportCase['assert']['ui'],
): Promise<void> {
  if (!ui) return;
  const { importPage } = prepared;
  const assertions: Array<Promise<void>> = [];

  if (ui.acceptCsvOnly) {
    assertions.push(
      expect
        .soft(importPage.fileInput)
        .toHaveAttribute('accept', /(?:^|,)\s*\.csv(?:,|$)/),
    );
  }
  if (ui.previewCount !== undefined) {
    assertions.push(
      expect
        .soft(importPage.previewSummary)
        .toContainText(`Xem trước (${ui.previewCount} dòng):`),
    );
  }
  if (ui.fileRejectedBeforeUpload) {
    assertions.push(
      expect.soft(importPage.importButton).toBeDisabled(),
      expect.soft(importPage.previewSummary).not.toBeVisible(),
    );
  }
  await Promise.all(assertions);
}

async function responseBody(response: { json(): Promise<unknown> }): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function tokenFor(request: APIRequestContext, tc: ImportCase): Promise<string | undefined> {
  if (tc.act.authMode === 'none') return undefined;
  const email = tc.arrange.loginAs ?? 'admin@eshop.com';
  const password = CREDENTIALS[email];
  if (!password) throw new Error(`${tc.id}: no fixture password for ${email}`);
  const login = await loginViaApi(request, email, password);
  expect(login.status, `${tc.id}: fixture login status`).toBe(200);
  if (!login.token) throw new Error(`${tc.id}: fixture login returned no token`);
  return login.token;
}

/** Act through the browser for hybrid cases or request fixture for API-only cases. */
export async function actImport(
  page: Page,
  request: APIRequestContext,
  tc: ImportCase,
  prepared?: PreparedUi,
): Promise<ImportCapture> {
  if (tc.layer === 'ui') return {};

  if (tc.layer === 'api') {
    const token = await tokenFor(request, tc);
    const rows = materializeRows(tc.act.csvRows, tc.id);
    const rawBody = tc.act.rawBody
      ? {
          ...tc.act.rawBody,
          ...(Array.isArray(tc.act.rawBody.products)
            ? {
                products: materializeRows(
                  tc.act.rawBody.products as ImportRow[],
                  tc.id,
                ),
              }
            : {}),
        }
      : undefined;
    const response = await request.post(IMPORT_ENDPOINT, {
      data: rawBody ?? { products: rows },
      ...(token ? { headers: authHeader(token) } : {}),
    });
    return { status: response.status(), body: await responseBody(response) };
  }

  if (!prepared) throw new Error(`${tc.id}: hybrid case requires prepared UI`);
  if (tc.act.validCsvComparison) {
    const validPath = writeCsvFixture(`${tc.id}-valid.csv`, prepared.rows);
    prepared.filePaths.push(validPath);
    await prepared.importPage.uploadCsv(validPath);
  }

  const responsePromise = page.waitForResponse(
    (response) => {
      const url = new URL(response.url());
      return url.pathname === '/api/admin/import-products' && response.request().method() === 'POST';
    },
  );
  await prepared.importPage.clickImport();
  const response = await responsePromise;
  const responseRequest = response.request();
  return {
    status: response.status(),
    body: await responseBody(response),
    requestContentType: responseRequest.headers()['content-type'],
    requestBody: responseRequest.postDataJSON() as Record<string, unknown>,
  };
}

/** Pattern #1 after submit: the rendered report and per-row reasons. */
export async function assertUiAfterSubmit(
  prepared: PreparedUi | undefined,
  ui: ImportCase['assert']['ui'],
): Promise<void> {
  if (!prepared || !ui) return;
  const assertions: Array<Promise<void>> = [];
  if (!ui.fileRejectedBeforeUpload && ui.resultTextIncludes !== undefined) {
    assertions.push(
      expect
        .soft(prepared.importPage.resultMessage)
        .toContainText(ui.resultTextIncludes),
    );
  }
  if (!ui.fileRejectedBeforeUpload && ui.errorsCount !== undefined) {
    assertions.push(
      expect.soft(prepared.importPage.resultErrors).toHaveCount(ui.errorsCount),
    );
  }
  for (const row of ui.fileRejectedBeforeUpload ? [] : ui.errorRows ?? []) {
    assertions.push(
      expect.soft(prepared.importPage.resultErrorForRow(row)).toHaveCount(1),
    );
    if (ui.errorRowsMention) {
      const aliases: Record<string, RegExp> = { price: /price|giá/i, name: /name|tên/i };
      assertions.push(
        expect.soft(prepared.importPage.resultErrorForRow(row)).toContainText(
          aliases[ui.errorRowsMention] ?? new RegExp(ui.errorRowsMention, 'i'),
        ),
      );
    }
  }
  if (ui.validResultTextIncludes) {
    assertions.push(
      expect
        .soft(prepared.importPage.resultMessage)
        .toContainText(ui.validResultTextIncludes),
    );
  }
  await Promise.all(assertions);
}

/** Pattern #2: status plus enough body shape/content to identify the outcome. */
export function assertApi(capture: ImportCapture, api: ImportCase['assert']['api']): void {
  if (!api) return;
  const body = capture.body ?? {};
  if (api.status !== undefined) expect.soft(capture.status).toBe(api.status);
  if (api.inserted !== undefined) expect.soft(body.inserted).toBe(api.inserted);
  if (api.errorsCount !== undefined) {
    expect.soft(Array.isArray(body.errors), 'response.errors must be an array').toBe(true);
    expect.soft(Array.isArray(body.errors) ? body.errors.length : undefined).toBe(api.errorsCount);
  }
  if (api.hasError !== undefined) {
    expect.soft(Object.hasOwn(body, 'error')).toBe(api.hasError);
  }
  if (api.hasFields) {
    for (const field of api.hasFields) expect.soft(Object.hasOwn(body, field)).toBe(true);
  }
  for (const [field, expectedType] of Object.entries(api.fieldTypes ?? {})) {
    const actualType = Array.isArray(body[field]) ? 'array' : typeof body[field];
    expect.soft(actualType, `typeof response.${field}`).toBe(expectedType);
  }
  if (api.errorMentions) {
    const aliases: Record<string, RegExp> = {
      name: /name|tên/i,
      price: /price|giá/i,
    };
    const errors = Array.isArray(body.errors) ? body.errors.join(' ') : String(body.error ?? '');
    expect.soft(errors).toMatch(aliases[api.errorMentions] ?? new RegExp(api.errorMentions, 'i'));
  }
  for (const row of api.errorRows ?? []) {
    const errors = Array.isArray(body.errors) ? body.errors.join(' ') : '';
    expect.soft(errors).toContain(`Hàng ${row}:`);
    if (api.errorRowsMention && Array.isArray(body.errors)) {
      const rowError = body.errors.find((error) => String(error).startsWith(`Hàng ${row}:`));
      const aliases: Record<string, RegExp> = { price: /price|giá/i, name: /name|tên/i };
      expect
        .soft(String(rowError ?? ''))
        .toMatch(
          aliases[api.errorRowsMention] ?? new RegExp(api.errorRowsMention, 'i'),
        );
    }
  }
  if (api.requestContentType) {
    expect.soft(capture.requestContentType).toContain(api.requestContentType);
  }
  if (api.requestProductsCount !== undefined) {
    const products = capture.requestBody?.products;
    expect.soft(Array.isArray(products) ? products.length : undefined).toBe(
      api.requestProductsCount,
    );
  }
}

function resolvedName(tc: ImportCase, baseName: string): string {
  const bodyRows = Array.isArray(tc.act.rawBody?.products)
    ? (tc.act.rawBody.products as ImportRow[])
    : [];
  const rows = [...(tc.act.csvRows ?? []), ...bodyRows];
  const index = rows.findIndex((row) => row.name === baseName);
  return index >= 0
    ? materializeRows([rows[index]], tc.id)[0].name ?? baseName
    : baseName;
}

async function expectStable(
  probe: () => number | boolean,
  expected: number | boolean,
  message: string,
): Promise<void> {
  const deadline = Date.now() + DB_STABILITY_WINDOW_MS;
  const observations: Array<number | boolean> = [];
  do {
    observations.push(probe());
    await new Promise<void>((resolve) => setTimeout(resolve, DB_STABILITY_POLL_MS));
  } while (Date.now() < deadline);
  expect.soft(
    observations.every((value) => Object.is(value, expected)),
    `${message}; observed ${JSON.stringify(observations)}`,
  ).toBe(true);
}

/** Pattern #3: persisted products and atomic count changes, retried against SQLite. */
export async function assertDb(
  tc: ImportCase,
  state: ArrangeState,
): Promise<void> {
  const db = tc.assert.db;
  if (!db) return;

  if (db.productExists) {
    const expectedName = resolvedName(tc, db.productExists);
    await expect
      .soft
      .poll(() => Boolean(getProductByName(expectedName)), {
        message: `product exists: ${expectedName}`,
      })
      .toBe(true);
  }
  if (db.productCountDelta !== undefined) {
    if (db.productCountDelta === 0) {
      await expectStable(
        () => countProducts() - state.productCountBefore,
        0,
        `${tc.id}: products count remains unchanged`,
      );
    } else {
      await expect
        .soft
        .poll(() => countProducts() - state.productCountBefore, {
          message: `${tc.id}: products count delta`,
        })
        .toBe(db.productCountDelta);
    }
  }
  for (const name of db.productsNotCreated ?? []) {
    const expectedName = resolvedName(tc, name);
    expect.soft(Boolean(getProductByName(expectedName)), `product not created: ${expectedName}`).toBe(false);
  }
  if (db.productNameLength !== undefined) {
    const expectedName = materializeRows(tc.act.csvRows, tc.id).find(
      (row) => row.name?.length === db.productNameLength,
    )?.name;
    if (!expectedName) {
      throw new Error(`${tc.id}: no generated row has name length ${db.productNameLength}`);
    }
    await expect
      .soft
      .poll(() => {
        const product = getProductByName(expectedName) as { name?: string } | undefined;
        return product?.name?.length;
      }, { message: `${tc.id}: persisted product name length` })
      .toBe(db.productNameLength);
  }
  if (db.persistedRowsMatchInput) {
    for (const row of materializeRows(tc.act.csvRows, tc.id)) {
      if (!row.name) continue;
      await expect
        .soft
        .poll(() => getProductByName(row.name!) as Record<string, unknown> | undefined, {
          message: `${tc.id}: persisted row ${row.name}`,
        })
        .toMatchObject({
          name: row.name,
          price: Number(row.price),
          description: row.description ?? '',
          imageUrl: row.imageUrl ?? '',
          category_id: Number(row.category_id ?? 1),
        });
    }
  }
}

export function cleanupCase(state: ArrangeState, prepared?: PreparedUi): void {
  for (const filePath of prepared?.filePaths ?? []) cleanupCsvFixture(filePath);
  deleteProductsByName(state.productNames);
}

export const IMPORT_ENDPOINT = `${API_BASE_URL}/api/admin/import-products`;
