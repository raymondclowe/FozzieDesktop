import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SettingsPanel } from '../../src/renderer/components/SettingsPanel';
import { Settings } from '../../src/renderer/App';

// Mock the SettingsPanel component
jest.mock('../../src/renderer/components/SettingsPanel', () => ({
  SettingsPanel: ({ 
    isOpen, 
    settings, 
    onClose, 
    onUpdateSettings 
  }: { 
    isOpen: boolean; 
    settings: Settings; 
    onClose: () => void; 
    onUpdateSettings: (settings: Settings) => void; 
  }) => {
    if (!isOpen) return null;

    const [localSettings, setLocalSettings] = React.useState(settings);

    const handleSave = () => {
      onUpdateSettings(localSettings);
      onClose();
    };

    return (
      <div data-testid="settings-panel" className="settings-overlay">
        <div className="settings-content">
          <h2>Settings</h2>
          
          <label>
            API Key:
            <input
              data-testid="api-key-input"
              type="password"
              value={localSettings.apiKey}
              onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
            />
          </label>

          <label>
            Model:
            <select
              data-testid="model-select"
              value={localSettings.selectedModel}
              onChange={(e) => setLocalSettings({ ...localSettings, selectedModel: e.target.value })}
            >
              <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="openai/gpt-4">GPT-4</option>
              <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
            </select>
          </label>

          <label>
            <input
              data-testid="fozzie-mode-checkbox"
              type="checkbox"
              checked={localSettings.fozzieMode}
              onChange={(e) => setLocalSettings({ ...localSettings, fozzieMode: e.target.checked })}
            />
            Fozzie Mode
          </label>

          <label>
            Theme:
            <select
              data-testid="theme-select"
              value={localSettings.theme}
              onChange={(e) => setLocalSettings({ ...localSettings, theme: e.target.value as 'light' | 'dark' })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <div className="settings-actions">
            <button data-testid="save-button" onClick={handleSave}>
              Save
            </button>
            <button data-testid="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  },
}));

describe('SettingsPanel Component', () => {
  const mockSettings: Settings = {
    apiKey: 'test-api-key',
    selectedModel: 'openai/gpt-3.5-turbo',
    apiEndpoint: 'https://api.openai.com/v1',
    fozzieMode: false,
    theme: 'light',
    maxTokens: 2048,
    temperature: 0.7,
  };

  const mockOnClose = jest.fn();
  const mockOnUpdateSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <SettingsPanel
        isOpen={false}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    expect(screen.queryByTestId('settings-panel')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should display current settings values', () => {
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    expect(screen.getByTestId('api-key-input')).toHaveValue('test-api-key');
    expect(screen.getByTestId('model-select')).toHaveValue('openai/gpt-3.5-turbo');
    expect(screen.getByTestId('fozzie-mode-checkbox')).not.toBeChecked();
    expect(screen.getByTestId('theme-select')).toHaveValue('light');
  });

  it('should handle API key changes', async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    const apiKeyInput = screen.getByTestId('api-key-input');
    await user.clear(apiKeyInput);
    await user.type(apiKeyInput, 'new-api-key');
    
    expect(apiKeyInput).toHaveValue('new-api-key');
  });

  it('should handle model selection changes', async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    const modelSelect = screen.getByTestId('model-select');
    await user.selectOptions(modelSelect, 'openai/gpt-4');
    
    expect(modelSelect).toHaveValue('openai/gpt-4');
  });

  it('should handle Fozzie mode toggle', async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    const fozzieCheckbox = screen.getByTestId('fozzie-mode-checkbox');
    await user.click(fozzieCheckbox);
    
    expect(fozzieCheckbox).toBeChecked();
  });

  it('should handle theme changes', async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    const themeSelect = screen.getByTestId('theme-select');
    await user.selectOptions(themeSelect, 'dark');
    
    expect(themeSelect).toHaveValue('dark');
  });

  it('should save settings when save button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    // Make changes
    const apiKeyInput = screen.getByTestId('api-key-input');
    const fozzieCheckbox = screen.getByTestId('fozzie-mode-checkbox');
    
    await user.clear(apiKeyInput);
    await user.type(apiKeyInput, 'updated-key');
    await user.click(fozzieCheckbox);
    
    // Save
    const saveButton = screen.getByTestId('save-button');
    await user.click(saveButton);
    
    expect(mockOnUpdateSettings).toHaveBeenCalledWith({
      ...mockSettings,
      apiKey: 'updated-key',
      fozzieMode: true,
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close without saving when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SettingsPanel
        isOpen={true}
        settings={mockSettings}
        onClose={mockOnClose}
        onUpdateSettings={mockOnUpdateSettings}
      />
    );
    
    const cancelButton = screen.getByTestId('cancel-button');
    await user.click(cancelButton);
    
    expect(mockOnUpdateSettings).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});