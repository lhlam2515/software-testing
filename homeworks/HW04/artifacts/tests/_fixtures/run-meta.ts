import { test as base } from '@playwright/test';

const STUDENT_ID = process.env.STUDENT_ID ?? '23127216';

export const test = base.extend({});

test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push(
    { type: 'Run by', description: STUDENT_ID },
    { type: 'Run at', description: new Date().toISOString() },
  );
});

export { expect } from '@playwright/test';
