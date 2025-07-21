import React, { useState } from 'react';

interface MCPServer {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

interface MCPConfigProps {
  config: Record<string, MCPServer>;
  onUpdateConfig: (config: Record<string, MCPServer>) => void;
}

export const MCPConfiguration: React.FC<MCPConfigProps> = ({ config, onUpdateConfig }) => {
  const [editingServer, setEditingServer] = useState<string | null>(null);
  const [newServer, setNewServer] = useState<{ name: string } & MCPServer>({
    name: '',
    command: '',
    args: [],
    env: {}
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [configJson, setConfigJson] = useState(JSON.stringify({ mcpServers: config }, null, 2));

  const handleAddServer = (): void => {
    if (newServer.name && newServer.command) {
      const updatedConfig = {
        ...config,
        [newServer.name]: {
          command: newServer.command,
          args: newServer.args,
          env: newServer.env
        }
      };
      onUpdateConfig(updatedConfig);
      setNewServer({ name: '', command: '', args: [], env: {} });
      setShowAddForm(false);
    }
  };

  const handleRemoveServer = (serverName: string): void => {
    const updatedConfig = { ...config };
    delete updatedConfig[serverName];
    onUpdateConfig(updatedConfig);
  };

  const handleImportConfig = (): void => {
    try {
      const parsed = JSON.parse(configJson);
      if (parsed.mcpServers) {
        onUpdateConfig(parsed.mcpServers);
      }
    } catch (error) {
      alert('Invalid JSON configuration');
    }
  };

  const handleExportConfig = (): void => {
    const configStr = JSON.stringify({ mcpServers: config }, null, 2);
    navigator.clipboard.writeText(configStr);
    alert('Configuration copied to clipboard');
  };

  const parseArgs = (argsString: string): string[] => {
    return argsString.split(' ').filter(arg => arg.trim() !== '');
  };

  const formatArgs = (args: string[]): string => {
    return args.join(' ');
  };

  return (
    <div className="mcp-configuration">
      <div style={{ marginBottom: '24px' }}>
        <h3>MCP Servers</h3>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>
          Configure Model Context Protocol (MCP) servers for extended functionality.
        </p>
      </div>

      {Object.entries(config).map(([name, server]) => (
        <div
          key={name}
          style={{
            padding: '16px',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            marginBottom: '12px',
            backgroundColor: 'var(--secondary-color)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '16px' }}>{name}</h4>
            <button
              onClick={() => handleRemoveServer(name)}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Remove
            </button>
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            <div><strong>Command:</strong> {server.command}</div>
            {server.args && server.args.length > 0 && (
              <div><strong>Args:</strong> {formatArgs(server.args)}</div>
            )}
            {server.env && Object.keys(server.env).length > 0 && (
              <div><strong>Environment:</strong> {JSON.stringify(server.env)}</div>
            )}
          </div>
        </div>
      ))}

      {showAddForm ? (
        <div
          style={{
            padding: '16px',
            border: '1px solid var(--primary-color)',
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: 'var(--background-color)',
          }}
        >
          <h4 style={{ margin: '0 0 16px 0' }}>Add New MCP Server</h4>
          
          <div className="form-group">
            <label>Server Name</label>
            <input
              type="text"
              value={newServer.name}
              onChange={e => setNewServer({ ...newServer, name: e.target.value })}
              placeholder="my-mcp-server"
            />
          </div>

          <div className="form-group">
            <label>Command</label>
            <input
              type="text"
              value={newServer.command}
              onChange={e => setNewServer({ ...newServer, command: e.target.value })}
              placeholder="node /path/to/server.js"
            />
          </div>

          <div className="form-group">
            <label>Arguments (space-separated)</label>
            <input
              type="text"
              value={formatArgs(newServer.args)}
              onChange={e => setNewServer({ ...newServer, args: parseArgs(e.target.value) })}
              placeholder="--port 3000 --config ./config.json"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={handleAddServer}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Add Server
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '24px',
          }}
        >
          + Add MCP Server
        </button>
      )}

      <div style={{ marginTop: '32px' }}>
        <h4>Import/Export Configuration</h4>
        <div className="form-group">
          <label>JSON Configuration (claude_desktop_config.json format)</label>
          <textarea
            rows={8}
            value={configJson}
            onChange={e => setConfigJson(e.target.value)}
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              width: '100%',
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            onClick={handleImportConfig}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Import Config
          </button>
          <button
            onClick={handleExportConfig}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Export to Clipboard
          </button>
        </div>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--secondary-color)', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Examples</h4>
        <div style={{ fontSize: '14px' }}>
          <p><strong>Local Server:</strong></p>
          <code style={{ display: 'block', padding: '8px', backgroundColor: 'var(--background-color)', borderRadius: '4px', marginBottom: '8px' }}>
            node /path/to/my-mcp-server/index.js
          </code>
          
          <p><strong>Python Server:</strong></p>
          <code style={{ display: 'block', padding: '8px', backgroundColor: 'var(--background-color)', borderRadius: '4px', marginBottom: '8px' }}>
            python -m my_mcp_server --port 3000
          </code>
          
          <p><strong>Remote Server:</strong></p>
          <code style={{ display: 'block', padding: '8px', backgroundColor: 'var(--background-color)', borderRadius: '4px' }}>
            http://localhost:3000/mcp
          </code>
        </div>
      </div>
    </div>
  );
};