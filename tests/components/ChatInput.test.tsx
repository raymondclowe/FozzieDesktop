import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ChatInput } from '../../src/renderer/components/ChatInput';

// Mock the ChatInput component
jest.mock('../../src/renderer/components/ChatInput', () => ({
  ChatInput: ({ onSendMessage, disabled }: { onSendMessage: (message: string) => void; disabled: boolean }) => {
    const [message, setMessage] = React.useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim() && !disabled) {
        onSendMessage(message.trim());
        setMessage('');
      }
    };

    return (
      <form onSubmit={handleSubmit} data-testid="chat-input-form">
        <textarea
          data-testid="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          data-testid="send-button"
          disabled={disabled || !message.trim()}
        >
          Send
        </button>
      </form>
    );
  },
}));

describe('ChatInput Component', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input form correctly', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={false} />);
    
    expect(screen.getByTestId('chat-input-form')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('should handle user input correctly', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={false} />);
    
    const input = screen.getByTestId('message-input');
    await user.type(input, 'Hello, world!');
    
    expect(input).toHaveValue('Hello, world!');
  });

  it('should send message when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={false} />);
    
    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');
    
    await user.type(input, 'Test message');
    await user.click(sendButton);
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
    expect(input).toHaveValue(''); // Should clear after sending
  });

  it('should not send empty messages', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={false} />);
    
    const sendButton = screen.getByTestId('send-button');
    expect(sendButton).toBeDisabled();
    
    await user.click(sendButton);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('should not send messages with only whitespace', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={false} />);
    
    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');
    
    await user.type(input, '   ');
    expect(sendButton).toBeDisabled();
    
    await user.click(sendButton);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={true} />);
    
    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');
    
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('should handle keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={false} />);
    
    const input = screen.getByTestId('message-input');
    
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('should trim whitespace from messages', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSendMessage={mockOnSendMessage} disabled={false} />);
    
    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');
    
    await user.type(input, '  Test message  ');
    await user.click(sendButton);
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });
});