const fs = require('fs');
const net = require('net');
const path = require('path');

const workingDbPath = path.join(__dirname, 'database.sqlite');
const baselineDbPath = path.join(__dirname, 'database.performance.baseline.sqlite');

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    const finishClosed = () => {
      socket.destroy();
      resolve(false);
    };
    socket.once('error', finishClosed);
    socket.once('timeout', finishClosed);
  });
}

async function reset() {
  if (await isPortOpen(3000)) {
    throw new Error('Backend is listening on port 3000. Stop server.js before resetting the database.');
  }
  if (!fs.existsSync(baselineDbPath)) {
    throw new Error('Baseline database is missing. Run `npm run seed:performance` first.');
  }

  fs.copyFileSync(baselineDbPath, workingDbPath);
  console.log('Performance database restored from the clean baseline.');
  console.log(`Source: ${baselineDbPath}`);
  console.log(`Target: ${workingDbPath}`);
}

reset().catch((error) => {
  console.error(`Performance reset failed: ${error.message}`);
  process.exitCode = 1;
});
