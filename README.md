# 🎭 Stealth Coder - Undetectable AI Interview Assistant

> **Your discreet AI-powered coding companion for technical interviews**

Stealth Coder is a sophisticated desktop application that provides real-time AI assistance during coding interviews while remaining completely undetectable to screen sharing and recording software.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/lavish112000/Stealth-Coder.git
cd Stealth-Coder

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your GOOGLE_API_KEY to .env.local

# Run the application
npm run electron-dev
```

## 📋 Table of Contents

- [Features](#-features)
- [How It Works](#-how-it-works)
- [Technical Architecture](#-technical-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Development](#-development)
- [API Integration](#-api-integration)
- [Security Features](#-security-features)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality

- **Real-time AI Code Generation** - Get instant code solutions using Google Gemini AI
- **Multi-language Support** - JavaScript, Python, Java, C++, C#
- **Intelligent Code Analysis** - Line-by-line explanations and high-level breakdowns
- **Voice Input Support** - Speech-to-text functionality (framework ready)

### 🖥️ Desktop Experience

- **Floating Window Interface** - Always-on-top, non-intrusive design
- **Minimize/Maximize Controls** - Space-efficient workflow management
- **Drag-and-Drop Positioning** - Customizable window placement
- **Screen Capture Exclusion** - Invisible to recording software

### 🔒 Security & Privacy

- **Undetectable Operation** - Bypasses screen sharing detection
- **Local Processing** - No data sent to external servers (except AI API)
- **Secure API Integration** - Encrypted communication with Google AI
- **No Data Persistence** - Session-based operation only

## 🔍 How It Works

### Application Flow

1. **Launch** - Start the Electron desktop application
2. **Input Problem** - Describe your coding problem in natural language
3. **Select Language** - Choose your preferred programming language
4. **AI Processing** - Google Gemini analyzes and generates solution
5. **Review Results** - Get code solution with detailed explanations
6. **Minimize Interface** - Keep it ready for next questions

### AI Integration

- Uses Google Gemini 2.0 Flash model for code generation
- Processes natural language problem descriptions
- Generates syntactically correct, optimized code solutions
- Provides detailed explanations and line-by-line breakdowns

## 🏗️ Technical Architecture

### Frontend Layer

```
Next.js 15 + TypeScript + Tailwind CSS
├── Components (React Hook Form + Zod validation)
├── State Management (React useState/useEffect)
├── UI Framework (shadcn/ui + Radix UI)
└── Styling (Tailwind CSS + Custom themes)
```

### Desktop Layer

```
Electron + Node.js
├── Main Process (Window management, system integration)
├── Renderer Process (React application)
├── IPC Communication (Inter-process messaging)
└── Native Features (Screen capture exclusion, hotkeys)
```

### AI Integration Layer

```
Google AI (Gemini API)
├── Authentication (API key management)
├── Request Processing (Natural language understanding)
├── Code Generation (Multi-language support)
└── Response Formatting (Structured output)
```

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library
- **AI**: Google Gemini 2.0 Flash API
- **Desktop**: Electron for cross-platform compatibility
- **Build**: Turbopack for fast development

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Google AI API Key** (from Google AI Studio)
- **Git** for version control
- **Modern web browser** (for development)

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/lavish112000/Stealth-Coder.git
cd Stealth-Coder
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local and add your API key
GOOGLE_API_KEY=your_google_ai_api_key_here
```

### 4. Get Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

### 5. Run Application

```bash
# Development mode
npm run electron-dev

# Production build
npm run build
npm run electron
```

## ⚙️ Configuration

### Environment Variables

```bash
# .env.local
GOOGLE_API_KEY=your_api_key_here
```

### Build Configuration

- **Next.js**: `next.config.ts` - Server actions, experimental features
- **Electron**: `electron/main.js` - Window configuration, system integration
- **Tailwind**: `tailwind.config.ts` - Custom theme and styling

### Customization Options

- **Window Size**: Modify in `electron/main.js`
- **Theme Colors**: Update in `tailwind.config.ts`
- **AI Model**: Change in `src/ai/flows/generate-code-solution.ts`
- **UI Components**: Customize in `src/components/` directory

## 🎮 Usage

### Basic Workflow

1. **Launch Application**

   ```bash
   npm run electron-dev
   ```

2. **Minimize Interface**
   - Click the minus (-) button in the top-right of any section
   - Interface becomes compact and draggable

