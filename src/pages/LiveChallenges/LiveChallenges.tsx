import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LiveChallengeCard from '../../components/LiveChallenges/LiveChallengeCard';
import TournamentCodeModal from '../../components/Modals/TournamentCodeModal';
import { Zap, Clock, Trophy, Users, Filter } from 'lucide-react';

const LiveChallenges: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'starting-soon'>('all');

  const [liveChallenges] = useState([
    {
      id: '1',
      title: 'Speed Coding Challenge',
      description: 'Solve 3 algorithmic problems as fast as possible. First to complete all wins!',
      difficulty: 'Medium' as const,
      participants: 47,
      timeLeft: 1800, // 30 minutes
      prize: '$100',
      status: 'live' as const
    },
    {
      id: '2',
      title: 'Binary Tree Marathon',
      description: 'Advanced tree problems for experienced developers. Test your data structure skills!',
      difficulty: 'Hard' as const,
      participants: 23,
      timeLeft: 3600, // 1 hour
      prize: '$250',
      status: 'live' as const
    },
    {
      id: '3',
      title: 'Beginner Friendly Sprint',
      description: 'Perfect for newcomers! Solve basic programming problems and learn.',
      difficulty: 'Easy' as const,
      participants: 89,
      timeLeft: 300, // 5 minutes
      prize: '$50',
      status: 'starting-soon' as const
    },
    {
      id: '4',
      title: 'Dynamic Programming Duel',
      description: 'Master the art of dynamic programming with challenging optimization problems.',
      difficulty: 'Hard' as const,
      participants: 156,
      timeLeft: 0,
      prize: '$500',
      status: 'ended' as const
    }
  ]);

  const filteredChallenges = liveChallenges.filter(challenge => {
    if (filter === 'all') return true;
    return challenge.status === filter;
  });

  const handleJoinChallenge = (challengeId: string) => {
    if (!isAuthenticated) {
      alert('Please login to join live challenges');
      return;
    }

    const challenge = liveChallenges.find(c => c.id === challengeId);
    if (challenge) {
      // Convert to tournament format for the modal
      const tournamentFormat = {
        id: challenge.id,
        name: challenge.title,
        description: challenge.description,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + challenge.timeLeft * 1000).toISOString(),
        challenges: ['1', '2'], // Mock challenge IDs
        participants: [],
        currentParticipants: challenge.participants,
        maxParticipants: 100,
        status: 'active'
      };
      
      setSelectedChallenge(tournamentFormat);
      setShowCodeModal(true);
    }
  };

  const handleWatchChallenge = (challengeId: string) => {
    console.log('Watching challenge:', challengeId);
    // Implement watch functionality
  };

  const handleCodeSubmission = (code: string, language: string, challengeId: string) => {
    console.log('Live challenge submission:', { code, language, challengeId });
    // Handle live challenge submission
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-white">Live Challenges</h1>
              </div>
              <p className="text-gray-400">
                Join real-time coding competitions and compete with developers worldwide
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                {liveChallenges.reduce((sum, c) => sum + c.participants, 0)} active participants
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-red-900 rounded-lg p-3 mr-4">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Live Now</p>
                <p className="text-2xl font-bold text-white">
                  {liveChallenges.filter(c => c.status === 'live').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-900 rounded-lg p-3 mr-4">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Starting Soon</p>
                <p className="text-2xl font-bold text-white">
                  {liveChallenges.filter(c => c.status === 'starting-soon').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-900 rounded-lg p-3 mr-4">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-white">
                  {liveChallenges.reduce((sum, c) => sum + c.participants, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-900 rounded-lg p-3 mr-4">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Prizes</p>
                <p className="text-2xl font-bold text-white">$900</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: 'all', label: 'All Challenges', count: liveChallenges.length },
              { key: 'live', label: 'Live Now', count: liveChallenges.filter(c => c.status === 'live').length },
              { key: 'starting-soon', label: 'Starting Soon', count: liveChallenges.filter(c => c.status === 'starting-soon').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-gray-700 text-gray-300 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Live Challenges Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <LiveChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={handleJoinChallenge}
              onWatch={handleWatchChallenge}
            />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Zap className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No challenges found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'There are no live challenges available at the moment.' 
                : `There are no ${filter.replace('-', ' ')} challenges at the moment.`}
            </p>
          </div>
        )}
      </div>

      {/* Tournament Code Modal */}
      <TournamentCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        tournament={selectedChallenge}
        user={user}
        onSubmit={handleCodeSubmission}
      />
    </div>
  );
};

export default LiveChallenges;