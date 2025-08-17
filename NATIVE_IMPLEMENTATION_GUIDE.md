# Stealth Coder: Native Desktop Implementation Guide

This document provides a step-by-step guide for implementing the native desktop features required to turn the "Stealth Coder" web prototype into a fully functional and discreet desktop application. The core challenge is to create an application that can overlay other windows, remain invisible to screen sharing, and be controlled by global hotkeys without stealing focus from the primary application (e.g., a web browser during a coding interview).

We'll use a framework like **Tauri** or **Electron** to package the existing Next.js web application into a native desktop shell. These frameworks provide the necessary APIs to interact with the underlying operating system. Tauri is recommended for its performance and smaller bundle size.

---

## 1. Creating a Native Desktop Application

The first step is to wrap the web application in a native shell.

**Requirement:** The application must run as a standalone desktop app, not in a browser tab.

**Implementation Steps (using Tauri):**
1.  **Integrate Tauri into the Next.js project:** Follow the official Tauri documentation to add Tauri to your existing Next.js application. This will create a `src-tauri` directory in your project for the native Rust code.
2.  **Configure `tauri.conf.json`:**
    *   Set `"identifier"` and other application metadata.
    *   In the `tauri.windows` section, configure the main window to be frameless and always on top.
    ```json
    "windows": [
      {
        "label": "main",
        "title": "Stealth Coder",
        "width": 800,
        "height": 600,
        "decorations": false, // Creates a frameless window
        "transparent": true,
        "alwaysOnTop": true
      }
    ]
    ```

---

## 2. Invisibility to Screen Sharing & Recording

This is a critical feature to ensure discretion.

**Requirement:** The application window must not be visible in screen captures, screen recordings, or during screen sharing sessions (e.g., Zoom, Google Meet).

**Implementation Steps:**

This requires using platform-specific APIs. You will call these from the Rust code in your Tauri application.

*   **On macOS:**
    You need to set the `sharingType` property of the `NSWindow` to `NSWindowSharingNone`.
    
    **`src-tauri/src/main.rs` (example):**
    ```rust
    use tauri::{Manager, AppHandle, RunEvent};
    use objc::{msg_send, sel, sel_impl};
    use cocoa::appkit::{NSWindow, NSWindowSharingType};
    use cocoa::base::id;

    fn set_window_sharing_type(window: &tauri::Window) {
        let ns_window = window.ns_window().unwrap() as id;
        unsafe {
            let _: () = msg_send![ns_window, setSharingType:NSWindowSharingType::NSWindowSharingNone];
        }
    }

    fn main() {
        tauri::Builder::default()
            .setup(|app| {
                let main_window = app.get_window("main").unwrap();
                set_window_sharing_type(&main_window);
                Ok(())
            })
            // ... other setup
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    }
    ```

*   **On Windows:**
    You need to use the `SetWindowDisplayAffinity` function with the `WDA_EXCLUDEFROMCAPTURE` flag.

    **`src-tauri/src/main.rs` (example):**
    ```rust
    use tauri::{Manager, Window};
    use windows::Win32::UI::WindowsAndMessaging::{SetWindowDisplayAffinity, WDA_EXCLUDEFROMCAPTURE};
    use windows::Win32::Foundation::HWND;

    fn set_window_display_affinity(window: &Window) {
        let hwnd = HWND(window.hwnd().unwrap() as isize);
        unsafe {
            let _ = SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE);
        }
    }
    
    fn main() {
        tauri::Builder::default()
            .setup(|app| {
                let main_window = app.get_window("main").unwrap();
                set_window_display_affinity(&main_window);
                Ok(())
            })
            // ... other setup
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    }
    ```

---

## 3. Registering Global Hotkeys

Global hotkeys allow the user to control the application even when it is not in focus.

**Requirements:**
-   A global hotkey (e.g., `CmdOrCtrl+B`) to toggle the visibility of the application window.
-   Global hotkeys (e.g., `CmdOrCtrl+Arrow Keys`) to move the window pixel by pixel.

**Implementation Steps (using Tauri):**

Use the `global_shortcut` module in Tauri.

**`src-tauri/src/main.rs` (example):**
```rust
use tauri::{GlobalShortcutManager, Manager, PhysicalPosition};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let mut shortcut_manager = handle.global_shortcut_manager();
            
            // Toggle visibility hotkey
            shortcut_manager.register("CmdOrCtrl+B", move || {
                let window = handle.get_window("main").unwrap();
                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    window.show().unwrap();
                }
            }).unwrap();

            // Window positioning hotkeys
            let window_handle = handle.get_window("main").unwrap();
            shortcut_manager.register("CmdOrCtrl+Up", move || {
                let mut pos = window_handle.outer_position().unwrap();
                pos.y -= 1;
                window_handle.set_position(pos).unwrap();
            }).unwrap();
            
            // ... register Down, Left, Right arrow keys similarly

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 4. Controlling Window Focus

A key aspect of being discreet is not stealing focus from the browser.

**Requirement:** When the Stealth Coder window is shown, it must not take keyboard focus away from the currently active application (e.g., the browser with the coding test).

**Implementation Steps:**

This is a more advanced OS-level task. The goal is to make the window "unfocusable" or to immediately return focus to the previous application after showing the window.

*   **On macOS:** You can make a window un-focusable by setting its style mask.
    ```rust
    // In the macOS setup code
    // This makes the window not accept first responder status.
    // More complex focus management might be needed.
    ```
*   **On Windows:** You can use the `WS_EX_NOACTIVATE` extended window style.

This functionality often requires deeper integration with the OS and can be complex. A simpler approach that works well is to ensure the user interacts primarily via hotkeys, which don't require the app to be focused. The "Always on Top" setting helps keep it visible without needing focus.

By following this guide, you can build the native shell around the web UI to create the full "Stealth Coder" application as envisioned.
