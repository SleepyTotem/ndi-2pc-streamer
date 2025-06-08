const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const { exec, execSync } = require('child_process');
const fs = require('fs');

const exeName = 'Application.Network.ScanConverter2.x64.exe';

function isRunning() {
  try {
    const output = execSync(`wmic process get name`, { encoding: 'utf8' });
    return output.toLowerCase().includes(exeName.toLowerCase());
  } catch {
    return false;
  }
}

function startStream() {
  const exeName = 'Application.Network.ScanConverter2.x64.exe';
  let exePath = path.join(process.cwd(), exeName);

  if (!fs.existsSync(exePath)) {
  // Try inside resources subfolder
    const fallbackPath = path.join(process.cwd(), 'resources', exeName);
    if (fs.existsSync(fallbackPath)) {
        exePath = fallbackPath;
    } else {
        return {
        success: false,
        message: `${exeName} is missing.\nChecked:\n- ${exePath}\n- ${fallbackPath}`,
        status: false
        };
    }
  }

  try {
    exec(`start "" "${exePath}"`);

    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 10;

      const interval = setInterval(() => {
        if (isRunning()) {
          clearInterval(interval);
          resolve({ success: true, message: 'Stream started successfully.', status: true });
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          resolve({ success: false, message: 'Process failed to start.', status: false });
        }
        attempts++;
      }, 200);
    });
  } catch (error) {
    return { success: false, message: `Launch error: ${error.message}`, status: false };
  }
}

function stopStream() {
  try {
    execSync(`taskkill /f /im "${exeName}"`);
    return { success: true, message: 'Stream stopped.', status: false };
  } catch (error) {
    return { success: false, message: `Failed to stop stream: ${error.message}`, status: true };
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 300,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    darkTheme: true,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.setMenu(null);
  win.loadFile('renderer.html');
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  ipcMain.handle('get-status', () => isRunning());

  ipcMain.handle('toggle-process', async () => {
    if (isRunning()) {
      return stopStream();
    } else {
      return await startStream();
    }
  });

  ipcMain.on('window-control', (event, action) => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;
    if (action === 'minimize') win.minimize();
    if (action === 'close') win.close();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});