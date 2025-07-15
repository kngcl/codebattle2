import React, { useState, useEffect } from 'react';
import { Clock, Users, Trophy, Play, Eye } from 'lucide-react';

interface LiveChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    participants: number;
    timeLeft: number;
    prize: string;
    status: 'live' | 'starting-soon' | 'ended';
  };
  onJoin: (challengeId: string) => void;
  onWatch: (challengeId: string) => void;
}

const LiveChallengeCard: React.FC<LiveChallengeCardProps> = ({
  challenge,
  onJoin,
  onWatch
}) => {
  const [timeLeft, setTimeLeft] = useState(challenge.timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-900 text-green-400 border-green-700';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-400 border-yellow-700';
      case 'Hard':
        return 'bg-red-900 text-red-400 border-red-700';
      default:
        return 'bg-gray-900 text-gray-400 border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-600 animate-pulse';
      case 'starting-soon':
        return 'bg-yellow-600';
      case 'ended':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(challenge.status)}`} />
          <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {challenge.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Time Left</span>
          </div>
          <p className="text-white font-mono font-bold">{formatTime(timeLeft)}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Participants</span>
          </div>
          <p className="text-white font-bold">{challenge.participants}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-400">Prize: </span>
          <span className="text-sm text-yellow-400 font-medium">{challenge.prize}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        {challenge.status === 'live' && (
          <button
            onClick={() => onJoin(challenge.id)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Play className="w-4 h-4" />
            <span>Join Now</span>
          </button>
        )}
        
        <button
          onClick={() => onWatch(challenge.id)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Watch</span>
        </button>
      </div>
    </div>
  );
};

export default LiveChallengeCard;