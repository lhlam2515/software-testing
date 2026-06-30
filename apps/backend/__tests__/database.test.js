describe('database module reload stability', () => {
  it('reuses the same database singleton across module reloads', async () => {
    const firstDb = require('../database');
    await firstDb.ready;

    jest.resetModules();

    const secondDb = require('../database');
    await secondDb.ready;

    expect(secondDb).toBe(firstDb);
  });
});
