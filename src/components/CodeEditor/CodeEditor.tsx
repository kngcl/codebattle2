import React, { useState, useEffect } from 'react';
import { Play, Save, Download, Upload, Settings, Copy, Check } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import { useTheme } from '../../context/ThemeContext';

// Import Prism core theme
import 'prismjs/themes/prism.css';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onSubmit?: (code: string, language: string) => void;
  readOnly?: boolean;
  height?: string;
  showLineNumbers?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'python',
  onCodeChange,
  onSubmit,
  readOnly = false,
  height = '400px',
  showLineNumbers = true,
  fontSize = 'medium'
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [copied, setCopied] = useState(false);
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const languages = [
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'c', label: 'C', extension: 'c' },
    { value: 'go', label: 'Go', extension: 'go' },
    { value: 'rust', label: 'Rust', extension: 'rs' },
    { value: 'jsx', label: 'React (JSX)', extension: 'jsx' },
    { value: 'tsx', label: 'React (TSX)', extension: 'tsx' }
  ];

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleSubmit = () => {
    onSubmit?.(code, selectedLanguage);
  };

  const handleSave = () => {
    const currentLang = languages.find(l => l.value === selectedLanguage);
    const extension = currentLang?.extension || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${extension}`;
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
        // Auto-detect language based on file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        const detectedLang = languages.find(l => l.extension === extension);
        if (detectedLang) {
          setSelectedLanguage(detectedLang.value);
        }
      };
      reader.readAsText(file);
    }
  };

  const highlight = (code: string) => {
    // Load language dynamically if not already loaded
    const loadLanguage = async (lang: string) => {
      const langMap: { [key: string]: string } = {
        'javascript': 'js',
        'typescript': 'ts',
        'python': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'go': 'go',
        'rust': 'rust',
        'jsx': 'jsx',
        'tsx': 'tsx'
      };
      
      const prismLang = langMap[lang] || lang;
      
      // Check if language is already loaded
      if (Prism.languages[prismLang]) {
        return Prism.languages[prismLang];
      }
      
      // For basic languages, provide simple highlighting
      const basicGrammar = {
        'comment': /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
        'string': /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/g,
        'number': /\b\d+(?:\.\d+)?\b/g,
        'keyword': /\b(?:function|var|let|const|if|else|for|while|return|class|import|export|from|default)\b/g,
        'operator': /[+\-*/%=<>!&|?:]/g,
        'punctuation': /[{}[\];(),.:]/g
      };
      
      return basicGrammar;
    };
    
    try {
      // Use basic highlighting for now to avoid loading issues
      const basicHighlight = (code: string) => {
        const colors = {
          comment: isDark ? '#6b7280' : '#6b7280',
          string: isDark ? '#34d399' : '#059669', 
          number: isDark ? '#fbbf24' : '#d97706',
          keyword: isDark ? '#f472b6' : '#be185d',
          function: isDark ? '#60a5fa' : '#2563eb',
          operator: isDark ? '#a78bfa' : '#7c3aed'
        };
        
        return code
          .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$|#.*$)/gm, `<span style="color: ${colors.comment};">$1</span>`)
          .replace(/(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/g, `<span style="color: ${colors.string};">$&</span>`)
          .replace(/\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g, `<span style="color: ${colors.number};">$&</span>`)
          .replace(/\b(?:function|var|let|const|if|else|for|while|return|class|import|export|from|default|def|print|public|private|static|void|int|string|boolean|true|false|null|undefined|async|await|try|catch|finally|throw|new|this|super|extends|implements)\b/g, `<span style="color: ${colors.keyword};">$&</span>`)
          .replace(/\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g, `<span style="color: ${colors.function};">$&</span>`)
          .replace(/[+\-*/%=<>!&|?:]/g, `<span style="color: ${colors.operator};">$&</span>`);
      };
      
      return basicHighlight(code);
    } catch (error) {
      console.error('Syntax highlighting error:', error);
      return code;
    }
  };

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  // Update initial code when prop changes
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Update language when prop changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl border ${isDark ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}>
      {/* Editor Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} px-4 py-3 border-b`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className={`px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                isDark 
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
            
            <div className={`px-3 py-2 rounded-lg text-xs font-medium ${
              isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
            }`}>
              {isDark ? 'Dark Theme' : 'Light Theme'}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title="Copy code"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
            
            {!readOnly && (
              <>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".py,.js,.ts,.java,.cpp,.c,.go,.rs,.jsx,.tsx,.txt"
                    onChange={handleLoad}
                    className="hidden"
                  />
                  <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}>
                    <Upload className="w-4 h-4" />
                    <span>Load</span>
                  </div>
                </label>
                
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </>
            )}
            
            {onSubmit && (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <Play className="w-4 h-4" />
                <span>Run Code</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative" style={{ height }}>
        
        <div className={`h-full ${getFontSize()}`}>
          <Editor
            value={code}
            onValueChange={handleCodeChange}
            highlight={highlight}
            padding={showLineNumbers ? 60 : 20}
            readOnly={readOnly}
            placeholder="Write your code here..."
            textareaId="code-editor"
            className={`h-full font-mono leading-relaxed focus:outline-none ${
              isDark 
                ? 'bg-gray-900 text-gray-100 placeholder-gray-500' 
                : 'bg-white text-gray-900 placeholder-gray-400'
            }`}
            style={{
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: '1.6',
              tabSize: 2,
              resize: 'none'
            }}
          />
          
          {/* Line numbers */}
          {showLineNumbers && (
            <div className={`absolute left-0 top-0 bottom-0 w-14 overflow-hidden pointer-events-none border-r user-select-none ${
              isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`pt-5 pb-5 px-3 font-mono text-right ${getFontSize()} leading-relaxed ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {code.split('\n').map((_, index) => (
                  <div key={index + 1} style={{ height: '1.6em' }}>
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className={`px-4 py-3 text-sm border-t flex justify-between items-center ${
        isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="font-medium">Lines:</span>
            <span>{code.split('\n').length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="font-medium">Characters:</span>
            <span>{code.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="font-medium">Language:</span>
            <span className="capitalize">{selectedLanguage}</span>
          </span>
        </div>
        
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
        }`}>
          Syntax highlighting enabled
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;