# Fozzie Desktop Specification:FOSS-First Desktop AI Chat and MCP Client App

## 1. Overview

**Fozzie Desktop** is a multi-platform, open-source desktop application inspired by other desktops. Its core is an extensible AI chat platform, integrating Model Context Protocol (MCP) servers, robust chat history, settings management, and configuration flexibility.

It aims for functional parity with common desktops clients as a baseline, adding multi-provider support, LLM-agnostic architecture, advanced caching, and uniquely: "Fozzie Bear joke mode" and advanced agentic behaviors.

## 2. Core Features 

### 2.1 Chat Interface With AI

- Seamless chat with AI (LLMs); support for context window, file attachments, and code blocks[^1][^2].
- Instant access to AI without browser dependency.
- Supports multi-model switching (e.g., Claude Sonnet/Opus/Haiku), with UI for model selection[^1].


### 2.2 MCP (Model Context Protocol) Server Integration

- Native support for local and remote MCP servers, using config files (`claude_desktop_config.json`-style) for extensibility[^3][^4][^5].
- UI for adding, editing, and managing MCP servers.
- MCP extension support: easily install new MCP servers via a one-click extension manager (.dxt packaging)[^4].
- Servers accessible via local STDIO or over network—conforming to MCP standards[^3][^4][^6].


### 2.3 Chat History Management

- Retains conversation history, accessible from sidebar or search, with options for renaming, deleting, and bulk actions[^7][^2].
- Export and import conversations in portable formats (Markdown, JSON).


### 2.4 Settings Panel

- Centralized settings: general app preferences, appearance, privacy, network, providers, and experimental features.
- Advanced: separate "Developer" tab for direct config and extension management[^8][^9].


### 2.5 MCP Configuration

- Explicit config file (`claude_desktop_config.json` for Claude; Fozzie will support this identically)[^3][^8][^10].
- Add/modify MCP servers, set credentials/environment, and manage extensions directly from the GUI or file.


## 3. Unique Fozzie Desktop Enhancements

### 3.1 Free and Open Source (FOSS)

- Fully open codebase under acceptable OSI-approved license (e.g., Apache 2.0, MIT).
- Encourages community extensions and contributions.


### 3.2 Multi-Provider, Model-Agnostic Platform

- Provider abstraction layer; users can connect to various LLM APIs:
    - OpenRouter out-of-the-box
    - Any OpenAI-compatible backend (OpenAI, Azure, local models via OpenAI spec)[^11][^12]
    - Anthropic (optionally), Google Gemini, Mistral, Llama, etc.
- Seamless model switching—user can set per-chat or global default.


### 3.3 Flexible Model Backend Support

- Support local inference—load models like Llama/Llama.cpp, Ollama, and others.
- Allow custom connection strings, API keys, or self-hosted API endpoints.


### 3.4 Caching

- Intelligent prompt/response caching layer configurable per provider[^13][^14].
- Options for memory, disk, or cloud cache.
- Allows cache control for prompt templates, system instructions, and context blocks.


### 3.5 MCP Config Import/Export

- Ingest/accept Claude Desktop config verbatim (for MCP servers)[^3][^4][^10].
- Import/export other major MCP config formats; conversion utilities and GUI import wizard[^15].
- Validation and repair tools for config migration.


### 3.6 Cross-Platform (Electron-Based)

- Distributed as portable Electron app; single codebase, native installer for Windows, macOS, and Linux[^16].
- Packaging for all major platforms; supports auto-update.


### 3.7 "Fozzie Bear" Joke Mode

- Optional mode: AI receives a persistent prompt to channel Fozzie Bear (Muppets), telling corny jokes during responses and signing off "Wocka wocka!"


## 4. Roadmap \& Advanced Features

### 4.1 Remote Desktop Mode (Web UI Access)

- Optional "remote desktop" HTTP(S) server.
- Secure, responsive webapp UI for phone/tablet browser access to local app.
- All chat/mcp/server capabilities accessible via web.
- Authentication: password, token, or (optionally) Google account (OAuth2), see below.


### 4.2 Optional Google Account Authentication

- User sign-in via Google Account; supports one-touch OAuth2 login.
- Authentication applies to local app and/or remote web UI.
- Always optional—not mandatory for local use[^17][^18].


### 4.3 Background Agents \& Advanced Tasking

- Background agents run inner dialogues and pursue ongoing tasks (research, monitoring, data analysis).
- Agent status view: see "thinking", "waiting for user", "working on subtask", etc.
- Agents handle interruptions; can dynamically reprioritize based on user input.
- Simple agents: text-loop in-app execution.
- Advanced agents: VM/docker spin-up, run script in isolated environment, then integrate output back via MCP[^19][^20].


