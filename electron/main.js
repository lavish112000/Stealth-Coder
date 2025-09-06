/**
 * Electron Main Process - Stealth Coder Desktop Application
 *
 * This file manages the desktop application lifecycle, window creation,
 * and system integration features that enable the undetectable floating
 * interface for the Stealth Coder AI assistant.
 */

const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

// Global variables for window management
let mainWindow;        // Reference to the main application window
let isVisible = true;  // Tracks current visibility state of the window

/**
 * Creates the main application window with stealth properties
 * Configures the window to be floating, transparent, and undetectable
 */
function createWindow() {
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
      const { execSync } = require('child_process');
      execSync(`powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool SetWindowDisplayAffinity(IntPtr hWnd, uint dwAffinity); }'; [Win32]::SetWindowDisplayAffinity((New-Object -ComObject WScript.Shell).AppActivate((Get-Process electron).MainWindowHandle), 17)"`);
    } catch (e) {
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
}

/**
 * Application Lifecycle Management
 */

// Create window when Electron app is ready
app.whenReady().then(createWindow);

// Handle window close events (platform-specific behavior)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();  // Quit on Windows/Linux when all windows closed
  }
});

// Recreate window when dock icon clicked (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