3. **Position Windows**
   - Drag minimized sections to desired locations
   - Both sections maintain equal size (448px width)

4. **Input Coding Problem**
   - Describe your problem in natural language
   - Example: "Write a function to reverse a string in JavaScript"

5. **Select Language**
   - Choose from: JavaScript, Python, Java, C++, C#

6. **Generate Solution**
   - Click "Generate Solution" button
   - AI processes your request and provides:
     - High-level explanation
     - Complete code solution
     - Line-by-line breakdown

### Advanced Features

- **Minimize Both Sections**: Save screen space during interviews
- **Drag Positioning**: Move windows to optimal locations
- **Voice Input**: Framework ready for speech-to-text (Web Speech API)
- **Multi-language**: Switch between programming languages instantly

## 💻 Development

### Project Structure

```
stealth-coder/
├── electron/                 # Desktop app configuration
│   └── main.js              # Electron main process
├── src/
│   ├── ai/                  # AI integration
│   │   └── flows/           # AI processing flows
│   ├── app/                 # Next.js app router
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   └── components/          # React components
│       ├── app/             # Application components
│       └── ui/              # Reusable UI components
├── public/                  # Static assets
├── .env.local              # Environment variables
└── next.config.ts          # Next.js configuration
```

### Development Scripts

```bash
# Development
npm run dev              # Start Next.js development server
npm run electron-dev     # Start Electron with hot reload
npm run genkit:watch     # Start AI development server

# Building
npm run build           # Build Next.js application
npm run electron        # Build and run Electron app

# Code Quality
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript type checking
```

### Key Files Explained

#### `electron/main.js`

```javascript
// Creates and manages the desktop window
// Handles screen capture exclusion
// Manages window positioning and sizing
```

#### `src/ai/flows/generate-code-solution.ts`

```typescript
// Defines the AI processing flow
// Handles Google Gemini API integration
// Processes user input and formats responses
```

#### `src/components/app/code-feedback-form.tsx`

```tsx
// Main input form component
// Handles user input validation
// Manages minimize/maximize state
// Implements drag functionality
```

#### `src/components/app/feedback-display.tsx`

```tsx
// Displays AI-generated solutions
// Shows code with syntax highlighting
// Provides expandable explanations
// Handles minimize/maximize state
```

## 🔗 API Integration

### Google Gemini AI

- **Model**: `gemini-2.0-flash`
- **Endpoint**: Google AI Generative Language API
- **Authentication**: API key-based
- **Rate Limits**: Follow Google AI Studio limits

### Request Flow

```
User Input → Validation → AI Processing → Response Formatting → UI Display
```

### Error Handling

- Network connectivity issues
- API rate limit exceeded
- Invalid API key
- Malformed responses

## 🔐 Security Features

### Undetectability

- **Window Transparency**: Invisible to screen capture
- **Process Hiding**: No visible system processes
- **Memory Management**: Minimal system footprint
- **Network Masking**: Encrypted AI communications

### Data Protection

- **No Data Storage**: Session-only operation
- **Encrypted Transmission**: HTTPS for all API calls
- **API Key Security**: Environment variable storage
- **Input Sanitization**: XSS protection

## 🔧 Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check Node.js version
node --version

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### API Key Issues

```bash
# Verify API key in .env.local
cat .env.local

# Test API key validity
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY"
```

#### Electron Issues

```bash
# Rebuild Electron dependencies
npm rebuild electron

# Check system libraries (Linux)
sudo apt-get install libnss3 libatk-bridge2.0-0 libdrm2 libxcomposite1
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# TypeScript issues
npm run typecheck
```

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* npm run electron-dev

# Check Electron logs
npm run electron-dev 2>&1 | tee debug.log
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add: feature description"`
5. Push and create pull request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Testing**: Unit tests for critical functions

### Commit Guidelines

```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: testing
chore: maintenance
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI Studio** - For providing the Gemini AI API
- **Next.js Team** - For the excellent React framework
- **Electron Community** - For desktop app capabilities
- **shadcn/ui** - For beautiful UI components

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/lavish112000/Stealth-Coder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lavish112000/Stealth-Coder/discussions)
- **Documentation**: [Wiki](https://github.com/lavish112000/Stealth-Coder/wiki)

---

**Built with ❤️ for developers, by developers**

*Stay stealthy, code confidently!* 🛡️💻
