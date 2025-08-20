import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tournament, getStorageData, setStorageData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import TournamentCodeModal from '../../components/Modals/TournamentCodeModal';
import { PageLoader, CardSkeleton } from '../../components/Loaders';
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
  Star,
  Sparkles,
  Zap,
  Shield,
  Swords,
  Crown,
  ChevronRight,
  Flame,
  Activity,
  TrendingUp,
  AlertCircle,
  Timer,
  Gift,
  Hash,
  Code,
  BookOpen,
  Rocket
} from 'lucide-react';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const tournaments = getStorageData('codebattle_tournaments', []);
        const foundTournament = tournaments.find((t: Tournament) => t.id === id);
        setTournament(foundTournament || null);
        setIsLoading(false);
      }, 500);
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          bg: 'from-blue-600 to-cyan-600',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          icon: Clock
        };
      case 'active':
        return {
          bg: 'from-green-600 to-emerald-600',
          text: 'text-green-400',
          border: 'border-green-500/30',
          icon: PlayCircle
        };
      case 'completed':
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: CheckCircle
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          icon: Clock
        };
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

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'from-yellow-600 to-orange-600',
          border: 'border-yellow-500/30',
          shadow: 'shadow-yellow-500/20',
          text: 'text-yellow-400',
          icon: <Crown className="w-5 h-5 text-yellow-400" />
        };
      case 2:
        return {
          bg: 'from-gray-400 to-gray-600',
          border: 'border-gray-500/30',
          shadow: 'shadow-gray-500/20',
          text: 'text-gray-300',
          icon: <Medal className="w-5 h-5 text-gray-300" />
        };
      case 3:
        return {
          bg: 'from-orange-600 to-red-600',
          border: 'border-orange-500/30',
          shadow: 'shadow-orange-500/20',
          text: 'text-orange-400',
          icon: <Medal className="w-5 h-5 text-orange-400" />
        };
      default:
        return {
          bg: 'from-purple-600 to-pink-600',
          border: 'border-purple-500/30',
          shadow: 'shadow-purple-500/20',
          text: 'text-purple-400',
          icon: <span className="text-sm font-bold text-gray-400">#{rank}</span>
        };
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

  if (isLoading) {
    return <PageLoader />;
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900/60 rounded-2xl mb-6">
            <AlertCircle className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Tournament not found</h2>
          <p className="text-gray-400 mb-6">The tournament you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/tournaments')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(tournament.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent"></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
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
            onClick={() => navigate('/tournaments')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Tournaments</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 bg-gradient-to-r ${statusStyle.bg} rounded-xl shadow-lg shadow-purple-500/20`}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {tournament.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${statusStyle.bg} bg-opacity-20 ${statusStyle.text} ${statusStyle.border} border`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="capitalize">{tournament.status}</span>
                    </span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">{tournament.prize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isAuthenticated && tournament.status !== 'completed' && (
                <button
                  onClick={handleJoinTournament}
                  disabled={!isUserParticipating() && tournament.currentParticipants >= tournament.maxParticipants}
                  className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center gap-2 ${
                    isUserParticipating()
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                      : tournament.currentParticipants >= tournament.maxParticipants
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {isUserParticipating() ? (
                    <>
                      <Swords className="w-5 h-5" />
                      Enter Battle
                    </>
                  ) : tournament.currentParticipants >= tournament.maxParticipants ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Tournament Full
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Join Tournament
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-2xl font-bold text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
              </div>
              <p className="text-xs text-gray-400">Participants</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-2xl font-bold text-white">{tournament.challenges.length}</span>
              </div>
              <p className="text-xs text-gray-400">Challenges</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-gray-400">Start Date</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-orange-400" />
                <span className="text-2xl font-bold text-white">
                  {Math.ceil((new Date(tournament.endDate).getTime() - new Date(tournament.startDate).getTime()) / (1000 * 60 * 60))}h
                </span>
              </div>
              <p className="text-xs text-gray-400">Duration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
                <nav className="flex gap-1 p-1">
                  {[
                    { key: 'overview', label: 'Overview', icon: BookOpen },
                    { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                    { key: 'rules', label: 'Rules', icon: Shield }
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
                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Tournament Description</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{tournament.description}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Tournament Schedule</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                          <div className="relative bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-medium text-gray-300">Start Date</span>
                            </div>
                            <p className="text-xl font-bold text-white">{formatDate(tournament.startDate)}</p>
                          </div>
                        </div>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                          <div className="relative bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-red-400" />
                              <span className="text-sm font-medium text-gray-300">End Date</span>
                            </div>
                            <p className="text-xl font-bold text-white">{formatDate(tournament.endDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-5 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="w-5 h-5 text-purple-400" />
                        <h4 className="font-semibold text-white">Challenge Information</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Total Challenges</p>
                          <p className="text-2xl font-bold text-white">{tournament.challenges.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Points per Challenge</p>
                          <p className="text-2xl font-bold text-white">100</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'leaderboard' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">Tournament Rankings</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>Live Rankings</span>
                      </div>
                    </div>
                    
                    {tournament.participants.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900/60 rounded-2xl mb-4">
                          <Users className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No participants yet</h3>
                        <p className="text-gray-400">Be the first to join this tournament!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tournament.participants.map((participant, index) => {
                          const rankStyle = getRankStyle(participant.rank);
                          return (
                            <div
                              key={participant.userId}
                              className={`relative group animate-fade-in ${
                                participant.userId === user?.id ? 'ring-2 ring-purple-500/50' : ''
                              }`}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              {participant.rank <= 3 && (
                                <div className={`absolute inset-0 bg-gradient-to-r ${rankStyle.bg} rounded-xl opacity-10 group-hover:opacity-20 blur transition-opacity`}></div>
                              )}
                              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-all">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${rankStyle.bg} rounded-xl flex items-center justify-center shadow-lg ${rankStyle.shadow}`}>
                                      {rankStyle.icon}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 bg-gradient-to-r ${rankStyle.bg} rounded-full flex items-center justify-center`}>
                                        <span className="text-white font-bold">
                                          {participant.username.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-white">
                                            {participant.username}
                                          </span>
                                          {participant.userId === user?.id && (
                                            <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                                              You
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                          <span className="text-sm text-gray-400">
                                            {participant.completedChallenges}/{tournament.challenges.length} completed
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-2">
                                      <Zap className="w-5 h-5 text-yellow-400" />
                                      <span className="text-2xl font-bold text-white">{participant.score}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">points</span>
                                  </div>
                                </div>
                                {participant.completedChallenges > 0 && (
                                  <div className="mt-3">
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full bg-gradient-to-r ${rankStyle.bg} rounded-full transition-all`}
                                        style={{ width: `${(participant.completedChallenges / tournament.challenges.length) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'rules' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-orange-400" />
                      <h3 className="text-lg font-semibold text-white">Tournament Rules & Guidelines</h3>
                    </div>
                    <div className="space-y-4">
                      {tournament.rules.map((rule, index) => (
                        <div
                          key={index}
                          className="relative group animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity"></div>
                          <div className="relative flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all">
                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <p className="text-gray-300 leading-relaxed">{rule}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-5 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-blue-400" />
                        <h4 className="font-semibold text-white">Important Notes</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>All submissions are final and cannot be modified after submission</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Rankings are updated in real-time as participants complete challenges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>Winners will be announced immediately after the tournament ends</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prize Pool Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Prize Pool</h3>
                </div>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {tournament.prize}
                  </div>
                  <p className="text-sm text-gray-400">Winner takes all</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <Crown className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">1st Place</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <Medal className="w-4 h-4 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">2nd Place</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <Medal className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">3rd Place</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Progress */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Registration Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Slots Filled</span>
                  <span className="font-bold text-white">
                    {tournament.currentParticipants}/{tournament.maxParticipants}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500 relative"
                    style={{ width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {tournament.maxParticipants - tournament.currentParticipants} slots remaining
                </p>
              </div>
            </div>

            {/* Top Competitors */}
            {tournament.participants.length > 0 && (
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">Top Competitors</h3>
                  </div>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
                <div className="space-y-3">
                  {tournament.participants.slice(0, 5).map((participant, index) => {
                    const rankStyle = getRankStyle(participant.rank);
                    return (
                      <div
                        key={participant.userId}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-all animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${rankStyle.bg} rounded-lg flex items-center justify-center`}>
                            {participant.rank <= 3 ? rankStyle.icon : (
                              <span className="text-xs font-bold text-white">{participant.rank}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {participant.username}
                            </p>
                            <p className="text-xs text-gray-400">
                              {participant.completedChallenges} solved
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{participant.score}</p>
                          <p className="text-xs text-gray-400">pts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {tournament.participants.length > 5 && (
                  <button className="w-full mt-4 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all text-sm font-medium">
                    View All Rankings
                  </button>
                )}
              </div>
            )}

            {/* Quick Actions */}
            {isAuthenticated && tournament.status !== 'completed' && (
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  {isUserParticipating() ? (
                    <button
                      onClick={() => setShowCodeModal(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Code className="w-4 h-4" />
                      Submit Solution
                    </button>
                  ) : (
                    <button
                      onClick={handleJoinTournament}
                      disabled={tournament.currentParticipants >= tournament.maxParticipants}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Rocket className="w-4 h-4" />
                      Join Tournament
                    </button>
                  )}
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
        <Trophy className="w-6 h-6 group-hover:animate-pulse" />
      </button>

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