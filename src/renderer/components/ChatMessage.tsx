import React from 'react';
import { Message } from '../App';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const messageClass = message.role === 'user' 
    ? 'message user' 
    : message.isFozzie 
      ? 'message assistant fozzie'
      : 'message assistant';

  return (
    <div className={messageClass}>
      <div className="message-content">{message.content}</div>
      <div className="message-time">{formatTime(message.timestamp)}</div>
    </div>
  );
};