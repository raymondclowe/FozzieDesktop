# FozzieDesktop

A FOSS Desktop app for chatting with AI with Model Context Protocol (MCP) server integration.

![FozzieDesktop](https://img.shields.io/badge/License-MIT-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Electron](https://img.shields.io/badge/Electron-Powered-blue.svg)

## 🚀 Features

- **Multi-Platform Desktop App**: Built with Electron for Windows, macOS, and Linux
- **AI Chat Interface**: Seamless conversations with multiple AI providers
- **MCP Server Integration**: Native support for Model Context Protocol servers
- **Chat History Management**: Save, search, and organize your conversations
- **Fozzie Bear Mode**: Unique joke mode for fun AI conversations
- **Provider Agnostic**: Support for OpenAI, Anthropic, local models, and custom endpoints
- **Privacy Focused**: All data stored locally, no required cloud accounts
- **Open Source**: MIT licensed with community contributions welcome

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **Desktop Framework**: Electron 37
- **Build System**: Webpack 5
- **Styling**: CSS Variables with Dark/Light theme support
- **Security**: Context isolation, no node integration in renderer

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/raymondclowe/FozzieDesktop.git
   cd FozzieDesktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the application**
   ```bash
   npm run build-dev
   ```

4. **Run in development mode**
   ```bash
   npm run electron-dev
   ```

### Available Scripts

- `npm run build` - Build for production
- `npm run build-dev` - Build for development
- `npm run dev` - Start webpack dev server (renderer only)
- `npm run electron` - Run Electron app
- `npm run electron-dev` - Build and run in development mode
- `npm start` - Build and run production version

## 🎯 Getting Started

1. **Launch FozzieDesktop** and you'll see the welcome screen
2. **Open Settings** (⚙️ button or Cmd/Ctrl+,) to configure your AI provider
3. **Add your API key** and select your preferred model
4. **Create a new chat** and start conversing with AI
5. **Try Fozzie Mode** for AI responses with Muppet-style humor!

### AI Provider Configuration

FozzieDesktop supports multiple AI providers:

- **OpenAI**: Add your OpenAI API key
- **OpenRouter**: Use OpenRouter for access to multiple models
- **Custom Endpoints**: Any OpenAI-compatible API
- **Local Models**: Ollama, LocalAI, etc.

### MCP Server Configuration

Configure Model Context Protocol servers for extended functionality:

1. Go to Settings → MCP Servers
2. Add server configurations with command, args, and environment
3. Import/export configurations in `claude_desktop_config.json` format
4. Examples included for common MCP server setups

## 🐻 Fozzie Bear Mode

Enable Fozzie Mode for AI responses peppered with Muppet-style jokes and "Wocka wocka!" catchphrases. Perfect for making your AI conversations more entertaining!

## 📁 Project Structure

```
FozzieDesktop/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # Main process entry point
│   │   └── preload.ts  # Preload script for secure IPC
│   ├── renderer/       # React frontend
│   │   ├── components/ # React components
│   │   ├── App.tsx     # Main App component
│   │   ├── index.tsx   # Renderer entry point
│   │   └── styles.css  # Global styles
│   └── types/          # TypeScript declarations
├── dist/               # Build output (generated)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── webpack.config.js   # Build configuration
└── README.md          # This file
```

## 🔧 Configuration

### Settings Location

Settings are stored locally in the application's data directory:

- **Windows**: `%APPDATA%/FozzieDesktop/`
- **macOS**: `~/Library/Application Support/FozzieDesktop/`
- **Linux**: `~/.config/FozzieDesktop/`

### MCP Server Configuration

MCP servers are configured in the same format as Claude Desktop:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["/path/to/filesystem-server/index.js"]
    },
    "git": {
      "command": "python",
      "args": ["-m", "git_mcp_server"],
      "env": {
        "GIT_REPO_PATH": "/path/to/repo"
      }
    }
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] **Real AI Provider Integration**: Complete OpenAI/Anthropic API integration
- [ ] **MCP Runtime**: Full MCP server execution and communication
- [ ] **Packaging**: Distributable installers for all platforms
- [ ] **Plugin System**: Extensible architecture for community plugins
- [ ] **Remote Desktop Mode**: Web interface for mobile access
- [ ] **Background Agents**: Autonomous AI task execution
- [ ] **Enhanced Security**: Sandboxing and permission system

## 🐛 Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features. When reporting bugs, include:

- Operating system and version
- FozzieDesktop version
- Steps to reproduce
- Expected vs actual behavior
- Console logs if applicable

## 📞 Support

- **Documentation**: Check this README and in-app help
- **Issues**: GitHub Issues for bug reports and feature requests
- **Community**: Join our discussions in GitHub Discussions

---

**Made with ❤️ by the FozzieDesktop community**

*"Wocka wocka! Making AI chat fun and accessible for everyone!"* 🐻
