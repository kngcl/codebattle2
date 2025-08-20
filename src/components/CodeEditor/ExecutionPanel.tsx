import React, { useState } from 'react';
import { Play, Square, Clock, MemoryStick, CheckCircle, XCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ExecutionResult, TestResult, codeExecutionService } from '../../services/codeExecution';

interface ExecutionPanelProps {
  code: string;
  language: string;
  testCases?: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    description?: string;
    hidden?: boolean;
  }>;
  onExecutionStart?: () => void;
  onExecutionComplete?: (result: ExecutionResult) => void;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  code,
  language,
  testCases = [],
  onExecutionStart,
  onExecutionComplete
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'output' | 'tests' | 'debug'>('output');
  const [showHiddenTests, setShowHiddenTests] = useState(false);
  
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const executeCode = async () => {
    setIsExecuting(true);
    onExecutionStart?.();
    
    try {
      const result = await codeExecutionService.executeCode(code, language, testCases);
      setExecutionResult(result);
      onExecutionComplete?.(result);
      
      // Auto-switch to appropriate tab based on result
      if (result.testResults && result.testResults.length > 0) {
        setActiveTab('tests');
      } else {
        setActiveTab('output');
      }
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const stopExecution = () => {
    setIsExecuting(false);
    // In a real implementation, this would cancel the API request
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (success: boolean, small = false) => {
    const size = small ? 'w-3 h-3' : 'w-4 h-4';
    return success ? (
      <CheckCircle className={`${size} text-green-400`} />
    ) : (
      <XCircle className={`${size} text-red-400`} />
    );
  };

  const renderTestResult = (test: TestResult, index: number) => (
    <div
      key={test.id}
      className={`p-4 rounded-lg border ${
        test.passed
          ? isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
          : isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(test.passed, true)}
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Test {index + 1}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            {test.executionTime.toFixed(2)}ms
          </span>
        </div>
        {test.passed && <span className="text-xs text-green-500 font-medium">PASSED</span>}
        {!test.passed && <span className="text-xs text-red-500 font-medium">FAILED</span>}
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Input:</span>
          <div className={`mt-1 p-2 rounded font-mono text-xs ${
            isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
          }`}>
            {test.input || 'No input'}
          </div>
        </div>
        
        <div>
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Expected:</span>
          <div className={`mt-1 p-2 rounded font-mono text-xs ${
            isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
          }`}>
            {test.expectedOutput}
          </div>
        </div>
        
        <div>
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actual:</span>
          <div className={`mt-1 p-2 rounded font-mono text-xs ${
            test.passed
              ? isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
              : isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
          }`}>
            {test.actualOutput}
          </div>
        </div>
        
        {test.error && (
          <div>
            <span className={`font-medium text-red-400`}>Error:</span>
            <div className={`mt-1 p-2 rounded font-mono text-xs ${
              isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
            }`}>
              {test.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const visibleTests = executionResult?.testResults?.filter(test => {
    const testCase = testCases.find(tc => tc.id === test.id);
    return showHiddenTests || !testCase?.hidden;
  }) || [];

  const hiddenTestCount = (executionResult?.testResults?.length || 0) - visibleTests.length;

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={isExecuting ? stopExecution : executeCode}
              disabled={!code.trim()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isExecuting
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isExecuting ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Code</span>
                </>
              )}
            </button>

            {executionResult && (
              <div className="flex items-center space-x-4">
                {getStatusIcon(executionResult.success)}
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {executionResult.executionTime.toFixed(2)}ms
                  </span>
                </div>
                {executionResult.memoryUsage && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MemoryStick className="w-4 h-4 text-gray-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {executionResult.memoryUsage}MB
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {executionResult?.testResults && hiddenTestCount > 0 && (
            <button
              onClick={() => setShowHiddenTests(!showHiddenTests)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {showHiddenTests ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showHiddenTests ? 'Hide' : 'Show'} Hidden Tests ({hiddenTestCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        {['output', 'tests', 'debug'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-purple-500 text-purple-600'
                : isDark
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
            {tab === 'tests' && executionResult?.testResults && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                executionResult.testResults.every(t => t.passed)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {executionResult.testResults.filter(t => t.passed).length}/{executionResult.testResults.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
        {isExecuting && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Executing code...
              </span>
            </div>
          </div>
        )}

        {!isExecuting && !executionResult && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Play className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Click "Run Code" to execute your solution
              </p>
            </div>
          </div>
        )}

        {!isExecuting && executionResult && activeTab === 'output' && (
          <div>
            {executionResult.success ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-green-400">Execution Successful</span>
                </div>
                {executionResult.output && (
                  <div>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Output:</h4>
                    <pre className={`p-3 rounded-lg font-mono text-sm whitespace-pre-wrap ${
                      isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {executionResult.output}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="font-medium text-red-400">Execution Failed</span>
                </div>
                {executionResult.error && (
                  <div>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Error:</h4>
                    <pre className={`p-3 rounded-lg font-mono text-sm whitespace-pre-wrap ${
                      isDark ? 'bg-red-900/20 text-red-300 border border-red-800' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {executionResult.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!isExecuting && executionResult && activeTab === 'tests' && (
          <div className="space-y-4">
            {executionResult.testResults && executionResult.testResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Test Results
                  </h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        {executionResult.testResults.filter(t => t.passed).length} passed
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">
                        {executionResult.testResults.filter(t => !t.passed).length} failed
                      </span>
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {visibleTests.map((test, index) => renderTestResult(test, index))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  No test cases available
                </p>
              </div>
            )}
          </div>
        )}

        {!isExecuting && executionResult && activeTab === 'debug' && (
          <div className="space-y-4">
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Debug Information</h4>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Language:</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{language}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Execution Time:</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{executionResult.executionTime.toFixed(2)}ms</span>
                </div>
                {executionResult.memoryUsage && (
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Memory Usage:</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{executionResult.memoryUsage}MB</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Code Length:</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{code.length} characters</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Lines of Code:</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{code.split('\n').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionPanel;