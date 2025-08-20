import React, { useState } from 'react';
import { 
  Play, Square, Clock, MemoryStick, CheckCircle, XCircle, AlertCircle, 
  Loader2, Eye, EyeOff, Activity, Cpu, HardDrive, BarChart3, 
  Bug, Zap, Code2, TrendingUp, AlertTriangle, Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { 
  advancedCodeExecutionService, 
  AdvancedExecutionResult, 
  ExecutionEnvironment,
  ProfilingResult,
  DebugInfo
} from '../../services/advancedCodeExecution';
import { TestCase } from '../../services/codeExecution';

interface AdvancedExecutionPanelProps {
  code: string;
  language: string;
  testCases?: TestCase[];
  onExecutionStart?: () => void;
  onExecutionComplete?: (result: AdvancedExecutionResult) => void;
}

const AdvancedExecutionPanel: React.FC<AdvancedExecutionPanelProps> = ({
  code,
  language,
  testCases = [],
  onExecutionStart,
  onExecutionComplete
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<AdvancedExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'output' | 'tests' | 'profiling' | 'debug' | 'metrics'>('output');
  const [selectedEnvironment, setSelectedEnvironment] = useState<ExecutionEnvironment | null>(null);
  const [executionOptions, setExecutionOptions] = useState({
    enableProfiling: true,
    enableDebugger: true,
    enableMetrics: true
  });
  const [showHiddenTests, setShowHiddenTests] = useState(false);
  
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const supportedEnvironments = advancedCodeExecutionService.getSupportedEnvironments(language);

  const executeCode = async () => {
    setIsExecuting(true);
    onExecutionStart?.();
    
    try {
      const result = await advancedCodeExecutionService.executeAdvanced(
        code,
        language,
        testCases,
        selectedEnvironment?.id,
        executionOptions
      );
      
      setExecutionResult(result);
      onExecutionComplete?.(result);
      
      // Auto-switch to appropriate tab based on result
      if (result.testResults && result.testResults.length > 0) {
        setActiveTab('tests');
      } else if (result.compilationResult && !result.compilationResult.success) {
        setActiveTab('output');
      } else if (result.profiling && executionOptions.enableProfiling) {
        setActiveTab('profiling');
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

  const renderProfilingTab = () => {
    if (!executionResult?.profiling) return null;
    
    const profiling = executionResult.profiling;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <MemoryStick className="w-4 h-4 text-blue-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Peak Memory</span>
            </div>
            <p className="text-2xl font-bold text-white">{profiling.memoryPeakUsage}MB</p>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-green-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>CPU Time</span>
            </div>
            <p className="text-2xl font-bold text-white">{profiling.cpuTime}ms</p>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>Instructions</span>
            </div>
            <p className="text-2xl font-bold text-white">{profiling.instructionCount.toLocaleString()}</p>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-yellow-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>Cache Hits</span>
            </div>
            <p className="text-2xl font-bold text-white">{profiling.cacheHits.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">
              {profiling.cacheMisses.toLocaleString()} misses
            </p>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-red-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>System Time</span>
            </div>
            <p className="text-2xl font-bold text-white">{profiling.systemTime}ms</p>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>Cache Efficiency</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {Math.round((profiling.cacheHits / (profiling.cacheHits + profiling.cacheMisses)) * 100)}%
            </p>
          </div>
        </div>
        
        {/* Performance Chart Placeholder */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Memory Efficiency</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    style={{ width: `${Math.min((profiling.memoryPeakUsage / executionResult.environment.memoryLimit) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {Math.round((profiling.memoryPeakUsage / executionResult.environment.memoryLimit) * 100)}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Execution Speed</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
                    style={{ width: `${Math.max(0, 100 - (profiling.cpuTime / 100))}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">
                  {profiling.cpuTime < 100 ? 'Fast' : profiling.cpuTime < 500 ? 'Good' : 'Slow'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDebugTab = () => {
    if (!executionResult?.debugInfo) return null;
    
    const debug = executionResult.debugInfo;
    
    return (
      <div className="space-y-6">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Line Execution Coverage</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Array.from(debug.lineExecutionCounts.entries()).map(([lineNumber, count]) => (
              <div key={lineNumber} className="flex items-center justify-between">
                <span className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Line {lineNumber}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white w-8 text-right">{count}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Call Stack</h4>
          <div className="space-y-2">
            {debug.callStack.map((frame, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded">{index + 1}</span>
                <span className={`font-mono text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{frame}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Execution Trace</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {debug.executionTrace.map((trace, index) => (
              <div key={index} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {trace}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMetricsTab = () => {
    if (!executionResult?.codeMetrics) return null;
    
    const metrics = executionResult.codeMetrics;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Lines of Code</span>
            </div>
            <p className="text-2xl font-bold text-white">{metrics.linesOfCode}</p>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>Complexity</span>
            </div>
            <p className="text-2xl font-bold text-white">{metrics.cyclomaticComplexity}</p>
          </div>
          
          <div className={`p-4 rounded-xl border ${
            metrics.maintainabilityIndex > 70 
              ? isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
              : metrics.maintainabilityIndex > 40
              ? isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'
              : isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`w-4 h-4 ${
                metrics.maintainabilityIndex > 70 ? 'text-green-400' :
                metrics.maintainabilityIndex > 40 ? 'text-yellow-400' : 'text-red-400'
              }`} />
              <span className={`text-sm font-medium ${
                metrics.maintainabilityIndex > 70 
                  ? isDark ? 'text-green-300' : 'text-green-700'
                  : metrics.maintainabilityIndex > 40
                  ? isDark ? 'text-yellow-300' : 'text-yellow-700'
                  : isDark ? 'text-red-300' : 'text-red-700'
              }`}>Maintainability</span>
            </div>
            <p className="text-2xl font-bold text-white">{metrics.maintainabilityIndex}/100</p>
          </div>
          
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>Tech Debt</span>
            </div>
            <p className="text-2xl font-bold text-white">{metrics.technicalDebt} min</p>
          </div>
        </div>
        
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Code Quality Analysis</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Code Quality Score</span>
                <span className="text-white font-medium">
                  {Math.round((metrics.maintainabilityIndex + (100 - metrics.cyclomaticComplexity * 5)) / 2)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    metrics.maintainabilityIndex > 70 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : metrics.maintainabilityIndex > 40
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${Math.round((metrics.maintainabilityIndex + (100 - metrics.cyclomaticComplexity * 5)) / 2)}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quality Indicators</h5>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-2 ${
                    metrics.cyclomaticComplexity <= 10 ? 'text-green-400' : 
                    metrics.cyclomaticComplexity <= 20 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {metrics.cyclomaticComplexity <= 10 ? <CheckCircle className="w-3 h-3" /> : 
                     metrics.cyclomaticComplexity <= 20 ? <AlertCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Complexity: {metrics.cyclomaticComplexity <= 10 ? 'Low' : metrics.cyclomaticComplexity <= 20 ? 'Medium' : 'High'}
                  </li>
                  <li className={`flex items-center gap-2 ${
                    metrics.linesOfCode <= 50 ? 'text-green-400' : 
                    metrics.linesOfCode <= 100 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {metrics.linesOfCode <= 50 ? <CheckCircle className="w-3 h-3" /> : 
                     metrics.linesOfCode <= 100 ? <AlertCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Size: {metrics.linesOfCode <= 50 ? 'Concise' : metrics.linesOfCode <= 100 ? 'Moderate' : 'Large'}
                  </li>
                  <li className={`flex items-center gap-2 ${
                    metrics.maintainabilityIndex > 70 ? 'text-green-400' : 
                    metrics.maintainabilityIndex > 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {metrics.maintainabilityIndex > 70 ? <CheckCircle className="w-3 h-3" /> : 
                     metrics.maintainabilityIndex > 40 ? <AlertCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Maintainability: {metrics.maintainabilityIndex > 70 ? 'High' : metrics.maintainabilityIndex > 40 ? 'Medium' : 'Low'}
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recommendations</h5>
                <ul className={`space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metrics.cyclomaticComplexity > 10 && (
                    <li>• Consider breaking down complex functions</li>
                  )}
                  {metrics.linesOfCode > 100 && (
                    <li>• Consider splitting into smaller modules</li>
                  )}
                  {metrics.maintainabilityIndex < 70 && (
                    <li>• Add comments and improve readability</li>
                  )}
                  {metrics.technicalDebt > 10 && (
                    <li>• Address code quality issues</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const visibleTests = executionResult?.testResults?.filter(test => {
    const testCase = testCases.find(tc => tc.id === test.id);
    return showHiddenTests || !testCase?.hidden;
  }) || [];

  const hiddenTestCount = (executionResult?.testResults?.length || 0) - visibleTests.length;

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Header with Environment Selection */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-3">
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
                  <span>Run Advanced</span>
                </>
              )}
            </button>

            {supportedEnvironments.length > 0 && (
              <select
                value={selectedEnvironment?.id || ''}
                onChange={(e) => {
                  const env = supportedEnvironments.find(env => env.id === e.target.value);
                  setSelectedEnvironment(env || null);
                }}
                className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">{language} (default)</option>
                {supportedEnvironments.map(env => (
                  <option key={env.id} value={env.id}>
                    {env.version} ({env.timeout/1000}s, {env.memoryLimit}MB)
                  </option>
                ))}
              </select>
            )}

            {executionResult && (
              <div className="flex items-center space-x-4">
                {getStatusIcon(executionResult.success)}
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {executionResult.executionTime.toFixed(2)}ms
                  </span>
                </div>
                {executionResult.profiling && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MemoryStick className="w-4 h-4 text-gray-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {executionResult.profiling.memoryPeakUsage}MB
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Execution Options */}
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={executionOptions.enableProfiling}
                  onChange={(e) => setExecutionOptions(prev => ({ ...prev, enableProfiling: e.target.checked }))}
                  className="rounded"
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Profiling</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={executionOptions.enableDebugger}
                  onChange={(e) => setExecutionOptions(prev => ({ ...prev, enableDebugger: e.target.checked }))}
                  className="rounded"
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Debug</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={executionOptions.enableMetrics}
                  onChange={(e) => setExecutionOptions(prev => ({ ...prev, enableMetrics: e.target.checked }))}
                  className="rounded"
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Metrics</span>
              </label>
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
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        {[
          { key: 'output', label: 'Output', icon: Play },
          { key: 'tests', label: 'Tests', icon: CheckCircle },
          ...(executionResult?.profiling ? [{ key: 'profiling', label: 'Profiling', icon: Activity }] : []),
          ...(executionResult?.debugInfo ? [{ key: 'debug', label: 'Debug', icon: Bug }] : []),
          ...(executionResult?.codeMetrics ? [{ key: 'metrics', label: 'Metrics', icon: BarChart3 }] : [])
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-purple-500 text-purple-600'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
              {tab.key === 'tests' && executionResult?.testResults && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  executionResult.testResults.every(t => t.passed)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {executionResult.testResults.filter(t => t.passed).length}/{executionResult.testResults.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 min-h-[200px] max-h-[500px] overflow-y-auto">
        {isExecuting && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Executing with advanced analysis...
              </span>
            </div>
          </div>
        )}

        {!isExecuting && !executionResult && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Zap className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Click "Run Advanced" to execute with profiling, debugging, and metrics
              </p>
            </div>
          </div>
        )}

        {!isExecuting && executionResult && (
          <>
            {activeTab === 'output' && (
              <div>
                {/* Compilation Results */}
                {executionResult.compilationResult && (
                  <div className="mb-4">
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Compilation</h4>
                    {executionResult.compilationResult.success ? (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Compiled successfully ({executionResult.compilationResult.compilationTime.toFixed(2)}ms)</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-red-400">
                          <XCircle className="w-4 h-4" />
                          <span>Compilation failed</span>
                        </div>
                        {executionResult.compilationResult.errors.map((error, index) => (
                          <div key={index} className={`p-2 rounded text-sm ${isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'}`}>
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {executionResult.compilationResult.warnings.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {executionResult.compilationResult.warnings.map((warning, index) => (
                          <div key={index} className={`p-2 rounded text-sm ${isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-800'}`}>
                            Warning: {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Execution Results */}
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

            {activeTab === 'tests' && (
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
                      {visibleTests.map((test, index) => (
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
                      ))}
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

            {activeTab === 'profiling' && renderProfilingTab()}
            {activeTab === 'debug' && renderDebugTab()}
            {activeTab === 'metrics' && renderMetricsTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedExecutionPanel;