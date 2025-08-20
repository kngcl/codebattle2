import { ExecutionResult, TestResult, TestCase, codeExecutionService } from './codeExecution';

export interface ExecutionEnvironment {
  id: string;
  language: string;
  version: string;
  timeout: number;
  memoryLimit: number;
  enableDebugger: boolean;
  enableProfiling: boolean;
}

export interface ProfilingResult {
  memoryPeakUsage: number;
  cpuTime: number;
  systemTime: number;
  instructionCount: number;
  cacheHits: number;
  cacheMisses: number;
}

export interface DebugInfo {
  lineExecutionCounts: Map<number, number>;
  variableStates: Map<string, any[]>;
  callStack: string[];
  executionTrace: string[];
}

export interface AdvancedExecutionResult extends ExecutionResult {
  environment: ExecutionEnvironment;
  profiling?: ProfilingResult;
  debugInfo?: DebugInfo;
  compilationResult?: {
    success: boolean;
    warnings: string[];
    errors: string[];
    compilationTime: number;
  };
  codeMetrics?: {
    linesOfCode: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    technicalDebt: number;
  };
}

export interface BatchExecutionRequest {
  id: string;
  code: string;
  language: string;
  testCases: TestCase[];
  environment: ExecutionEnvironment;
  priority: 'low' | 'normal' | 'high';
}

export interface BatchExecutionResult {
  requestId: string;
  results: AdvancedExecutionResult[];
  totalExecutionTime: number;
  queueTime: number;
  status: 'completed' | 'failed' | 'timeout' | 'cancelled';
}

class AdvancedCodeExecutionService {
  private executionQueue: BatchExecutionRequest[] = [];
  private activeExecutions = new Map<string, Promise<BatchExecutionResult>>();
  private supportedEnvironments = new Map<string, ExecutionEnvironment[]>();
  
  constructor() {
    this.initializeSupportedEnvironments();
  }

  private initializeSupportedEnvironments() {
    // Python environments
    this.supportedEnvironments.set('python', [
      {
        id: 'python-3.9',
        language: 'python',
        version: '3.9.18',
        timeout: 5000,
        memoryLimit: 128,
        enableDebugger: true,
        enableProfiling: true
      },
      {
        id: 'python-3.10',
        language: 'python',
        version: '3.10.12',
        timeout: 5000,
        memoryLimit: 128,
        enableDebugger: true,
        enableProfiling: true
      },
      {
        id: 'python-3.11',
        language: 'python',
        version: '3.11.8',
        timeout: 5000,
        memoryLimit: 128,
        enableDebugger: true,
        enableProfiling: true
      }
    ]);

    // JavaScript/Node.js environments
    this.supportedEnvironments.set('javascript', [
      {
        id: 'node-18',
        language: 'javascript',
        version: '18.19.0',
        timeout: 3000,
        memoryLimit: 64,
        enableDebugger: true,
        enableProfiling: true
      },
      {
        id: 'node-20',
        language: 'javascript',
        version: '20.11.0',
        timeout: 3000,
        memoryLimit: 64,
        enableDebugger: true,
        enableProfiling: true
      }
    ]);

    // Java environments
    this.supportedEnvironments.set('java', [
      {
        id: 'openjdk-11',
        language: 'java',
        version: '11.0.21',
        timeout: 8000,
        memoryLimit: 256,
        enableDebugger: false,
        enableProfiling: true
      },
      {
        id: 'openjdk-17',
        language: 'java',
        version: '17.0.9',
        timeout: 8000,
        memoryLimit: 256,
        enableDebugger: false,
        enableProfiling: true
      }
    ]);

    // C++ environments
    this.supportedEnvironments.set('cpp', [
      {
        id: 'gcc-11',
        language: 'cpp',
        version: '11.4.0',
        timeout: 10000,
        memoryLimit: 512,
        enableDebugger: false,
        enableProfiling: true
      },
      {
        id: 'clang-14',
        language: 'cpp',
        version: '14.0.0',
        timeout: 10000,
        memoryLimit: 512,
        enableDebugger: false,
        enableProfiling: true
      }
    ]);
  }

