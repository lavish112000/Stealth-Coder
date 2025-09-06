/**
 * Electron Main Process - Stealth Coder Desktop Application
 *
 * This file manages the desktop application lifecycle, window creation,
 * and system integration features that enable the undetectable floating
 * interface for the Stealth Coder AI assistant.
 */

import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { spawn, execSync } from 'child_process';

// Global variables for window management
let mainWindow;        // Reference to the main application window
let isVisible = true;  // Tracks current visibility state of the window
let nextServer;        // Reference to the Next.js server process

/**
 * Starts the Next.js server as a child process
 * @returns {Promise<void>} Promise that resolves when server is ready
 */
function startNextServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Next.js server...');

    // Get the path to the Next.js executable
    const nextBin = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', '.bin', 'next');
    const appDir = path.join(process.resourcesPath, 'app.asar.unpacked');

    // Start Next.js in production mode
    nextServer = spawn(nextBin, ['start', '-p', '9002'], {
      cwd: appDir,
      stdio: 'pipe',
      shell: true
    });

    // Handle server output
    nextServer.stdout.on('data', (data) => {
      console.log(`Next.js: ${data}`);
      // Check if server is ready
      if (data.toString().includes('Ready')) {
        console.log('Next.js server is ready!');
        resolve();
      }
    });

    nextServer.stderr.on('data', (data) => {
      console.error(`Next.js Error: ${data}`);
    });

    nextServer.on('close', (code) => {
      console.log(`Next.js server exited with code ${code}`);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('Next.js server startup timeout'));
    }, 30000);
  });
}
async function createWindow() {
  try {
    // Start Next.js server first
    await startNextServer();

    // Create the main BrowserWindow with stealth configuration
    mainWindow = new BrowserWindow({
    width: 1000,           // Initial window width
    height: 600,           // Initial window height
    webPreferences: {
      nodeIntegration: false,    // Security: Disable Node.js integration in renderer
      contextIsolation: true,    // Security: Enable context isolation
    },
    alwaysOnTop: true,     // Window stays above all other windows
    frame: false,          // Remove window frame (no title bar, borders)
    transparent: true,     // Make window background transparent
    resizable: true,       // Allow window resizing
    skipTaskbar: true,     // Hide from taskbar to reduce visibility
    show: false,           // Start hidden for stealth initialization
  });

  /**
   * Screen Capture Exclusion - Platform-specific implementations
   * Attempts to make the window invisible to screen recording software
   */
  if (process.platform === 'darwin') {
    // macOS: Use built-in content protection
    mainWindow.setContentProtection(true);
  } else if (process.platform === 'win32') {
    // Windows: Use PowerShell to set display affinity
    // This makes the window invisible to screen capture tools
    try {
      execSync(`powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool SetWindowDisplayAffinity(IntPtr hWnd, uint dwAffinity); }'; [Win32]::SetWindowDisplayAffinity((New-Object -ComObject WScript.Shell).AppActivate((Get-Process electron).MainWindowHandle), 17)"`);
    } catch {
      console.log('Could not set display affinity');
    }
  }

  // Load the Next.js application into the Electron window
  mainWindow.loadURL('http://localhost:9002');

  /**
   * Global Shortcuts Registration
   * Keyboard shortcuts for window visibility control
   */

  // Toggle window visibility with Ctrl/Cmd + B
  globalShortcut.register('CommandOrControl+B', () => {
    if (isVisible) {
      mainWindow.hide();     // Hide window
      isVisible = false;
    } else {
      mainWindow.show();     // Show window
      mainWindow.focus();    // Bring to front
      isVisible = true;
    }
  });

  // Quit application with Ctrl/Cmd + Q
  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit();
  });

  /**
   * Window Event Handlers
   */

  // Clean up when window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    // Kill Next.js server when window is closed
    if (nextServer) {
      nextServer.kill();
    }
  });

  /**
   * Keyboard Navigation for Window Movement
   * Allows moving the window with arrow keys when it has focus
   */
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      const { x, y } = mainWindow.getPosition();  // Get current position

      // Move window based on arrow key input
      switch (input.key) {
        case 'ArrowUp':
          mainWindow.setPosition(x, y - 10);  // Move up by 10 pixels
          event.preventDefault();
          break;
        case 'ArrowDown':
          mainWindow.setPosition(x, y + 10);  // Move down by 10 pixels
          event.preventDefault();
          break;
        case 'ArrowLeft':
          mainWindow.setPosition(x - 10, y);  // Move left by 10 pixels
          event.preventDefault();
          break;
        case 'ArrowRight':
          mainWindow.setPosition(x + 10, y);  // Move right by 10 pixels
          event.preventDefault();
          break;
      }
    }
  });
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
}

/**
 * Application Lifecycle Management
 */

// Create window when Electron app is ready
app.whenReady().then(() => {
  createWindow().catch((error) => {
    console.error('Failed to create window:', error);
    app.quit();
  });
});

// Handle window close events (platform-specific behavior)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();  // Quit on Windows/Linux when all windows closed
  }
});

// Recreate window when dock icon clicked (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch((error) => {
      console.error('Failed to recreate window:', error);
    });
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
