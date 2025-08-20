import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tournament, getStorageData } from '../../data/mockData';
import { TournamentSkeleton, InlineLoader } from '../../components/Loaders';
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign,
  Calendar,
  ChevronRight,
  Zap,
  Crown,
  Sparkles,
  Timer,
  Award,
  TrendingUp,
  Shield,
  Flame,
  Star,
  Swords,
  Target,
  Medal
} from 'lucide-react';

const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const storedTournaments = getStorageData('codebattle_tournaments', []);
      setTournaments(storedTournaments);
      setFilteredTournaments(storedTournaments);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...tournaments];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(t => {
        if (selectedType === 'free') return t.entryFee === 0;
        if (selectedType === 'paid') return t.entryFee > 0;
        return true;
      });
    }

    setFilteredTournaments(filtered);
  }, [tournaments, selectedStatus, selectedType]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          bg: 'from-blue-600 to-cyan-600',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          badge: 'bg-blue-900/50 text-blue-400 border-blue-500/30'
        };
      case 'active':
        return {
          bg: 'from-green-600 to-emerald-600',
          border: 'border-green-500/30',
          text: 'text-green-400',
          badge: 'bg-green-900/50 text-green-400 border-green-500/30'
        };
      case 'completed':
        return {
          bg: 'from-gray-600 to-gray-700',
          border: 'border-gray-500/30',
          text: 'text-gray-400',
          badge: 'bg-gray-900/50 text-gray-400 border-gray-500/30'
        };
      default:
        return {
          bg: 'from-purple-600 to-pink-600',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          badge: 'bg-purple-900/50 text-purple-400 border-purple-500/30'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRemaining = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const upcomingCount = tournaments.filter(t => t.status === 'upcoming').length;
  const activeCount = tournaments.filter(t => t.status === 'active').length;
  const totalPrizePool = tournaments.reduce((sum, t) => sum + t.prizePool, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Competitive Arena</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Tournaments
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Compete in real-time coding battles and win amazing prizes
            </p>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl font-bold text-white">{activeCount}</span>
                </div>
                <p className="text-sm text-gray-400">Live Now</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{upcomingCount}</span>
                </div>
                <p className="text-sm text-gray-400">Upcoming</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">${totalPrizePool}</span>
                </div>
                <p className="text-sm text-gray-400">Total Prizes</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">5K+</span>
                </div>
                <p className="text-sm text-gray-400">Participants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-wrap gap-2">
            {['all', 'upcoming', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800 hover:border-purple-500/50'
                }`}
              >
                {status === 'all' ? 'All Tournaments' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {['all', 'free', 'paid'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800 hover:border-purple-500/50'
                }`}
              >
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Tournament Banner */}
        {filteredTournaments.filter(t => t.status === 'active').length > 0 && (
          <div className="mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-red-600/10 rounded-3xl border border-yellow-500/30 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-xl">
                    <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-yellow-400 font-bold text-lg">🔥 Featured Tournament</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {filteredTournaments.find(t => t.status === 'active')?.name}
                    </h2>
                    <p className="text-gray-300 mb-4">
                      {filteredTournaments.find(t => t.status === 'active')?.description}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-bold">
                          ${filteredTournaments.find(t => t.status === 'active')?.prizePool} Prize Pool
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-white">
                          {filteredTournaments.find(t => t.status === 'active')?.participants.length} Playing Now
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link
                      to={`/tournaments/${filteredTournaments.find(t => t.status === 'active')?.id}`}
                      className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/25 flex items-center gap-2"
                    >
                      <Swords className="w-5 h-5" />
                      Join Battle Now
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tournaments Grid */}
        {isLoading ? (
          <TournamentSkeleton count={6} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTournaments.map((tournament, index) => {
              const statusStyle = getStatusColor(tournament.status);
              const timeRemaining = tournament.status === 'upcoming' ? formatTimeRemaining(tournament.startDate) : null;
              
              return (
                <div
                  key={tournament.id}
                  className="group relative animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${statusStyle.bg} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                    {/* Status Bar */}
                    <div className={`h-1 bg-gradient-to-r ${statusStyle.bg}`}></div>
                    
                    {/* Tournament Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                              {tournament.name}
                            </h3>
                            {tournament.status === 'active' && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-400">LIVE</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {tournament.description}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.badge}`}>
                          {tournament.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Prize and Entry */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-xl p-3 border border-yellow-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-yellow-400">Prize Pool</span>
                          </div>
                          <p className="text-xl font-bold text-white">${tournament.prizePool}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl p-3 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-blue-400">Entry Fee</span>
                          </div>
                          <p className="text-xl font-bold text-white">
                            {tournament.entryFee > 0 ? `$${tournament.entryFee}` : 'FREE'}
                          </p>
                        </div>
                      </div>

                      {/* Tournament Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Participants</span>
                          </div>
                          <span className="text-white font-medium">
                            {tournament.participants.length}/{tournament.maxParticipants}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Start Time</span>
                          </div>
                          <span className="text-white font-medium text-sm">
                            {formatDate(tournament.startDate)}
                          </span>
                        </div>

                        {timeRemaining && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Timer className="w-4 h-4" />
                              <span className="text-sm">Starts In</span>
                            </div>
                            <span className="text-orange-400 font-bold">
                              {timeRemaining}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Participant Avatars */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex -space-x-2">
                          {tournament.participants.slice(0, 5).map((participant, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-gray-900 flex items-center justify-center"
                            >
                              <span className="text-xs text-white font-bold">
                                {participant.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          ))}
                          {tournament.participants.length > 5 && (
                            <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-900 flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                +{tournament.participants.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Difficulty Badges */}
                        <div className="flex gap-1">
                          {['Easy', 'Medium', 'Hard'].includes(tournament.difficulty) && (
                            <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-lg">
                              {tournament.difficulty}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar for Registration */}
                      {tournament.status === 'upcoming' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Registration Progress</span>
                            <span className="text-gray-400">
                              {Math.round((tournament.participants.length / tournament.maxParticipants) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                              style={{ 
                                width: `${(tournament.participants.length / tournament.maxParticipants) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Link
                        to={`/tournaments/${tournament.id}`}
                        className="block w-full"
                      >
                        <button className={`w-full px-4 py-3 font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 ${
                          tournament.status === 'active' 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-green-500/25'
                            : tournament.status === 'upcoming'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-purple-500/25'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                        }`}>
                          {tournament.status === 'active' ? (
                            <>
                              <Swords className="w-4 h-4" />
                              <span>Join Battle</span>
                            </>
                          ) : tournament.status === 'upcoming' ? (
                            <>
                              <Shield className="w-4 h-4" />
                              <span>Register Now</span>
                            </>
                          ) : (
                            <>
                              <Medal className="w-4 h-4" />
                              <span>View Results</span>
                            </>
                          )}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredTournaments.length === 0 && !isLoading && (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900/60 rounded-2xl mb-6">
              <Trophy className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No tournaments found</h3>
            <p className="text-gray-400 mb-6">Check back later for upcoming tournaments</p>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedType('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all"
            >
              Show All Tournaments
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-full shadow-2xl shadow-orange-500/25 flex items-center justify-center text-black transition-all hover:scale-110 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Trophy className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default Tournaments;