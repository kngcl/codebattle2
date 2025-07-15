import React, { useState, useEffect } from 'react';
import { X, Play, Clock, Users, Trophy, Code, CheckCircle, AlertCircle } from 'lucide-react';
import CodeEditor from '../CodeEditor/CodeEditor';
import { Challenge, getStorageData } from '../../data/mockData';

interface TournamentCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: any;
  user: any;
  onSubmit: (code: string, language: string, challengeId: string) => void;
}

const TournamentCodeModal: React.FC<TournamentCodeModalProps> = ({
  isOpen,
  onClose,
  tournament,
  user,
  onSubmit
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  useEffect(() => {
    if (isOpen && tournament) {
      // Load first challenge
      const challenges = getStorageData('codebattle_challenges', []);
      const challengeId = tournament.challenges[currentChallengeIndex];
      const challenge = challenges.find((c: Challenge) => c.id === challengeId);
      setCurrentChallenge(challenge);
      
      // Set timer based on tournament duration
      const startTime = new Date(tournament.startDate).getTime();
      const endTime = new Date(tournament.endDate).getTime();
      const now = Date.now();
      
      if (now >= startTime && now <= endTime) {
        setTimeLeft(Math.floor((endTime - now) / 1000));
      }
    }
  }, [isOpen, tournament, currentChallengeIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (submittedCode: string, submittedLanguage: string) => {
    if (!currentChallenge) return;
    
    setIsSubmitting(true);
    setSubmissionResult(null);

    // Simulate submission processing
    setTimeout(() => {
      const testsPassed = Math.floor(Math.random() * currentChallenge.testCases.length) + 1;
      const totalTests = currentChallenge.testCases.length;
      const success = testsPassed === totalTests;
      const executionTime = Math.floor(Math.random() * 500) + 50;

      const result = {
        status: success ? 'Accepted' : 'Wrong Answer',
        message: success 
          ? 'All test cases passed! Moving to next challenge...' 
          : `${testsPassed} out of ${totalTests} test cases passed`,
        testsPassed,
        totalTests,
        executionTime,
        score: success ? 100 : Math.floor((testsPassed / totalTests) * 100)
      };

      setSubmissionResult(result);
      onSubmit(submittedCode, submittedLanguage, currentChallenge.id);

      // Move to next challenge if successful
      if (success && currentChallengeIndex < tournament.challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallengeIndex(currentChallengeIndex + 1);
          setCode('');
          setSubmissionResult(null);
        }, 2000);
      }

      setIsSubmitting(false);
    }, 2000);
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < tournament.challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setCode('');
      setSubmissionResult(null);
    }
  };

  const previousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
      setCode('');
      setSubmissionResult(null);
    }
  };

  if (!isOpen || !currentChallenge) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-7xl h-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div>
              <h2 className="text-xl font-bold text-white">{tournament.name}</h2>
              <p className="text-gray-400 text-sm">
                Challenge {currentChallengeIndex + 1} of {tournament.challenges.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-red-900 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-mono font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
            
            {/* Participants */}
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{tournament.currentParticipants} participants</span>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Left Panel - Problem */}
          <div className="w-1/2 bg-gray-900 border-r border-gray-700 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{currentChallenge.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentChallenge.difficulty === 'Easy' ? 'bg-green-900 text-green-400' :
                  currentChallenge.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-red-900 text-red-400'
                }`}>
                  {currentChallenge.difficulty}
                </span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {currentChallenge.description}
              </p>

              {/* Challenge Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Time Limit</span>
                  </div>
                  <p className="text-white font-semibold">{currentChallenge.timeLimit}ms</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Code className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Memory Limit</span>
                  </div>
                  <p className="text-white font-semibold">{currentChallenge.memoryLimit}MB</p>
                </div>
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Examples</h4>
                {currentChallenge.testCases.filter(tc => tc.isPublic).map((testCase, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-2">Example {index + 1}</h5>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Input:</p>
                        <pre className="bg-gray-700 p-2 rounded text-green-400 text-sm overflow-x-auto">
                          {testCase.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Output:</p>
                        <pre className="bg-gray-700 p-2 rounded text-green-400 text-sm overflow-x-auto">
                          {testCase.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={previousChallenge}
                  disabled={currentChallengeIndex === 0}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={nextChallenge}
                  disabled={currentChallengeIndex === tournament.challenges.length - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next Challenge
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 bg-gray-900 flex flex-col">
            <div className="flex-1 p-6">
              <div className="h-full">
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
              <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold">Submission Result</h4>
                  <div className="flex items-center space-x-2">
                    {submissionResult.status === 'Accepted' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      submissionResult.status === 'Accepted' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {submissionResult.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{submissionResult.message}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-2 rounded">
                    <p className="text-gray-400 text-xs">Tests Passed</p>
                    <p className="text-white font-semibold">
                      {submissionResult.testsPassed}/{submissionResult.totalTests}
                    </p>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <p className="text-gray-400 text-xs">Score</p>
                    <p className="text-white font-semibold">{submissionResult.score}%</p>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <p className="text-gray-400 text-xs">Time</p>
                    <p className="text-white font-semibold">{submissionResult.executionTime}ms</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSubmitting && (
              <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
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

export default TournamentCodeModal;