## 5. Additional Technical Notes

- **Security:** All extensions and MCP servers sandboxed; DXT extension support, keychain use for secrets, strict permission model for file access[^4][^21].
- **Extensibility:** Plugin architecture for both AI providers and MCP extensions.
- **Accessibility:** Keyboard navigation, dark/light themes, high-contrast modes.
- **Privacy:** No required cloud account; user stores all data locally unless integrated with cloud.


## 6. Questions \& Clarifications for You

1. **Customization**: Are there required UI themes (dark, high-contrast, accessibility) or branding requests beyond the "Fozzie"/Muppet theme integration?
2. **Local AI Model Support**: Is local fine-tuning/model upload out of scope, or must this be a first-class feature from launch?
3. **Security**: Should "Remote Desktop" mode require two-factor authentication or is Google login sufficient?
4. **Agent VM Isolation**: Is Docker containerization required for background agents or is a lighter-weight isolation mechanism acceptable?
5. **Chat History Storage**: Any retention limits, encryption requirements, or must export/import be possible for full user control?
6. **Providers**: Any specific analytics/telemetry about model/provider usage desired in the settings?

Let me know your preferences or constraints on these so the coding agent will have unambiguous requirements.

<div style="text-align: center">⁂</div>

[^1]: https://claudeaihub.com/claude-ai-desktop-app/

[^2]: https://webcatalog.io/apps/claude

[^3]: https://docs.mcp.run/mcp-clients/claude-desktop/

[^4]: https://www.anthropic.com/engineering/desktop-extensions

[^5]: https://zapier.com/blog/claude-mcp-servers/

[^6]: https://gofastmcp.com/integrations/claude-desktop

[^7]: https://claudeaihub.com/how-to-delete-chat-history/

[^8]: https://help.emporiaenergy.com/en/articles/11519323-claude-desktop-mcp-setup

[^9]: https://www.reddit.com/r/ClaudeAI/comments/1j4e1r5/where_is_settingsdeveloper_in_claude_desktop_app/

[^10]: https://modelcontextprotocol.io/quickstart/server

[^11]: https://www.youtube.com/watch?v=diTuQaSJ3nI

[^12]: https://apipark.com/techblog/en/unlock-ultimate-productivity-top-5-claude-for-desktop-features-you-cant-miss/

[^13]: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching

[^14]: https://www.anthropic.com/news/prompt-caching

[^15]: https://docs.anthropic.com/en/docs/claude-code/mcp

[^16]: https://www.stephanmiller.com/electron-project-from-scratch-with-claude-code/

[^17]: https://github.com/GongRzhe/Gmail-MCP-Server

[^18]: https://www.reddit.com/r/mcp/comments/1kk86bi/google_oauth_for_remote_mcp_server_with_claude/

[^19]: https://github.com/wonderwhy-er/DesktopCommanderMCP

[^20]: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/computer-use-tool

[^21]: https://support.anthropic.com/en/articles/10065433-installing-claude-desktop

[^22]: https://www.theverge.com/2024/10/31/24284742/claude-ai-macos-windows-desktop-app

[^23]: https://scottspence.com/posts/configuring-mcp-tools-in-claude-code

[^24]: https://www.reddit.com/r/ClaudeAI/comments/1gaf2jr/opensource_alternative_to_anthropics_claude/

[^25]: https://omnipilot.ai/blog/claude-desktop-getting-started-with-claude-desktop-a-comprehensive-guide

[^26]: https://github.com/sdairs/claudekeep

[^27]: https://dev.to/suzuki0430/the-easiest-way-to-set-up-mcp-with-claude-desktop-and-docker-desktop-5o

[^28]: https://github.com/aaddrick/claude-desktop-debian

[^29]: https://claude.ai/download

[^30]: https://www.reddit.com/r/ClaudeAI/comments/1j5nh09/is_there_any_way_to_get_a_history_of_my/

[^31]: https://modelcontextprotocol.io/quickstart/user

[^32]: https://www.anthropic.com/solutions/agents

[^33]: https://www.reddit.com/r/ClaudeAI/comments/1ji8ruv/my_claude_workflow_guide_advanced_setup_with_mcp/

[^34]: https://apidog.com/blog/claude-ai-remote-mcp-server/

[^35]: https://github.com/davidteren/claude-server/blob/main/docs/CLAUDE_DESKTOP_INTEGRATION.md

[^36]: https://www.reddit.com/r/ClaudeAI/comments/1hfq0ja/claude_for_mac_desktop_cache_using_over_100gb_of/

