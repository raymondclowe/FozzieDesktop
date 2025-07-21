declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      showSaveDialog: (options: any) => Promise<any>;
      showOpenDialog: (options: any) => Promise<any>;
      onNewChat: (callback: () => void) => void;
      onSaveChat: (callback: (filePath: string) => void) => void;
      onOpenSettings: (callback: () => void) => void;
      onToggleFozzieMode: (callback: () => void) => void;
      onSwitchModel: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export {};