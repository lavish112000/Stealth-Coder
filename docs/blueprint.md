# **App Name**: Stealth Coder

## Core Features:

- Overlay Window: Create a frameless, always-on-top window that can be precisely positioned via hotkeys to overlay a code editor.
- Global Hotkey Control: Implement global hotkeys (e.g., CmdOrCtrl+Arrow Keys) to move the window pixel by pixel for precise positioning over the target application.
- Screen Capture Prevention: Use platform-specific APIs to prevent screen capture of the application window. On Windows: Use SetWindowDisplayAffinity with WDA_EXCLUDEFROMCAPTURE. On macOS: Set NSWindowSharingNone.
- Code Editor Integration: Integrate a code editor (e.g., Monaco Editor) for problem descriptions and code input.
- AI Code Assistance: Use the Gemini API (through a tool) to provide code feedback and suggestions to the user.
- Discreet User Interface: Develop a discreet UI with problem description and AI chat interface.
- Toggle Visibility: Toggle application visibility with a global hotkey (e.g., CmdOrCtrl+B).

## Style Guidelines:

- Primary color: Dark Indigo (#4B0082) to convey a sense of seriousness and focus, aligning with the app's discreet nature.
- Background color: Very dark gray (#222222), almost black, for a low-profile, unobtrusive look that doesn't draw attention.
- Accent color: Subtle lavender (#B983FF) to highlight important elements like the chat input and code feedback, without being too visually distracting.
- Body and headline font: 'Inter', a grotesque-style sans-serif, known for its modern, machined look, providing a neutral, unobtrusive reading experience for the problem descriptions and AI feedback.
- Code font: 'Source Code Pro' for displaying code snippets clearly and legibly.
- The layout should be clean and minimal to reduce distraction during coding interviews.
- Subtle, unobtrusive animations for transitions and feedback, ensuring they don't interfere with the interview process.