import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Save, Download, Upload, Copy, Check, Settings, Maximize2, Minimize2, RotateCcw, RotateCw, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface AutocompleteItem {
  label: string;
  value: string;
  type: 'keyword' | 'function' | 'variable' | 'method' | 'property';
  description?: string;
}

interface AdvancedCodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onSubmit?: (code: string, language: string) => void;
  readOnly?: boolean;
  height?: string;
  showLineNumbers?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  enableAutocomplete?: boolean;
  enableBracketMatching?: boolean;
  enableCodeFolding?: boolean;
}

const AdvancedCodeEditor: React.FC<AdvancedCodeEditorProps> = ({
  initialCode = '',
  language = 'python',
  onCodeChange,
  onSubmit,
  readOnly = false,
  height = '400px',
  showLineNumbers = true,
  fontSize = 'medium',
  enableAutocomplete = true,
  enableBracketMatching = true,
  enableCodeFolding = true
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([]);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const [matchedBrackets, setMatchedBrackets] = useState<{start: number, end: number} | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  
  const { actualTheme } = useTheme();
  const { showSuccess, showError } = useToast();
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

  // Language-specific autocomplete suggestions
  const getAutocompleteItems = (lang: string, currentWord: string): AutocompleteItem[] => {
    const commonItems: Record<string, AutocompleteItem[]> = {
      python: [
        { label: 'print', value: 'print()', type: 'function', description: 'Print to console' },
        { label: 'len', value: 'len()', type: 'function', description: 'Get length' },
        { label: 'range', value: 'range()', type: 'function', description: 'Create range' },
        { label: 'for', value: 'for i in range():\n    ', type: 'keyword', description: 'For loop' },
        { label: 'if', value: 'if :\n    ', type: 'keyword', description: 'If statement' },
        { label: 'def', value: 'def function_name():\n    ', type: 'keyword', description: 'Define function' },
        { label: 'class', value: 'class ClassName:\n    ', type: 'keyword', description: 'Define class' },
        { label: 'import', value: 'import ', type: 'keyword', description: 'Import module' },
        { label: 'return', value: 'return ', type: 'keyword', description: 'Return statement' },
        { label: 'try', value: 'try:\n    \nexcept:\n    ', type: 'keyword', description: 'Try-except block' }
      ],
      javascript: [
        { label: 'console.log', value: 'console.log()', type: 'method', description: 'Log to console' },
        { label: 'function', value: 'function name() {\n    \n}', type: 'keyword', description: 'Function declaration' },
        { label: 'const', value: 'const ', type: 'keyword', description: 'Constant declaration' },
        { label: 'let', value: 'let ', type: 'keyword', description: 'Variable declaration' },
        { label: 'if', value: 'if () {\n    \n}', type: 'keyword', description: 'If statement' },
        { label: 'for', value: 'for (let i = 0; i < ; i++) {\n    \n}', type: 'keyword', description: 'For loop' },
        { label: 'while', value: 'while () {\n    \n}', type: 'keyword', description: 'While loop' },
        { label: 'return', value: 'return ', type: 'keyword', description: 'Return statement' },
        { label: 'async', value: 'async function() {\n    \n}', type: 'keyword', description: 'Async function' },
        { label: 'await', value: 'await ', type: 'keyword', description: 'Await expression' }
      ]
    };

    const items = commonItems[lang] || commonItems.javascript;
    return items.filter(item => 
      item.label.toLowerCase().includes(currentWord.toLowerCase())
    );
  };

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    const textarea = e.target;
    
    setCode(newCode);
    onCodeChange?.(newCode);

    // Update cursor position
    const lines = newCode.substring(0, textarea.selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });

    // Handle autocomplete
    if (enableAutocomplete && !readOnly) {
      handleAutocomplete(textarea, newCode);
    }

    // Handle bracket matching
    if (enableBracketMatching) {
      handleBracketMatching(textarea, newCode);
    }
  }, [onCodeChange, enableAutocomplete, enableBracketMatching, readOnly]);

  const handleAutocomplete = (textarea: HTMLTextAreaElement, code: string) => {
    const cursorPos = textarea.selectionStart;
    const beforeCursor = code.substring(0, cursorPos);
    const currentLineMatch = beforeCursor.split('\n').pop() || '';
    const wordMatch = currentLineMatch.match(/[\w\.]+$/);
    
    if (wordMatch && wordMatch[0].length > 1) {
      const currentWord = wordMatch[0];
      const suggestions = getAutocompleteItems(selectedLanguage, currentWord);
      
      if (suggestions.length > 0) {
        setAutocompleteItems(suggestions);
        setAutocompleteIndex(0);
        setAutocompleteOpen(true);
      } else {
        setAutocompleteOpen(false);
      }
    } else {
      setAutocompleteOpen(false);
    }
  };

  const handleBracketMatching = (textarea: HTMLTextAreaElement, code: string) => {
    const cursorPos = textarea.selectionStart;
    const char = code[cursorPos - 1];
    
    if (['(', '[', '{'].includes(char)) {
      const openBracket = char;
      const closeBracket = { '(': ')', '[': ']', '{': '}' }[openBracket];
      let count = 1;
      
      for (let i = cursorPos; i < code.length; i++) {
        if (code[i] === openBracket) count++;
        if (code[i] === closeBracket) count--;
        if (count === 0) {
          setMatchedBrackets({ start: cursorPos - 1, end: i });
          setTimeout(() => setMatchedBrackets(null), 2000);
          break;
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (autocompleteOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutocompleteIndex(prev => Math.min(prev + 1, autocompleteItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutocompleteIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertAutocomplete(autocompleteItems[autocompleteIndex]);
      } else if (e.key === 'Escape') {
        setAutocompleteOpen(false);
      }
    }

    // Auto-closing brackets
    if (enableBracketMatching && !readOnly) {
      const openBrackets = ['(', '[', '{'];
      const closeBrackets = { '(': ')', '[': ']', '{': '}' };
      
      if (openBrackets.includes(e.key)) {
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (start === end) {
          e.preventDefault();
          const newCode = code.slice(0, start) + e.key + closeBrackets[e.key as keyof typeof closeBrackets] + code.slice(end);
          setCode(newCode);
          onCodeChange?.(newCode);
          
          // Position cursor between brackets
          setTimeout(() => {
            textarea.setSelectionRange(start + 1, start + 1);
          }, 0);
        }
      }
    }
  };

  const insertAutocomplete = (item: AutocompleteItem) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const beforeCursor = code.substring(0, cursorPos);
    const afterCursor = code.substring(cursorPos);
    
    // Find the current word to replace
    const currentLineMatch = beforeCursor.split('\n').pop() || '';
    const wordMatch = currentLineMatch.match(/[\w\.]+$/);
    const wordStart = wordMatch ? cursorPos - wordMatch[0].length : cursorPos;
    
    const newCode = code.substring(0, wordStart) + item.value + afterCursor;
    setCode(newCode);
    onCodeChange?.(newCode);
    setAutocompleteOpen(false);
    
    // Position cursor appropriately
    const newCursorPos = wordStart + item.value.length;
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showSuccess('Copied!', 'Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showError('Failed to copy', 'Could not copy code to clipboard');
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const formatCode = () => {
    // Basic code formatting
    let formattedCode = code;
    
    // Add basic indentation for common structures
    const lines = formattedCode.split('\n');
    let indentLevel = 0;
    const indentStr = '    '; // 4 spaces
    
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for closing brackets
      if ([')', '}', ']'].some(char => trimmed.startsWith(char))) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const formatted = indentStr.repeat(indentLevel) + trimmed;
      
      // Increase indent for opening brackets or keywords
      if (['(', '{', '[', ':', 'if', 'for', 'while', 'def', 'class', 'function'].some(pattern => 
        trimmed.includes(pattern) && (trimmed.endsWith(':') || trimmed.includes('{') || trimmed.includes('[') || trimmed.includes('('))
      )) {
        indentLevel++;
      }
      
      return formatted;
    });
    
    const newCode = formattedLines.join('\n');
    setCode(newCode);
    onCodeChange?.(newCode);
    showSuccess('Formatted!', 'Code has been formatted');
  };

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'} ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl border ${isDark ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}>
      {/* Enhanced Header */}
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
              Ln {cursorPosition.line}, Col {cursorPosition.column}
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
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {!readOnly && (
              <>
                <button
                  onClick={formatCode}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                  title="Format code"
                >
                  <Zap className="w-4 h-4" />
                  <span>Format</span>
                </button>

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

            <button
              onClick={toggleFullscreen}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            
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
      <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 80px)' : height }}>
        <div className={`h-full ${getFontSize()}`}>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            placeholder="Write your code here..."
            className={`w-full h-full p-4 font-mono leading-relaxed focus:outline-none resize-none ${
              isDark 
                ? 'bg-gray-900 text-gray-100 placeholder-gray-500' 
                : 'bg-white text-gray-900 placeholder-gray-400'
            }`}
            style={{ 
              fontFamily: 'JetBrains Mono, Fira Code, Monaco, Cascadia Code, Roboto Mono, monospace',
              lineHeight: '1.6',
              tabSize: 2,
              paddingLeft: showLineNumbers ? '60px' : '20px'
            }}
            spellCheck={false}
          />
          
          {/* Line numbers */}
          {showLineNumbers && (
            <div className={`absolute left-0 top-0 bottom-0 w-14 overflow-hidden pointer-events-none border-r user-select-none ${
              isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`pt-4 pb-4 px-3 font-mono text-right ${getFontSize()} leading-relaxed ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
              style={{ lineHeight: '1.6' }}
              >
                {code.split('\n').map((_, index) => (
                  <div key={index + 1}>
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Autocomplete Dropdown */}
          {autocompleteOpen && (
            <div 
              ref={autocompleteRef}
              className={`absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg border shadow-lg ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
              style={{ 
                left: '60px', 
                top: `${(cursorPosition.line) * 1.6}em`
              }}
            >
              {autocompleteItems.map((item, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                    index === autocompleteIndex
                      ? isDark ? 'bg-purple-600/20 text-white' : 'bg-purple-100 text-purple-900'
                      : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => insertAutocomplete(item)}
                >
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <span className={`ml-2 text-xs px-1 rounded ${
                      isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  {item.description && (
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {item.description}
                    </span>
                  )}
                </div>
              ))}
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
        
        <div className="flex items-center space-x-4">
          {enableAutocomplete && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}>
              Autocomplete enabled
            </div>
          )}
          {enableBracketMatching && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
            }`}>
              Bracket matching
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;