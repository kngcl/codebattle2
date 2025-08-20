export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  testResults?: TestResult[];
}

export interface TestResult {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
  error?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  hidden?: boolean;
}

class CodeExecutionService {
  private apiUrl = '/api/execute'; // This would be your backend API

  // Mock execution for demo purposes
  async executeCode(
    code: string,
    language: string,
    testCases: TestCase[] = []
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Mock execution logic
      const result = await this.mockExecution(code, language, testCases);
      
      const endTime = performance.now();
      result.executionTime = endTime - startTime;
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: endTime - startTime
      };
    }
  }

  private async mockExecution(
    code: string,
    language: string,
    testCases: TestCase[]
  ): Promise<ExecutionResult> {
    // Basic validation
    if (!code.trim()) {
      return {
        success: false,
        error: 'No code provided',
        executionTime: 0
      };
    }

    // Mock different scenarios based on code content
    if (code.includes('syntax_error') || code.includes('invalid_syntax')) {
      return {
        success: false,
        error: `SyntaxError: invalid syntax (line 1)`,
        executionTime: 50
      };
    }

    if (code.includes('runtime_error')) {
      return {
        success: false,
        error: `RuntimeError: Something went wrong during execution`,
        executionTime: 200
      };
    }

    if (code.includes('infinite_loop')) {
      return {
        success: false,
        error: 'TimeoutError: Code execution exceeded time limit (5s)',
        executionTime: 5000
      };
    }

    // Mock successful execution with output
    let output = '';
    
    if (language === 'python') {
      if (code.includes('print')) {
        // Extract print statements for mock output
        const printMatches = code.match(/print\s*\([^)]*\)/g);
        if (printMatches) {
          output = printMatches
            .map(match => {
              const content = match.match(/print\s*\(\s*['"]?([^'"]*?)['"]?\s*\)/);
              return content ? content[1] : 'Hello, World!';
            })
            .join('\n');
        } else {
          output = 'Hello, World!';
        }
      }
    } else if (language === 'javascript') {
      if (code.includes('console.log')) {
        const logMatches = code.match(/console\.log\s*\([^)]*\)/g);
        if (logMatches) {
          output = logMatches
            .map(match => {
              const content = match.match(/console\.log\s*\(\s*['"]?([^'"]*?)['"]?\s*\)/);
              return content ? content[1] : 'Hello, World!';
            })
            .join('\n');
        } else {
          output = 'Hello, World!';
        }
      }
    }

    // Run test cases if provided
    const testResults: TestResult[] = [];
    if (testCases.length > 0) {
      for (const testCase of testCases) {
        const testStart = performance.now();
        
        // Mock test execution
        const actualOutput = this.mockTestExecution(code, language, testCase.input);
        const passed = actualOutput.trim() === testCase.expectedOutput.trim();
        
        const testEnd = performance.now();
        
        testResults.push({
          id: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          passed,
          executionTime: testEnd - testStart
        });
      }
    }

    const allTestsPassed = testResults.length === 0 || testResults.every(t => t.passed);

    return {
      success: allTestsPassed,
      output: output || (testResults.length > 0 ? 'Tests completed' : 'Code executed successfully'),
      executionTime: 100 + Math.random() * 400,
      memoryUsage: Math.floor(Math.random() * 50) + 10, // MB
      testResults
    };
  }

  private mockTestExecution(code: string, language: string, input: string): string {
    // Very basic mock logic for common problem patterns
    
    // Two Sum problem pattern
    if (code.includes('two_sum') || code.includes('twoSum')) {
      if (input.includes('[2,7,11,15]') && input.includes('9')) {
        return '[0,1]';
      }
      return '[0,1]'; // Default mock response
    }
    
    // Palindrome pattern
    if (code.includes('palindrome') || code.includes('isPalindrome')) {
      if (input.includes('racecar') || input.includes('level')) {
        return 'true';
      }
      if (input.includes('hello') || input.includes('world')) {
        return 'false';
      }
      return 'true';
    }
    
    // Fibonacci pattern
    if (code.includes('fibonacci') || code.includes('fib')) {
      const num = parseInt(input.match(/\d+/)?.[0] || '0');
      if (num <= 1) return num.toString();
      if (num === 2) return '1';
      if (num === 3) return '2';
      if (num === 5) return '5';
      return '8'; // Default for demo
    }
    
    // Reverse string pattern
    if (code.includes('reverse')) {
      const str = input.match(/["']([^"']*)["']/)?.[1];
      if (str) return str.split('').reverse().join('');
      return input.split('').reverse().join('');
    }
    
    // Array sum pattern
    if (code.includes('sum')) {
      const numbers = input.match(/\d+/g);
      if (numbers) {
        const sum = numbers.reduce((acc, num) => acc + parseInt(num), 0);
        return sum.toString();
      }
    }
    
    // Default: just return the input or a success message
    return input || 'Success';
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    return ['python', 'javascript', 'java', 'cpp', 'c', 'go', 'rust'];
  }

  // Validate code before execution
  validateCode(code: string, language: string): { valid: boolean; error?: string } {
    if (!code.trim()) {
      return { valid: false, error: 'Code cannot be empty' };
    }

    if (code.length > 50000) {
      return { valid: false, error: 'Code is too long (max 50,000 characters)' };
    }

    // Language-specific basic validation
    switch (language) {
      case 'python':
        // Check for basic Python syntax issues
        const pythonIssues = this.validatePython(code);
        if (pythonIssues) {
          return { valid: false, error: pythonIssues };
        }
        break;
      
      case 'javascript':
        // Check for basic JavaScript syntax issues
        const jsIssues = this.validateJavaScript(code);
        if (jsIssues) {
          return { valid: false, error: jsIssues };
        }
        break;
    }

    return { valid: true };
  }

  private validatePython(code: string): string | null {
    // Basic Python validation
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      
      // Check for basic indentation issues
      if (line.endsWith(':') && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (nextLine.trim() && !nextLine.startsWith('    ') && !nextLine.startsWith('\t')) {
          return `Indentation error after line ${i + 1}`;
        }
      }
    }
    
    return null;
  }

  private validateJavaScript(code: string): string | null {
    // Basic JavaScript validation
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      return 'Mismatched braces';
    }
    
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      return 'Mismatched parentheses';
    }
    
    return null;
  }
}

export const codeExecutionService = new CodeExecutionService();