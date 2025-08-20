import { useState, useEffect } from 'react';

interface EditorSettings {
  fontSize: 'small' | 'medium' | 'large';
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  enableAutocomplete: boolean;
  enableBracketMatching: boolean;
  enableCodeFolding: boolean;
  theme: 'light' | 'dark' | 'auto';
  keyBindings: 'default' | 'vim' | 'emacs';
  autoSave: boolean;
  showMinimap: boolean;
}

const defaultSettings: EditorSettings = {
  fontSize: 'medium',
  tabSize: 2,
  wordWrap: true,
  showLineNumbers: true,
  enableAutocomplete: true,
  enableBracketMatching: true,
  enableCodeFolding: true,
  theme: 'auto',
  keyBindings: 'default',
  autoSave: false,
  showMinimap: false
};

export const useEditorSettings = () => {
  const [settings, setSettingsState] = useState<EditorSettings>(() => {
    const stored = localStorage.getItem('codebattle-editor-settings');
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const updateSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    setSettingsState(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('codebattle-editor-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('codebattle-editor-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettingsState(defaultSettings);
    localStorage.setItem('codebattle-editor-settings', JSON.stringify(defaultSettings));
  };

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings
  };
};