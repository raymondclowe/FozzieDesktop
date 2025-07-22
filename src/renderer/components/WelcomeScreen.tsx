import React from 'react';

interface WelcomeScreenProps {
  onNewChat: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNewChat }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-title">🐻 Welcome to FozzieDesktop</div>
      <div className="welcome-subtitle">
        A FOSS Desktop app for chatting with AI
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3>Features:</h3>
        <ul className="welcome-features">
          <li>Chat with AI using multiple providers</li>
          <li>MCP (Model Context Protocol) server integration</li>
          <li>Chat history management</li>
          <li>Fozzie Bear joke mode for fun conversations</li>
          <li>Cross-platform desktop application</li>
          <li>Open source and privacy-focused</li>
        </ul>
      </div>
      
      <button
        className="new-chat-btn"
        onClick={onNewChat}
        style={{ 
          fontSize: '16px',
          padding: '12px 24px',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Start Your First Chat
      </button>
      
      <div style={{ marginTop: '24px', fontSize: '14px', opacity: 0.7 }}>
        💡 Tip: Configure your AI provider in Settings (⚙️) to get started
      </div>
    </div>
  );
};