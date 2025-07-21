import React, { useState } from 'react';
import { Settings } from '../App';
import { MCPConfiguration } from './MCPConfiguration';

interface MCPServer {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

interface SettingsPanelProps {
  isOpen: boolean;
  settings: Settings;
  onClose: () => void;
  onUpdateSettings: (settings: Settings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [mcpServers, setMcpServers] = useState<Record<string, MCPServer>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'mcp' | 'appearance'>('general');

  const handleSave = (): void => {
    setSaveStatus('saving');
    try {
      onUpdateSettings(localSettings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = (): void => {
    setLocalSettings(settings);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]): void => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const availableModels = [
    'gpt-3.5-turbo',
    'gpt-4',
    'gpt-4-turbo',
    'claude-3-sonnet',
    'claude-3-opus',
    'claude-3-haiku',
    'llama-2-70b',
    'mixtral-8x7b',
  ];

  return (
    <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--border-color)', 
        marginBottom: '24px' 
      }}>
        {[
          { key: 'general', label: 'General' },
          { key: 'ai', label: 'AI Provider' },
          { key: 'mcp', label: 'MCP Servers' },
          { key: 'appearance', label: 'Appearance' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.key ? 'var(--primary-color)' : 'transparent'}`,
              color: activeTab === tab.key ? 'var(--primary-color)' : 'var(--text-color)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="settings-section">
          <h3>General Settings</h3>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="fozzie-mode"
              checked={localSettings.fozzieMode}
              onChange={e => updateSetting('fozzieMode', e.target.checked)}
            />
            <label htmlFor="fozzie-mode">Enable Fozzie Bear Joke Mode 🐻</label>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <>
          <div className="settings-section">
            <h3>AI Provider</h3>
            
            <div className="form-group">
              <label>API Endpoint</label>
              <input
                type="text"
                value={localSettings.apiEndpoint}
                onChange={e => updateSetting('apiEndpoint', e.target.value)}
                placeholder="https://api.openai.com/v1"
              />
            </div>

            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={localSettings.apiKey}
                onChange={e => updateSetting('apiKey', e.target.value)}
                placeholder="Enter your API key"
              />
            </div>

            <div className="form-group">
              <label>Model</label>
              <select
                value={localSettings.selectedModel}
                onChange={e => updateSetting('selectedModel', e.target.value)}
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Generation Parameters</h3>
            
            <div className="form-group">
              <label>Max Tokens: {localSettings.maxTokens}</label>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={localSettings.maxTokens}
                onChange={e => updateSetting('maxTokens', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Temperature: {localSettings.temperature}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localSettings.temperature}
                onChange={e => updateSetting('temperature', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </>
      )}

      {activeTab === 'mcp' && (
        <MCPConfiguration
          config={mcpServers}
          onUpdateConfig={setMcpServers}
        />
      )}

      {activeTab === 'appearance' && (
        <div className="settings-section">
          <h3>Appearance</h3>
          
          <div className="form-group">
            <label>Theme</label>
            <select
              value={localSettings.theme}
              onChange={e => updateSetting('theme', e.target.value as 'light' | 'dark')}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
          }}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button
          onClick={handleReset}
          style={{
            padding: '12px 20px',
            backgroundColor: 'transparent',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {saveStatus === 'saved' && (
        <div className="success">Settings saved successfully!</div>
      )}
      
      {saveStatus === 'error' && (
        <div className="error">Error saving settings. Please try again.</div>
      )}

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--secondary-color)', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Getting Started</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>Add your AI provider API key above</li>
          <li>Choose your preferred model</li>
          <li>Start a new chat to begin conversations</li>
          <li>Try Fozzie mode for fun AI responses with jokes!</li>
        </ul>
      </div>
    </div>
  );
};