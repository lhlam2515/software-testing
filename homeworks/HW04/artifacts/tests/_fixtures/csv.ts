import fs from 'node:fs';
import path from 'node:path';

export const CSV_COLUMNS = ['name', 'price', 'description', 'imageUrl', 'category_id'] as const;
export type CsvColumn = (typeof CSV_COLUMNS)[number];

export interface CsvRow {
  name?: string;
  price?: string | number;
  description?: string;
  imageUrl?: string;
  category_id?: string | number;
}

const GENERATED_DIR = path.resolve(process.cwd(), 'test-data/FR-16/fixtures/generated');

function ensureDir(): void {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

/**
 * Writes `rows` as a CSV file matching the admin import's naive
 * `split(',')` parser (no quoting/escaping) and returns the file path.
 * Pass `rawContent` to bypass row serialization entirely (malformed-file cases).
 */
export function writeCsvFixture(
  fileName: string,
  rows?: CsvRow[],
  rawContent?: string,
  columns: readonly CsvColumn[] = CSV_COLUMNS,
): string {
  ensureDir();
  const filePath = path.join(GENERATED_DIR, fileName);
  const content =
    rawContent ??
    [columns.join(','), ...(rows ?? []).map((r) => columns.map((c) => r[c] ?? '').join(','))].join(
      '\n',
    );
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

export function cleanupCsvFixture(filePath: string): void {
  fs.rmSync(filePath, { force: true });
}
