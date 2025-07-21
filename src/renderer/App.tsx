import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatInput } from './components/ChatInput';
import { SettingsPanel } from './components/SettingsPanel';
import { WelcomeScreen } from './components/WelcomeScreen';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isFozzie?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  apiKey: string;
  selectedModel: string;
  apiEndpoint: string;
  fozzieMode: boolean;
  theme: 'light' | 'dark';
  maxTokens: number;
  temperature: number;
}

const defaultSettings: Settings = {
  apiKey: '',
  selectedModel: 'gpt-3.5-turbo',
  apiEndpoint: 'https://api.openai.com/v1',
  fozzieMode: false,
  theme: 'light',
  maxTokens: 2048,
  temperature: 0.7,
};

export const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('fozzie-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedChats = localStorage.getItem('fozzie-chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      setChats(parsedChats);
    }
  }, []);

  // Save chats to localStorage when chats change
  useEffect(() => {
    localStorage.setItem('fozzie-chats', JSON.stringify(chats));
  }, [chats]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChat]);

  // Listen for menu events from main process
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onNewChat(() => createNewChat());
      window.electronAPI.onOpenSettings(() => setIsSettingsOpen(true));
      window.electronAPI.onToggleFozzieMode(() => toggleFozzieMode());
      window.electronAPI.onSwitchModel(() => setIsSettingsOpen(true));
      window.electronAPI.onSaveChat((filePath: string) => saveChat(filePath));

      return () => {
        window.electronAPI.removeAllListeners('new-chat');
        window.electronAPI.removeAllListeners('open-settings');
        window.electronAPI.removeAllListeners('toggle-fozzie-mode');
        window.electronAPI.removeAllListeners('switch-model');
        window.electronAPI.removeAllListeners('save-chat');
      };
    }
  }, []);

  const getCurrentChat = (): Chat | undefined => {
    return chats.find(chat => chat.id === activeChat);
  };

  const createNewChat = (): void => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const updateChatTitle = (chatId: string, title: string): void => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title, updatedAt: new Date() }
        : chat
    ));
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || !activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    setChats(prev => prev.map(chat => 
      chat.id === activeChat 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            updatedAt: new Date(),
            title: chat.messages.length === 0 ? content.slice(0, 50) : chat.title
          }
        : chat
    ));

    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      let responseContent = generateMockResponse(content);
      
      // Apply Fozzie mode if enabled
      if (settings.fozzieMode) {
        responseContent = applyFozzieMode(responseContent);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        isFozzie: settings.fozzieMode,
      };

      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { 
              ...chat, 
              messages: [...chat.messages, assistantMessage],
              updatedAt: new Date()
            }
          : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please check your settings and try again.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? { 
              ...chat, 
              messages: [...chat.messages, errorMessage],
              updatedAt: new Date()
            }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (input: string): string => {
    const responses = [
      "I understand your question about " + input.toLowerCase() + ". Let me help you with that.",
      "That's an interesting point. Here's what I think about " + input.toLowerCase() + "...",
      "Based on your message, I can provide some insights on " + input.toLowerCase() + ".",
      "Let me help you with that. Regarding " + input.toLowerCase() + ", here's my response...",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + " This is a mock response for demonstration purposes. Please configure your AI provider in the settings to get real AI responses.";
  };

  const applyFozzieMode = (content: string): string => {
    const fozzieJokes = [
      " Wocka wocka!",
      " Hey, why did the AI cross the road? To get to the other site! Wocka wocka!",
      " You know what they say about artificial intelligence? It's better than artificial stupidity! Wocka wocka!",
      " Here's a joke for you: Why don't robots ever panic? Because they have nerves of steel! Wocka wocka!",
    ];
    
    const joke = fozzieJokes[Math.floor(Math.random() * fozzieJokes.length)];
    return content + joke;
  };

  const toggleFozzieMode = (): void => {
    const newSettings = { ...settings, fozzieMode: !settings.fozzieMode };
    setSettings(newSettings);
    localStorage.setItem('fozzie-settings', JSON.stringify(newSettings));
  };

  const updateSettings = (newSettings: Settings): void => {
    setSettings(newSettings);
    localStorage.setItem('fozzie-settings', JSON.stringify(newSettings));
  };

  const deleteChat = (chatId: string): void => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setActiveChat(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const saveChat = async (filePath?: string): Promise<void> => {
    const currentChat = getCurrentChat();
    if (!currentChat) return;

    try {
      if (filePath) {
        // Save to specified file (this would need actual file writing in a real app)
        console.log('Saving chat to:', filePath);
      } else {
        // Export as JSON to clipboard or download
        const chatData = JSON.stringify(currentChat, null, 2);
        navigator.clipboard.writeText(chatData);
        console.log('Chat saved to clipboard');
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const currentChat = getCurrentChat();

  return (
    <div className="app" data-theme={settings.theme}>
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onUpdateChatTitle={updateChatTitle}
      />
      
      <div className="main-content">
        <ChatHeader
          selectedModel={settings.selectedModel}
          fozzieMode={settings.fozzieMode}
          onToggleFozzie={toggleFozzieMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          chatTitle={currentChat?.title}
        />
        
        <div className="chat-messages">
          {!currentChat ? (
            <WelcomeScreen onNewChat={createNewChat} />
          ) : (
            <>
              {currentChat.messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="message assistant loading">
                  <div className="message-content">Thinking...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {currentChat && (
          <ChatInput
            onSendMessage={sendMessage}
            disabled={isLoading}
          />
        )}
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
};