  async executeAdvanced(
    code: string,
    language: string,
    testCases: TestCase[] = [],
    environmentId?: string,
    options: {
      enableProfiling?: boolean;
      enableDebugger?: boolean;
      enableMetrics?: boolean;
    } = {}
  ): Promise<AdvancedExecutionResult> {
    const environment = this.getEnvironment(language, environmentId);
    
    try {
      const startTime = performance.now();
      
      // Step 1: Code analysis and compilation (if needed)
      const compilationResult = await this.compileCode(code, environment);
      
      if (!compilationResult.success) {
        return {
          success: false,
          error: compilationResult.errors.join('\n'),
          executionTime: performance.now() - startTime,
          environment,
          compilationResult
        };
      }

      // Step 2: Execute with basic functionality
      const basicResult = await codeExecutionService.executeCode(code, language, testCases);
      
      // Step 3: Enhanced execution with profiling and debugging
      const enhancedResult: AdvancedExecutionResult = {
        ...basicResult,
        environment,
        compilationResult
      };

      // Add profiling if enabled
      if (options.enableProfiling && environment.enableProfiling) {
        enhancedResult.profiling = await this.generateProfilingData(code, language, environment);
      }

      // Add debugging information if enabled
      if (options.enableDebugger && environment.enableDebugger) {
        enhancedResult.debugInfo = await this.generateDebugInfo(code, language, environment);
      }

      // Add code metrics if enabled
      if (options.enableMetrics) {
        enhancedResult.codeMetrics = this.calculateCodeMetrics(code, language);
      }

      return enhancedResult;

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Advanced execution failed',
        executionTime: 0,
        environment
      };
    }
  }

  async executeBatch(requests: BatchExecutionRequest[]): Promise<BatchExecutionResult[]> {
    const results: BatchExecutionResult[] = [];
    
    // Sort by priority
    const sortedRequests = requests.sort((a, b) => {
      const priorityWeight = { 'high': 3, 'normal': 2, 'low': 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    for (const request of sortedRequests) {
      const queueStartTime = performance.now();
      
      try {
        const executionResult = await this.executeAdvanced(
          request.code,
          request.language,
          request.testCases,
          request.environment.id,
          {
            enableProfiling: request.environment.enableProfiling,
            enableDebugger: request.environment.enableDebugger,
            enableMetrics: true
          }
        );

        results.push({
          requestId: request.id,
          results: [executionResult],
          totalExecutionTime: executionResult.executionTime,
          queueTime: performance.now() - queueStartTime,
          status: 'completed'
        });
      } catch (error) {
        results.push({
          requestId: request.id,
          results: [],
          totalExecutionTime: 0,
          queueTime: performance.now() - queueStartTime,
          status: 'failed'
        });
      }
    }

    return results;
  }

  async executeWithStressTest(
    code: string,
    language: string,
    testCases: TestCase[],
    stressTestConfig: {
      iterations: number;
      concurrency: number;
      memoryPressure: boolean;
    }
  ): Promise<{
    results: AdvancedExecutionResult[];
    stressMetrics: {
      averageExecutionTime: number;
      maxExecutionTime: number;
      minExecutionTime: number;
      successRate: number;
      memoryEfficiency: number;
      performanceVariance: number;
    };
  }> {
    const results: AdvancedExecutionResult[] = [];
    const executionTimes: number[] = [];
    let successCount = 0;
    
    // Run stress test iterations
    for (let i = 0; i < stressTestConfig.iterations; i++) {
      try {
        const result = await this.executeAdvanced(code, language, testCases, undefined, {
          enableProfiling: true,
          enableMetrics: true
        });
        
        results.push(result);
        executionTimes.push(result.executionTime);
        
        if (result.success) {
          successCount++;
        }
      } catch (error) {
        // Handle execution failures in stress test
        results.push({
          success: false,
          error: 'Stress test execution failed',
          executionTime: 0,
          environment: this.getEnvironment(language)
        });
      }
    }

    // Calculate stress test metrics
    const avgTime = executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length;
    const maxTime = Math.max(...executionTimes);
    const minTime = Math.min(...executionTimes);
    const variance = executionTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / executionTimes.length;
    
    const avgMemory = results
      .filter(r => r.profiling)
      .reduce((sum, r) => sum + (r.profiling?.memoryPeakUsage || 0), 0) / results.length;

    return {
      results,
      stressMetrics: {
        averageExecutionTime: avgTime,
        maxExecutionTime: maxTime,
        minExecutionTime: minTime,
        successRate: (successCount / stressTestConfig.iterations) * 100,
        memoryEfficiency: avgMemory > 0 ? (1 / avgMemory) * 100 : 100,
        performanceVariance: Math.sqrt(variance)
      }
    };
  }

  getSupportedEnvironments(language?: string): ExecutionEnvironment[] {
    if (language) {
      return this.supportedEnvironments.get(language) || [];
    }
    
    const allEnvironments: ExecutionEnvironment[] = [];
    for (const envs of this.supportedEnvironments.values()) {
      allEnvironments.push(...envs);
    }
    return allEnvironments;
  }

  private getEnvironment(language: string, environmentId?: string): ExecutionEnvironment {
    const environments = this.supportedEnvironments.get(language) || [];
    
    if (environmentId) {
      const env = environments.find(e => e.id === environmentId);
      if (env) return env;
    }
    
    // Return default environment for language
    return environments[0] || {
      id: `${language}-default`,
      language,
      version: '1.0.0',
      timeout: 5000,
      memoryLimit: 128,
      enableDebugger: false,
      enableProfiling: false
    };
  }

  private async compileCode(code: string, environment: ExecutionEnvironment): Promise<{
    success: boolean;
    warnings: string[];
    errors: string[];
    compilationTime: number;
  }> {
    const startTime = performance.now();
    
    // Mock compilation process
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));
    
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Mock syntax checking
    if (code.includes('syntax_error')) {
      errors.push('SyntaxError: invalid syntax');
    }
    
    if (code.includes('warning_unused')) {
      warnings.push('Warning: unused variable detected');
    }
    
    // Mock language-specific checks
    switch (environment.language) {
      case 'java':
        if (!code.includes('public class') && !code.includes('class ')) {
          errors.push('Error: No public class found');
        }
        break;
      case 'cpp':
        if (!code.includes('#include') && code.includes('cout')) {
          errors.push('Error: iostream not included');
        }
        break;
    }
    
    return {
      success: errors.length === 0,
      warnings,
      errors,
      compilationTime: performance.now() - startTime
    };
  }

  private async generateProfilingData(
    code: string,
    language: string,
    environment: ExecutionEnvironment
  ): Promise<ProfilingResult> {
    // Mock profiling data generation
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    return {
      memoryPeakUsage: Math.floor(Math.random() * environment.memoryLimit * 0.8) + 10,
      cpuTime: Math.floor(Math.random() * 1000) + 50,
      systemTime: Math.floor(Math.random() * 100) + 10,
      instructionCount: Math.floor(code.length * 10 + Math.random() * 1000),
      cacheHits: Math.floor(Math.random() * 10000),
      cacheMisses: Math.floor(Math.random() * 1000)
    };
  }

  private async generateDebugInfo(
    code: string,
    language: string,
    environment: ExecutionEnvironment
  ): Promise<DebugInfo> {
    // Mock debug information generation
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 80));
    
    const lines = code.split('\n');
    const lineExecutionCounts = new Map<number, number>();
    
    // Mock line execution counts
    lines.forEach((line, index) => {
      if (line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('//')) {
        lineExecutionCounts.set(index + 1, Math.floor(Math.random() * 10) + 1);
      }
    });
    
    return {
      lineExecutionCounts,
      variableStates: new Map(),
      callStack: ['main()', 'function1()', 'function2()'],
      executionTrace: [
        'Execution started',
        'Variable initialization',
        'Loop iteration 1',
        'Loop iteration 2',
        'Function call',
        'Return statement',
        'Execution completed'
      ]
    };
  }

  private calculateCodeMetrics(code: string, language: string): {
    linesOfCode: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    technicalDebt: number;
  } {
    const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('//'));
    const linesOfCode = lines.length;
    
    // Mock complexity calculation
    const complexityKeywords = ['if', 'else', 'while', 'for', 'switch', 'case', 'catch', 'try', '&&', '||'];
    let complexity = 1; // Base complexity
    
    complexityKeywords.forEach(keyword => {
      const matches = code.match(new RegExp(keyword, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    });
    
    // Mock maintainability index (0-100, higher is better)
    const maintainabilityIndex = Math.max(0, 100 - (linesOfCode * 0.5) - (complexity * 2) + Math.random() * 20);
    
    // Mock technical debt (minutes to fix issues)
    const technicalDebt = Math.floor(complexity * 2 + (linesOfCode > 50 ? (linesOfCode - 50) * 0.5 : 0));
    
    return {
      linesOfCode,
      cyclomaticComplexity: complexity,
      maintainabilityIndex: Math.floor(maintainabilityIndex),
      technicalDebt
    };
  }
}

export const advancedCodeExecutionService = new AdvancedCodeExecutionService();