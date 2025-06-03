const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const { fork } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    const fs = require('fs');
    if (fs.existsSync(indexPath)) {
      win.loadFile(indexPath);
    } else {
      const dirPath = path.join(__dirname, '../dist/my-app');
      fs.readdir(dirPath, (err) => {
        if (err) {
        }
        app.quit();
      });
    }
  }
}

app.whenReady().then(() => {
  const backendPath = path.join(__dirname, '../backend/server.js');
  const backend = fork(backendPath);

  createWindow();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      backend.kill();
      app.quit();
    }
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
