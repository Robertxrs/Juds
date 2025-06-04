const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const logPath = path.join(app.getPath('userData'), 'logs');
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath, { recursive: true });
}

const logFilePath = path.join(logPath, 'main.log');

const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

console.log = (...args) => {
  const message = args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg) : arg
  ).join(' ');

  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${message}\n`);
  process.stdout.write(`[${timestamp}] ${message}\n`);
};

console.error = (...args) => {
  const message = args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg) : arg
  ).join(' ');

  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] [ERROR] ${message}\n`);
  process.stderr.write(`[${timestamp}] [ERROR] ${message}\n`);
};

module.exports = { logFilePath };
