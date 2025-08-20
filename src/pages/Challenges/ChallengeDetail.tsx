import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Challenge, getStorageData, setStorageData, Submission } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import AdvancedCodeEditor from '../../components/CodeEditor/AdvancedCodeEditor';
import ExecutionPanel from '../../components/CodeEditor/ExecutionPanel';
import EditorSettingsModal from '../../components/Settings/EditorSettingsModal';
import CollaborativeCodeEditor from '../../components/Collaboration/CollaborativeCodeEditor';
import { useEditorSettings } from '../../hooks/useEditorSettings';
import { PageLoader, InlineLoader } from '../../components/Loaders';
import { 
  Clock, 
  MemoryStick as Memory, 
  Users, 
  TrendingUp, 
  ChevronLeft, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Code,
  Trophy,
  Zap,
  FileCode,
  Terminal,
  Copy,
  ChevronRight,
  Brain,
  Sparkles,
  Target,
  Award,
  Hash,
  BookOpen,
  TestTube,
  Cpu,
  HardDrive,
  Activity,
  BarChart,
  Tags,
  Users as UsersIcon
} from 'lucide-react';

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useEditorSettings();
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
  const [isLoading, setIsLoading] = useState(true);
  const [copiedExample, setCopiedExample] = useState<number | null>(null);
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [collaborativeMode, setCollaborativeMode] = useState(false);

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const challenges = getStorageData('codebattle_challenges', []);
        const foundChallenge = challenges.find((c: Challenge) => c.id === id);
        setChallenge(foundChallenge || null);
        setIsLoading(false);
      }, 500);
    }
  }, [id]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(index);
    setTimeout(() => setCopiedExample(null), 2000);
  };

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

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return {
          bg: 'from-green-600 to-emerald-600',
          text: 'text-green-400',
          border: 'border-green-500/30',
          icon: Target
        };
      case 'Medium':
        return {
          bg: 'from-yellow-600 to-orange-600',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
          icon: Brain
        };
      case 'Hard':
        return {
          bg: 'from-red-600 to-pink-600',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: Trophy
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: Code
        };
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900/60 rounded-2xl mb-6">
            <AlertCircle className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Challenge not found</h2>
          <p className="text-gray-400 mb-6">The challenge you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/challenges')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const difficultyStyle = getDifficultyStyle(challenge.difficulty);
  const DifficultyIcon = difficultyStyle.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            >
              <div className="w-1 h-1 bg-purple-500/20 rounded-full blur-sm"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Challenges</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 bg-gradient-to-r ${difficultyStyle.bg} rounded-xl shadow-lg`}>
                  <DifficultyIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {challenge.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${difficultyStyle.bg} bg-opacity-20 ${difficultyStyle.text} ${difficultyStyle.border} border`}>
                      <Sparkles className="w-3 h-3" />
                      {challenge.difficulty}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 text-sm">{challenge.category}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="text-center px-6 py-3 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{challenge.submissionCount}</span>
                </div>
                <p className="text-xs text-gray-400">Submissions</p>
              </div>
              <div className="text-center px-6 py-3 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-2xl font-bold text-white">{challenge.successRate}%</span>
                </div>
                <p className="text-xs text-gray-400">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
              {/* Tabs */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
                <nav className="flex gap-1 p-1">
                  {[
                    { key: 'description', label: 'Description', icon: BookOpen },
                    { key: 'examples', label: 'Examples', icon: TestTube },
                    { key: 'constraints', label: 'Constraints', icon: Target }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                        activeTab === tab.key
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FileCode className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Problem Description</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                        <div className="relative bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <Cpu className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-gray-300">Time Limit</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{challenge.timeLimit}<span className="text-sm text-gray-400 ml-1">ms</span></p>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                        <div className="relative bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <HardDrive className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-gray-300">Memory Limit</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{challenge.memoryLimit}<span className="text-sm text-gray-400 ml-1">MB</span></p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tags className="w-5 h-5 text-pink-400" />
                        <h4 className="text-sm font-medium text-gray-300">Tags</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {challenge.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-default"
                          >
                            <Hash className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'examples' && (
                  <div className="space-y-6 animate-fade-in">
                    {challenge.testCases.filter(tc => tc.isPublic).map((testCase, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity"></div>
                        <div className="relative border border-gray-700 hover:border-purple-500/50 rounded-xl p-5 transition-all bg-gray-800/30">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-white flex items-center gap-2">
                              <TestTube className="w-4 h-4 text-purple-400" />
                              Example {index + 1}
                            </h4>
                            <button
                              onClick={() => copyToClipboard(`${testCase.input}\n${testCase.expectedOutput}`, index)}
                              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                            >
                              {copiedExample === index ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Terminal className="w-4 h-4 text-green-400" />
                                <p className="text-sm font-medium text-gray-300">Input:</p>
                              </div>
                              <pre className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg text-sm text-green-400 overflow-x-auto font-mono">
                                {testCase.input}
                              </pre>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <ChevronRight className="w-4 h-4 text-blue-400" />
                                <p className="text-sm font-medium text-gray-300">Expected Output:</p>
                              </div>
                              <pre className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg text-sm text-blue-400 overflow-x-auto font-mono">
                                {testCase.expectedOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'constraints' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-5 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <h4 className="font-semibold text-white">Time Constraints</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Maximum Execution Time</span>
                          <span className="text-white font-bold">{challenge.timeLimit}ms</span>
                        </div>
                        <p className="text-sm text-gray-400">Your solution must complete within this time limit for all test cases.</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-5 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Memory className="w-5 h-5 text-purple-400" />
                        <h4 className="font-semibold text-white">Memory Constraints</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Maximum Memory Usage</span>
                          <span className="text-white font-bold">{challenge.memoryLimit}MB</span>
                        </div>
                        <p className="text-sm text-gray-400">Your solution must not exceed this memory limit during execution.</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-xl p-5 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        <h4 className="font-semibold text-white">General Constraints</h4>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Solution must be implemented in one of the supported languages',
                          'Code must handle all edge cases correctly',
                          'No external libraries allowed (use standard libraries only)',
                          'Solution must pass all test cases to be accepted',
                          'Input/output format must match exactly as specified'
                        ].map((constraint, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300">
                            <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Challenge Statistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Total Submissions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{challenge.submissionCount}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{challenge.successRate}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Difficulty Progress</span>
                  <span className="text-gray-400">{challenge.successRate}% solved</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${difficultyStyle.bg} rounded-full transition-all`}
                    style={{ width: `${challenge.successRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Solution Editor</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCollaborativeMode(!collaborativeMode)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          collaborativeMode
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
                        }`}
                        title={collaborativeMode ? 'Disable Collaboration' : 'Enable Collaboration'}
                      >
                        <UsersIcon className="w-4 h-4" />
                        <span className="text-sm">{collaborativeMode ? 'Collaborative' : 'Solo'}</span>
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                        title="Editor Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  {collaborativeMode ? (
                    <CollaborativeCodeEditor
                      challengeId={challenge?.id || ''}
                      userId={user?.id || 'guest'}
                      initialCode={code}
                      language={language}
                      onCodeChange={setCode}
                      onSubmit={(submittedCode, submittedLanguage) => {
                        setShowExecutionPanel(true);
                        handleSubmit(submittedCode, submittedLanguage);
                      }}
                      height={showExecutionPanel ? '300px' : '500px'}
                    />
                  ) : (
                    <AdvancedCodeEditor
                      initialCode={code}
                      language={language}
                      onCodeChange={setCode}
                      onSubmit={(submittedCode, submittedLanguage) => {
                        setShowExecutionPanel(true);
                        handleSubmit(submittedCode, submittedLanguage);
                      }}
                      height={showExecutionPanel ? '300px' : '500px'}
                      fontSize={settings.fontSize}
                      showLineNumbers={settings.showLineNumbers}
                      enableAutocomplete={settings.enableAutocomplete}
                      enableBracketMatching={settings.enableBracketMatching}
                      enableCodeFolding={settings.enableCodeFolding}
                    />
                  )}
                  
                  {showExecutionPanel && !collaborativeMode && (
                    <ExecutionPanel
                      code={code}
                      language={language}
                      testCases={challenge?.testCases?.map(tc => ({
                        id: tc.id || String(challenge.testCases.indexOf(tc)),
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        description: `Test case ${challenge.testCases.indexOf(tc) + 1}`,
                        hidden: !tc.isPublic
                      })) || []}
                      onExecutionStart={() => setIsSubmitting(true)}
                      onExecutionComplete={(result) => {
                        setIsSubmitting(false);
                        const testsPassed = result.testResults?.filter(t => t.passed).length || 0;
                        const totalTests = result.testResults?.length || 0;
                        setSubmissionResult({
                          status: result.success ? 'Accepted' : 'Wrong Answer',
                          message: result.success 
                            ? 'All test cases passed! Great job!' 
                            : result.error || `${testsPassed} out of ${totalTests} test cases passed`,
                          testsPassed,
                          totalTests,
                          executionTime: result.executionTime
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Submission Result */}
            {submissionResult && (
              <div className={`relative animate-fade-in ${submissionResult.status === 'Accepted' ? 'group' : ''}`}>
                {submissionResult.status === 'Accepted' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                )}
                <div className={`relative bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border ${
                  submissionResult.status === 'Accepted' ? 'border-green-500/50' : 'border-red-500/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Submission Result
                    </h3>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(submissionResult.status)}`}>
                      {getStatusIcon(submissionResult.status)}
                      <span>{submissionResult.status}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${
                      submissionResult.status === 'Accepted' 
                        ? 'bg-green-900/20 border border-green-500/30' 
                        : 'bg-red-900/20 border border-red-500/30'
                    }`}>
                      <p className="text-white font-medium">{submissionResult.message}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <p className="text-sm text-gray-400">Tests Passed</p>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {submissionResult.testsPassed}<span className="text-gray-400">/{submissionResult.totalTests}</span>
                        </p>
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{ width: `${(submissionResult.testsPassed / submissionResult.totalTests) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <p className="text-sm text-gray-400">Execution Time</p>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {submissionResult.executionTime}<span className="text-sm text-gray-400 ml-1">ms</span>
                        </p>
                        <div className="mt-2">
                          <span className={`text-xs ${
                            submissionResult.executionTime < 100 ? 'text-green-400' :
                            submissionResult.executionTime < 300 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {submissionResult.executionTime < 100 ? 'Excellent' :
                             submissionResult.executionTime < 300 ? 'Good' : 'Slow'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSubmitting && (
              <div className="relative animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold mb-2">Running your solution...</p>
                      <p className="text-gray-400 text-sm">Testing against {challenge.testCases.length} test cases</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <InlineLoader />
                      <span className="text-sm text-gray-400">Please wait</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-2xl shadow-purple-500/25 flex items-center justify-center text-white transition-all hover:scale-110 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Code className="w-6 h-6 group-hover:animate-pulse" />
      </button>
      
      {/* Settings Modal */}
      <EditorSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default ChallengeDetail;