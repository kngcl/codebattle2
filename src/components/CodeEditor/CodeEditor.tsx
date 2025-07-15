import React, { useState } from 'react';
import { Play, Save, Download, Upload, Settings } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: 'light' | 'dark';
  onCodeChange?: (code: string) => void;
  onSubmit?: (code: string, language: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'python',
  theme: propTheme = 'light',
  onCodeChange,
  onSubmit,
  readOnly = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [theme, setTheme] = useState(propTheme);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' }
  ];

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleSubmit = () => {
    onSubmit?.(code, selectedLanguage);
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${selectedLanguage === 'python' ? 'py' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        onCodeChange?.(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
      {/* Editor Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} px-4 py-3 border-b`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className={`px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              disabled={readOnly}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {!readOnly && (
              <>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".py,.js,.java,.cpp,.c,.txt"
                    onChange={handleLoad}
                    className="hidden"
                  />
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}>
                    <Upload className="w-4 h-4" />
                    <span>Load</span>
                  </div>
                </label>
                
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </>
            )}
            
            {onSubmit && (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-1 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Run</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <textarea
          value={code}
          onChange={handleCodeChange}
          readOnly={readOnly}
          placeholder="Write your code here..."
          className={`w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none ${
            theme === 'dark' 
              ? 'bg-gray-900 text-green-400 placeholder-gray-500' 
              : 'bg-white text-gray-800 placeholder-gray-400'
          }`}
          style={{ 
            lineHeight: '1.5',
            tabSize: 4
          }}
        />
        
        {/* Line numbers (visual only) */}
        <div className={`absolute left-0 top-0 w-12 h-full overflow-hidden pointer-events-none border-r ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`p-4 font-mono text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {code.split('\n').map((_, index) => (
              <div key={index} className="text-right pr-2">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className={`px-4 py-2 text-xs border-t ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <div className="flex justify-between">
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;