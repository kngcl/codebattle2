import React from 'react';
import { X, Settings, Monitor, Type, Indent, Eye, Code, Keyboard, Save, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useEditorSettings } from '../../hooks/useEditorSettings';

interface EditorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditorSettingsModal: React.FC<EditorSettingsModalProps> = ({ isOpen, onClose }) => {
  const { actualTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useEditorSettings();
  const isDark = actualTheme === 'dark';

  if (!isOpen) return null;

  const settingsCategories = [
    {
      title: 'Display',
      icon: Monitor,
      settings: [
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'select',
          options: [
            { value: 'small', label: 'Small (12px)' },
            { value: 'medium', label: 'Medium (14px)' },
            { value: 'large', label: 'Large (16px)' }
          ]
        },
        {
          key: 'showLineNumbers',
          label: 'Show Line Numbers',
          type: 'toggle'
        },
        {
          key: 'wordWrap',
          label: 'Word Wrap',
          type: 'toggle'
        },
        {
          key: 'showMinimap',
          label: 'Show Minimap',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Editor Features',
      icon: Code,
      settings: [
        {
          key: 'enableAutocomplete',
          label: 'Autocomplete',
          type: 'toggle'
        },
        {
          key: 'enableBracketMatching',
          label: 'Bracket Matching',
          type: 'toggle'
        },
        {
          key: 'enableCodeFolding',
          label: 'Code Folding',
          type: 'toggle'
        },
        {
          key: 'autoSave',
          label: 'Auto Save',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Code Style',
      icon: Type,
      settings: [
        {
          key: 'tabSize',
          label: 'Tab Size',
          type: 'select',
          options: [
            { value: 2, label: '2 spaces' },
            { value: 4, label: '4 spaces' },
            { value: 8, label: '8 spaces' }
          ]
        },
        {
          key: 'keyBindings',
          label: 'Key Bindings',
          type: 'select',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'vim', label: 'Vim' },
            { value: 'emacs', label: 'Emacs' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative w-full max-w-4xl ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl border ${isDark ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}>
          {/* Header */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-b flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Editor Settings
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Customize your coding experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsCategories.map((category, categoryIndex) => {
                const CategoryIcon = category.icon;
                return (
                  <div
                    key={categoryIndex}
                    className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-5 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <CategoryIcon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {category.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {category.settings.map((setting, settingIndex) => (
                        <div key={settingIndex} className="space-y-2">
                          <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {setting.label}
                          </label>
                          
                          {setting.type === 'toggle' && (
                            <button
                              onClick={() => updateSetting(setting.key as any, !settings[setting.key as keyof typeof settings])}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[setting.key as keyof typeof settings]
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                  : isDark ? 'bg-gray-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[setting.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          )}
                          
                          {setting.type === 'select' && (
                            <select
                              value={settings[setting.key as keyof typeof settings] as string | number}
                              onChange={(e) => {
                                const value = setting.key === 'tabSize' ? parseInt(e.target.value) : e.target.value;
                                updateSetting(setting.key as any, value as any);
                              }}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                isDark 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            >
                              {setting.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} px-6 py-4 border-t flex justify-between items-center`}>
            <button
              onClick={resetSettings}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Save className="w-4 h-4" />
                <span>Settings saved automatically</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSettingsModal;