import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tournament, getStorageData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import TournamentCodeModal from '../../components/Modals/TournamentCodeModal';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Clock, 
  Target, 
  Award,
  CheckCircle,
  PlayCircle,
  PlusCircle
} from 'lucide-react';

const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const storedTournaments = getStorageData('codebattle_tournaments', []);
    setTournaments(storedTournaments);
  }, []);

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'all') return true;
    return tournament.status === filter;
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUserParticipating = (tournament: Tournament) => {
    if (!user) return false;
    return tournament.participants.some(p => p.userId === user.id);
  };

  const handleJoinTournament = (tournament: Tournament) => {
    if (!isAuthenticated || !user) {
      return;
    }

    setSelectedTournament(tournament);
    setShowCodeModal(true);
  };

  const handleCodeSubmission = (code: string, language: string, challengeId: string) => {
    console.log('Code submitted:', { code, language, challengeId });
    // Handle submission logic here
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Tournaments</h1>
              <p className="mt-2 text-gray-400">
                Compete with developers worldwide in real-time coding competitions
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {user?.role === 'admin' && (
                <Link
                  to="/admin/tournaments/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Tournament
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: 'all', label: 'All Tournaments', count: tournaments.length },
              { key: 'upcoming', label: 'Upcoming', count: tournaments.filter(t => t.status === 'upcoming').length },
              { key: 'active', label: 'Active', count: tournaments.filter(t => t.status === 'active').length },
              { key: 'completed', label: 'Completed', count: tournaments.filter(t => t.status === 'completed').length }
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
                <span className="bg-gray-800 text-gray-300 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tournaments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-800 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {tournament.name}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                    {getStatusIcon(tournament.status)}
                    <span className="ml-1 capitalize">{tournament.status}</span>
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {tournament.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Start Date</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatDate(tournament.startDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>Participants</span>
                    </div>
                    <span className="text-white font-medium">
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>Challenges</span>
                    </div>
                    <span className="text-white font-medium">
                      {tournament.challenges.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>Prize</span>
                    </div>
                    <span className="text-white font-medium">
                      {tournament.prize}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Participants</span>
                    <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                {isAuthenticated ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleJoinTournament(tournament)}
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      {tournament.status === 'upcoming' && 'View Details'}
                      {tournament.status === 'active' && 'Join Now'}
                      {tournament.status === 'completed' && 'View Results'}
                    </button>
                    
                    <Link
                      to={`/tournaments/${tournament.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      View Details
                    </Link>
                    
                    {isUserParticipating(tournament) && (
                      <p className="text-center text-sm text-green-400 font-medium">
                        ✓ You're participating in this tournament
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      Login to Participate
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No tournaments found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'There are no tournaments available at the moment.' 
                : `There are no ${filter} tournaments at the moment.`}
            </p>
          </div>
        )}
      </div>

      {/* Tournament Code Modal */}
      <TournamentCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        tournament={selectedTournament}
        user={user}
        onSubmit={handleCodeSubmission}
      />
    </div>
  );
};

export default Tournaments;