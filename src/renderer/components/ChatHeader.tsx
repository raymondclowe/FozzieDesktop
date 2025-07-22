import React from 'react';

interface ChatHeaderProps {
  selectedModel: string;
  fozzieMode: boolean;
  onToggleFozzie: () => void;
  onOpenSettings: () => void;
  chatTitle?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedModel,
  fozzieMode,
  onToggleFozzie,
  onOpenSettings,
  chatTitle,
}) => {
  return (
    <div className="chat-header">
      <div>
        <h2 style={{ margin: 0, fontSize: '18px' }}>
          {chatTitle || 'FozzieDesktop'}
        </h2>
        <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '2px' }}>
          Model: {selectedModel}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          className={`fozzie-toggle ${fozzieMode ? 'active' : ''}`}
          onClick={onToggleFozzie}
          title="Toggle Fozzie Bear joke mode"
        >
          {fozzieMode ? '🐻 Fozzie ON' : '🐻 Fozzie OFF'}
        </button>
        
        <button
          className="model-selector"
          onClick={onOpenSettings}
          title="Open settings"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
};