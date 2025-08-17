import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { App } from '../../src/renderer/App';
import { APIService } from '../../src/services/apiService';

// Mock the APIService
jest.mock('../../src/services/apiService', () => {
  return {
    APIService: jest.fn().mockImplementation(() => ({
      sendChatMessage: jest.fn(),
    })),
  };
});

const mockAPIService = require('../../src/services/apiService').APIService;
let mockSendChatMessage: jest.Mock;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mock for APIService instance
    mockSendChatMessage = jest.fn();
    mockAPIService.mockImplementation(() => ({
      sendChatMessage: mockSendChatMessage,
    }));
    
    // Set up settings with API key so the app uses APIService instead of fallback
    const settingsWithApiKey = {
      apiKey: 'test-api-key',
      selectedModel: 'openai/gpt-3.5-turbo',
      apiEndpoint: 'https://api.openai.com/v1',
      fozzieMode: false,
      theme: 'light'
    };
    
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'fozzie-settings') {
        return JSON.stringify(settingsWithApiKey);
      }
      return null;
    });
    localStorageMock.setItem.mockImplementation(() => {});
  });

  it('should render welcome screen when no chats exist', () => {
    render(<App />);
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('should create new chat and allow messaging', async () => {
    const user = userEvent.setup();
    mockSendChatMessage.mockResolvedValue('Hello! How can I help you?');

    render(<App />);
    
    // Create new chat using the button specifically
    const newChatButton = screen.getByRole('button', { name: /new chat/i });
    await user.click(newChatButton);
    
    // Should now show chat interface
    expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
    
    // Type and send a message
    const messageInput = screen.getByRole('textbox');
    await user.type(messageInput, 'Hello, AI!');
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);
    
    // Should show user message in the message area specifically  
    const messageContents = screen.getAllByText('Hello, AI!');
    // Look for the message in a div with class message-content
    const userMessage = messageContents.find(el => 
      el.className.includes('message-content') || el.closest('.message.user')
    );
    expect(userMessage).toBeInTheDocument();
    
    // Should show loading state
    expect(screen.getByText(/thinking/i)).toBeInTheDocument();
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
    });
  });

  it('should handle API key configuration', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open settings using the settings button
    const settingsButton = screen.getByText(/⚙️ Settings/);
    await user.click(settingsButton);
    
    // Click on AI Provider tab  
    const aiProviderTab = screen.getByText('AI Provider');
    await user.click(aiProviderTab);
    
    // Should show settings panel
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Enter API key
    const apiKeyInput = screen.getByLabelText(/api key/i);
    await user.type(apiKeyInput, 'sk-test123456789');
    
    // Save settings
    const saveButton = screen.getByText(/save/i);
    await user.click(saveButton);
    
    // Settings should close
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    
    // Verify localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'fozzie-settings',
      expect.stringContaining('sk-test123456789')
    );
  });

  it('should toggle Fozzie mode', async () => {
    const user = userEvent.setup();
    mockSendChatMessage.mockResolvedValue('Hello there!');

    render(<App />);
    
    // Create new chat using the button specifically
    const newChatButton = screen.getByRole('button', { name: /new chat/i });
    await user.click(newChatButton);
    
    // Toggle Fozzie mode
    const fozzieButton = screen.getByText(/fozzie/i);
    await user.click(fozzieButton);
    
    // Send a message
    const messageInput = screen.getByRole('textbox');
    await user.type(messageInput, 'Tell me a joke');
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);
    
    // Wait for response with Fozzie content
    await waitFor(() => {
      expect(screen.getByText(/wocka wocka/i)).toBeInTheDocument();
    });
  });

  it('should handle chat history persistence', async () => {
    const user = userEvent.setup();
    
    // Mock existing chat in localStorage
    const existingChat = {
      id: '1',
      title: 'Test Chat',
      messages: [
        {
          id: '1',
          content: 'Hello',
          role: 'user',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'fozzie-chats') {
        return JSON.stringify([existingChat]);
      }
      return null;
    });

    render(<App />);
    
    // Should load existing chat
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
    
    // Click on the chat
    await user.click(screen.getByText('Test Chat'));
    
    // Should show the message
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    mockSendChatMessage.mockRejectedValue(new Error('API key is required'));

    render(<App />);
    
    // Create new chat using the button specifically
    const newChatButton = screen.getByRole('button', { name: /new chat/i });
    await user.click(newChatButton);
    
    // Send a message
    const messageInput = screen.getByRole('textbox');
    await user.type(messageInput, 'Hello');
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/configure your API key/i)).toBeInTheDocument();
    });
  });

  it('should allow chat deletion', async () => {
    const user = userEvent.setup();
    
    // Mock existing chat
    const existingChat = {
      id: '1',
      title: 'Test Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'fozzie-chats') {
        return JSON.stringify([existingChat]);
      }
      return null;
    });

    render(<App />);
    
    // Should show the chat
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
    
    // Find and click delete button (this would be context menu or button)
    const deleteButton = screen.getByLabelText(/delete/i);
    await user.click(deleteButton);
    
    // Chat should be removed
    expect(screen.queryByText('Test Chat')).not.toBeInTheDocument();
    
    // Should show welcome screen again
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('should handle theme switching', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open settings using the settings button 
    const settingsButton = screen.getByText(/⚙️ Settings/);
    await user.click(settingsButton);
    
    // Click on Appearance tab
    const appearanceTab = screen.getByText('Appearance');
    await user.click(appearanceTab);
    
    // Switch to dark theme
    const themeSelect = screen.getByLabelText(/theme/i);
    await user.selectOptions(themeSelect, 'dark');
    
    // Save settings
    const saveButton = screen.getByText(/save/i);
    await user.click(saveButton);
    
    // Verify the app has dark theme applied
    const appElement = screen.getByTestId('app') || document.querySelector('.app');
    expect(appElement).toHaveAttribute('data-theme', 'dark');
  });
});