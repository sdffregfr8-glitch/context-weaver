// Final Build Version: 2.2.0 - Stable Deployment
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'context-weaver-settings';

export interface ServerSettings {
  ollamaEndpoint: string;
  filesApiPath: string;
  model: string;
  temperature: number;
  topP: number;
}

const DEFAULT_SETTINGS: ServerSettings = {
  ollamaEndpoint: 'http://5.182.18.219:11434',
  filesApiPath: '/api/files',
  model: 'llama3:latest',
  temperature: 0.2,
  topP: 0.9,
};

export function useServerSettings() {
  const [settings, setSettings] = useState<ServerSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to storage:', e);
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<ServerSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    DEFAULT_SETTINGS,
  };
}
