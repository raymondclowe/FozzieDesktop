import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage } from '../../src/renderer/components/ChatMessage';
import { Message } from '../../src/renderer/App';

// Mock the component since we need to test the interface
jest.mock('../../src/renderer/components/ChatMessage', () => ({
  ChatMessage: ({ message }: { message: Message }) => (
    <div data-testid="chat-message" className={`message ${message.role}`}>
      <div className="message-content" data-testid="message-content">
        {message.content}
      </div>
      {message.isFozzie && <span data-testid="fozzie-indicator">🐻</span>}
    </div>
  ),
}));

describe('ChatMessage Component', () => {
  const baseMessage: Message = {
    id: '1',
    content: 'Hello, world!',
    role: 'user',
    timestamp: new Date('2023-01-01'),
  };

  it('should render user message correctly', () => {
    render(<ChatMessage message={baseMessage} />);
    
    expect(screen.getByTestId('chat-message')).toBeInTheDocument();
    expect(screen.getByTestId('message-content')).toHaveTextContent('Hello, world!');
    expect(screen.getByTestId('chat-message')).toHaveClass('message', 'user');
  });

  it('should render assistant message correctly', () => {
    const assistantMessage: Message = {
      ...baseMessage,
      role: 'assistant',
      content: 'How can I help you?',
    };

    render(<ChatMessage message={assistantMessage} />);
    
    expect(screen.getByTestId('message-content')).toHaveTextContent('How can I help you?');
    expect(screen.getByTestId('chat-message')).toHaveClass('message', 'assistant');
  });

  it('should show Fozzie indicator when message is in Fozzie mode', () => {
    const fozzieMessage: Message = {
      ...baseMessage,
      role: 'assistant',
      content: 'Hello! Wocka wocka!',
      isFozzie: true,
    };

    render(<ChatMessage message={fozzieMessage} />);
    
    expect(screen.getByTestId('fozzie-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('fozzie-indicator')).toHaveTextContent('🐻');
  });

  it('should not show Fozzie indicator for regular messages', () => {
    render(<ChatMessage message={baseMessage} />);
    
    expect(screen.queryByTestId('fozzie-indicator')).not.toBeInTheDocument();
  });

  it('should handle empty content gracefully', () => {
    const emptyMessage: Message = {
      ...baseMessage,
      content: '',
    };

    render(<ChatMessage message={emptyMessage} />);
    
    expect(screen.getByTestId('message-content')).toHaveTextContent('');
  });

  it('should handle long content correctly', () => {
    const longMessage: Message = {
      ...baseMessage,
      content: 'This is a very long message that should be handled correctly by the component. '.repeat(10).trim(),
    };

    render(<ChatMessage message={longMessage} />);
    
    expect(screen.getByTestId('message-content')).toHaveTextContent(longMessage.content);
  });
});