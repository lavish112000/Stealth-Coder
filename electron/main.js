const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;
let isVisible = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: true,
    skipTaskbar: true, // Hide from taskbar
    show: false, // Start hidden
  });

  // Try to exclude from screen capture
  if (process.platform === 'darwin') {
    mainWindow.setContentProtection(true);
  } else if (process.platform === 'win32') {
    // For Windows, use native API if possible
    try {
      const { execSync } = require('child_process');
      execSync(`powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool SetWindowDisplayAffinity(IntPtr hWnd, uint dwAffinity); }'; [Win32]::SetWindowDisplayAffinity((New-Object -ComObject WScript.Shell).AppActivate((Get-Process electron).MainWindowHandle), 17)"`);
    } catch (e) {
      console.log('Could not set display affinity');
    }
  }

  // Load the Next.js app
  mainWindow.loadURL('http://localhost:9002');

  // Register global shortcut to toggle visibility
  globalShortcut.register('CommandOrControl+B', () => {
    if (isVisible) {
      mainWindow.hide();
      isVisible = false;
    } else {
      mainWindow.show();
      mainWindow.focus();
      isVisible = true;
    }
  });

  // Register quit shortcut
  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit();
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Make window movable with arrow keys
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      const { x, y } = mainWindow.getPosition();
      switch (input.key) {
        case 'ArrowUp':
          mainWindow.setPosition(x, y - 10);
          event.preventDefault();
          break;
        case 'ArrowDown':
          mainWindow.setPosition(x, y + 10);
          event.preventDefault();
          break;
        case 'ArrowLeft':
          mainWindow.setPosition(x - 10, y);
          event.preventDefault();
          break;
        case 'ArrowRight':
          mainWindow.setPosition(x + 10, y);
          event.preventDefault();
          break;
      }
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
