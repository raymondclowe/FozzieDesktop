import React, { useState } from 'react';
import { Chat } from '../App';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onUpdateChatTitle: (chatId: string, title: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onUpdateChatTitle,
}) => {
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEditStart = (chat: Chat): void => {
    setEditingChat(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = (): void => {
    if (editingChat && editTitle.trim()) {
      onUpdateChatTitle(editingChat, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle('');
  };

  const handleEditCancel = (): void => {
    setEditingChat(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const formatChatPreview = (chat: Chat): string => {
    if (chat.messages.length === 0) return 'No messages yet';
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.content.slice(0, 60) + (lastMessage.content.length > 60 ? '...' : '');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🐻 Fozzie</div>
        <button className="new-chat-btn" onClick={onNewChat}>
          New Chat
        </button>
      </div>
      
      <div className="chat-list">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
            onDoubleClick={() => handleEditStart(chat)}
          >
            {editingChat === chat.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={handleEditSave}
                onKeyDown={handleKeyDown}
                onClick={e => e.stopPropagation()}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  width: '100%',
                  outline: 'none',
                }}
              />
            ) : (
              <>
                <div className="chat-title">{chat.title}</div>
                <div className="chat-preview">{formatChatPreview(chat)}</div>
              </>
            )}
            
            {activeChat === chat.id && editingChat !== chat.id && (
              <button
                className="delete-chat-btn"
                onClick={e => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '3px',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '2px 6px',
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {chats.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
            No chats yet. Click "New Chat" to get started!
          </div>
        )}
      </div>
    </div>
  );
};