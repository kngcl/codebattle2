import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tournament, getStorageData, setStorageData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import TournamentCodeModal from '../../components/Modals/TournamentCodeModal';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Target, 
  Award,
  ChevronLeft,
  CheckCircle,
  PlayCircle,
  Clock,
  Medal,
  Star
} from 'lucide-react';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCodeModal, setShowCodeModal] = useState(false);

  useEffect(() => {
    if (id) {
      const tournaments = getStorageData('codebattle_tournaments', []);
      const foundTournament = tournaments.find((t: Tournament) => t.id === id);
      setTournament(foundTournament || null);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-900 text-blue-400';
      case 'active':
        return 'bg-green-900 text-green-400';
      case 'completed':
        return 'bg-gray-800 text-gray-400';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'active':
        return <PlayCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-gray-400">#{rank}</span>;
    }
  };

  const isUserParticipating = () => {
    if (!user || !tournament) return false;
    return tournament.participants.some(p => p.userId === user.id);
  };

  const handleJoinTournament = () => {
    if (!isAuthenticated || !user || !tournament) {
      navigate('/login');
      return;
    }

    if (isUserParticipating()) {
      // If already participating, open code modal
      setShowCodeModal(true);
      return;
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      alert('Tournament is full!');
      return;
    }

    // Add user to tournament
    const tournaments = getStorageData('codebattle_tournaments', []);
    const tournamentIndex = tournaments.findIndex((t: Tournament) => t.id === tournament.id);
    
    if (tournamentIndex !== -1) {
      tournaments[tournamentIndex].participants.push({
        userId: user.id,
        username: user.username,
        score: 0,
        rank: tournament.currentParticipants + 1,
        completedChallenges: 0
      });
      tournaments[tournamentIndex].currentParticipants += 1;
      
      setStorageData('codebattle_tournaments', tournaments);
      setTournament(tournaments[tournamentIndex]);
      // Open code modal after joining
      setShowCodeModal(true);
    }
  };

  const handleCodeSubmission = (code: string, language: string, challengeId: string) => {
    // Handle code submission logic here
    console.log('Code submitted:', { code, language, challengeId });
    
    // Update user score in tournament
    if (tournament && user) {
      const tournaments = getStorageData('codebattle_tournaments', []);
      const tournamentIndex = tournaments.findIndex((t: Tournament) => t.id === tournament.id);
      
      if (tournamentIndex !== -1) {
        const participantIndex = tournaments[tournamentIndex].participants.findIndex(
          (p: any) => p.userId === user.id
        );
        
        if (participantIndex !== -1) {
          tournaments[tournamentIndex].participants[participantIndex].score += 100;
          tournaments[tournamentIndex].participants[participantIndex].completedChallenges += 1;
          
          // Re-sort participants by score
          tournaments[tournamentIndex].participants.sort((a: any, b: any) => b.score - a.score);
          tournaments[tournamentIndex].participants.forEach((p: any, index: number) => {
            p.rank = index + 1;
          });
          
          setStorageData('codebattle_tournaments', tournaments);
          setTournament(tournaments[tournamentIndex]);
        }
      }
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Tournament not found</h2>
          <button
            onClick={() => navigate('/tournaments')}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Tournaments
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
                onClick={() => navigate('/tournaments')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Tournaments
              </button>
              <div className="h-6 w-px bg-gray-700" />
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                    {getStatusIcon(tournament.status)}
                    <span className="ml-1 capitalize">{tournament.status}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {isAuthenticated && tournament.status !== 'completed' && (
              <button
                onClick={handleJoinTournament}
                disabled={!isUserParticipating() && tournament.currentParticipants >= tournament.maxParticipants}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isUserParticipating()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : tournament.currentParticipants >= tournament.maxParticipants
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isUserParticipating() 
                  ? 'Enter Tournament' 
                  : tournament.currentParticipants >= tournament.maxParticipants 
                  ? 'Full' 
                  : 'Join Tournament'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-800">
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'leaderboard'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Leaderboard
                  </button>
                  <button
                    onClick={() => setActiveTab('rules')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'rules'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Rules
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                      <p className="text-gray-300 leading-relaxed">{tournament.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Tournament Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-300">Start Date</span>
                          </div>
                          <p className="text-white">{formatDate(tournament.startDate)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-300">End Date</span>
                          </div>
                          <p className="text-white">{formatDate(tournament.endDate)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-300">Participants</span>
                          </div>
                          <p className="text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-300">Challenges</span>
                          </div>
                          <p className="text-white">{tournament.challenges.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'leaderboard' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-300">Rank</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-300">Participant</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-300">Score</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-300">Completed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tournament.participants.map((participant) => (
                            <tr key={participant.userId} className="border-b border-gray-800">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  {getRankIcon(participant.rank)}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                      {participant.username.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="font-medium text-white">{participant.username}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-white font-medium">{participant.score}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-gray-400">{participant.completedChallenges}/{tournament.challenges.length}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'rules' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Tournament Rules</h3>
                    <div className="space-y-3">
                      {tournament.rules.map((rule, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-900 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <p className="text-gray-300">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tournament Info */}
            <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Tournament Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Prize</p>
                    <p className="font-medium text-white">{tournament.prize}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Participants</p>
                    <p className="font-medium text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Challenges</p>
                    <p className="font-medium text-white">{tournament.challenges.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Registration Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Registered</span>
                  <span className="font-medium text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Top Participants */}
            {tournament.participants.length > 0 && (
              <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Top Participants</h3>
                <div className="space-y-3">
                  {tournament.participants.slice(0, 5).map((participant) => (
                    <div key={participant.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {getRankIcon(participant.rank)}
                        </div>
                        <span className="text-sm font-medium text-white">{participant.username}</span>
                      </div>
                      <span className="text-sm text-gray-400">{participant.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Code Modal */}
      <TournamentCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        tournament={tournament}
        user={user}
        onSubmit={handleCodeSubmission}
      />
    </div>
  );
};

export default TournamentDetail;