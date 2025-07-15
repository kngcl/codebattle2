import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Challenge, getStorageData, setStorageData, Submission } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import { Clock, MemoryStick as Memory, Users, TrendingUp, ChevronLeft, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [submissionResult, setSubmissionResult] = useState<{
    status: string;
    message: string;
    testsPassed: number;
    totalTests: number;
    executionTime: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) {
      const challenges = getStorageData('codebattle_challenges', []);
      const foundChallenge = challenges.find((c: Challenge) => c.id === id);
      setChallenge(foundChallenge || null);
    }
  }, [id]);

  const handleSubmit = async (submittedCode: string, submittedLanguage: string) => {
    if (!isAuthenticated || !user || !challenge) {
      alert('Please login to submit solutions');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Simulate submission processing
    setTimeout(() => {
      const testsPassed = Math.floor(Math.random() * challenge.testCases.length) + 1;
      const totalTests = challenge.testCases.length;
      const success = testsPassed === totalTests;
      const executionTime = Math.floor(Math.random() * 500) + 50;

      const result = {
        status: success ? 'Accepted' : 'Wrong Answer',
        message: success 
          ? 'All test cases passed! Great job!' 
          : `${testsPassed} out of ${totalTests} test cases passed`,
        testsPassed,
        totalTests,
        executionTime
      };

      setSubmissionResult(result);

      // Save submission
      const submissions = getStorageData('codebattle_submissions', []);
      const newSubmission: Submission = {
        id: Date.now().toString(),
        challengeId: challenge.id,
        userId: user.id,
        code: submittedCode,
        language: submittedLanguage,
        status: result.status as any,
        score: success ? 100 : Math.floor((testsPassed / totalTests) * 100),
        submittedAt: new Date().toISOString(),
        executionTime
      };

      submissions.push(newSubmission);
      setStorageData('codebattle_submissions', submissions);

      // Update user stats if successful
      if (success) {
        const users = getStorageData('codebattle_users', []);
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex].solvedChallenges += 1;
          users[userIndex].rating += 25;
          setStorageData('codebattle_users', users);
        }
      }

      setIsSubmitting(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Wrong Answer':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-900 text-green-400';
      case 'Wrong Answer':
        return 'bg-red-900 text-red-400';
      default:
        return 'bg-yellow-900 text-yellow-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-900 text-green-400';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-400';
      case 'Hard':
        return 'bg-red-900 text-red-400';
      default:
        return 'bg-gray-900 text-gray-400';
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge not found</h2>
          <button
            onClick={() => navigate('/challenges')}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/challenges')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Challenges
              </button>
              <div className="h-6 w-px bg-gray-700" />
              <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Problem Description */}
          <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800">
            {/* Tabs */}
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'description'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'examples'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Examples
                </button>
                <button
                  onClick={() => setActiveTab('constraints')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'constraints'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Constraints
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Problem Description</h3>
                    <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Time Limit</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{challenge.timeLimit}ms</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Memory className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Memory Limit</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{challenge.memoryLimit}MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Submissions</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{challenge.submissionCount}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Success Rate</span>
                      </div>
                      <p className="text-lg font-semibold text-white">{challenge.successRate}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-6">
                  {challenge.testCases.filter(tc => tc.isPublic).map((testCase, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-3">Example {index + 1}</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-1">Input:</p>
                          <pre className="bg-gray-800 p-3 rounded text-sm text-green-400 overflow-x-auto">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-1">Output:</p>
                          <pre className="bg-gray-800 p-3 rounded text-sm text-green-400 overflow-x-auto">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'constraints' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Time Constraints</h4>
                    <p className="text-gray-300">Time limit: {challenge.timeLimit}ms</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Memory Constraints</h4>
                    <p className="text-gray-300">Memory limit: {challenge.memoryLimit}MB</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">General Constraints</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Solution must be implemented in one of the supported languages</li>
                      <li>• Code must handle all edge cases</li>
                      <li>• No external libraries allowed</li>
                      <li>• Solution must pass all test cases</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-800">
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Code Editor</h3>
              </div>
              <div className="p-6">
                <CodeEditor
                  initialCode={code}
                  language={language}
                  onCodeChange={setCode}
                  onSubmit={handleSubmit}
                  theme="dark"
                />
              </div>
            </div>

            {/* Submission Result */}
            {submissionResult && (
              <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Submission Result</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submissionResult.status)}`}>
                    {getStatusIcon(submissionResult.status)}
                    <span className="ml-1">{submissionResult.status}</span>
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-300">{submissionResult.message}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-3 rounded">
                      <p className="text-sm text-gray-400">Tests Passed</p>
                      <p className="text-lg font-semibold text-white">
                        {submissionResult.testsPassed}/{submissionResult.totalTests}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <p className="text-sm text-gray-400">Execution Time</p>
                      <p className="text-lg font-semibold text-white">
                        {submissionResult.executionTime}ms
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSubmitting && (
              <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                  <span className="text-gray-300">Running your code...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;