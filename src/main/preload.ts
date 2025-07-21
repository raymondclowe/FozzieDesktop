import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // File operations
  showSaveDialog: (options: any) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),

  // Menu events listeners
  onNewChat: (callback: () => void) => {
    ipcRenderer.on('new-chat', callback);
  },
  onSaveChat: (callback: (filePath: string) => void) => {
    ipcRenderer.on('save-chat', (event, filePath) => callback(filePath));
  },
  onOpenSettings: (callback: () => void) => {
    ipcRenderer.on('open-settings', callback);
  },
  onToggleFozzieMode: (callback: () => void) => {
    ipcRenderer.on('toggle-fozzie-mode', callback);
  },
  onSwitchModel: (callback: () => void) => {
    ipcRenderer.on('switch-model', callback);
  },

  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});