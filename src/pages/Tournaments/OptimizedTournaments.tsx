import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, Users, Clock, Calendar, Star, Award, Zap, Crown,
  Timer, Target, Shield, Sword, Medal, Flag, ChevronRight,
  TrendingUp, AlertCircle, CheckCircle, Play, Lock, Unlock,
  Sparkles, Flame, Gift, DollarSign
} from 'lucide-react';

const TournamentCard = memo(({ tournament, index }: any) => {
  const getStatusColor = () => {
    switch (tournament.status) {
      case 'live': return 'from-red-500 to-pink-500';
      case 'upcoming': return 'from-blue-500 to-cyan-500';
      case 'completed': return 'from-gray-500 to-gray-600';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const getStatusIcon = () => {
    switch (tournament.status) {
      case 'live': return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor()} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500`} />
      
      {/* Card */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group-hover:translate-y-[-4px]">
        {/* Banner */}
        <div className={`relative h-32 bg-gradient-to-br ${getStatusColor()} p-4`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex justify-between items-start">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/30 backdrop-blur rounded-full">
              {getStatusIcon()}
              <span className="text-white text-sm font-medium capitalize">{tournament.status}</span>
            </div>
            {tournament.featured && (
              <div className="px-3 py-1 bg-yellow-500/20 backdrop-blur rounded-full border border-yellow-500/50">
                <span className="text-yellow-300 text-xs font-bold">FEATURED</span>
              </div>
            )}
          </div>
          
          {/* Prize Pool */}
          {tournament.prizePool && (
            <div className="absolute bottom-4 right-4 text-right">
              <div className="text-white/80 text-xs">Prize Pool</div>
              <div className="text-white text-2xl font-bold">${tournament.prizePool}</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {tournament.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4">
            {tournament.description}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{tournament.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Timer className="w-4 h-4" />
              <span className="text-sm">{tournament.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">{tournament.participants}/{tournament.maxParticipants}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">{tournament.difficulty}</span>
            </div>
          </div>

          {/* Progress Bar for Registration */}
          {tournament.status === 'upcoming' && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Registration</span>
                <span>{Math.round((tournament.participants / tournament.maxParticipants) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            tournament.status === 'live' 
              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
              : tournament.status === 'upcoming'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              : 'bg-white/5 text-gray-400 cursor-not-allowed'
          }`}>
            {tournament.status === 'live' && (
              <>
                <Play className="w-4 h-4" />
                Join Live
              </>
            )}
            {tournament.status === 'upcoming' && (
              <>
                <Users className="w-4 h-4" />
                Register Now
              </>
            )}
            {tournament.status === 'completed' && (
              <>
                <Trophy className="w-4 h-4" />
                View Results
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
});

const OptimizedTournaments: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const tournaments = [
    {
      id: 1,
      title: 'Weekly Algorithm Sprint',
      description: 'Fast-paced algorithm challenges for all skill levels',
      status: 'live',
      date: 'Today',
      duration: '2 hours',
      participants: 234,
      maxParticipants: 500,
      difficulty: 'Mixed',
      prizePool: '5,000',
      featured: true
    },
    {
      id: 2,
      title: 'Data Structures Championship',
      description: 'Master complex data structures in this intense competition',
      status: 'upcoming',
      date: 'Dec 25',
      duration: '3 hours',
      participants: 156,
      maxParticipants: 300,
      difficulty: 'Hard',
      prizePool: '10,000',
      featured: true
    },
    {
      id: 3,
      title: 'Beginner Friendly Cup',
      description: 'Perfect for newcomers to competitive programming',
      status: 'upcoming',
      date: 'Dec 26',
      duration: '1.5 hours',
      participants: 89,
      maxParticipants: 200,
      difficulty: 'Easy',
      prizePool: '2,500',
      featured: false
    },
    {
      id: 4,
      title: 'System Design Marathon',
      description: 'Design scalable systems under time pressure',
      status: 'completed',
      date: 'Dec 20',
      duration: '4 hours',
      participants: 150,
      maxParticipants: 150,
      difficulty: 'Expert',
      prizePool: '15,000',
      featured: false
    }
  ];

  const stats = [
    { label: 'Active Tournaments', value: '3', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
    { label: 'Total Prize Pool', value: '$32.5K', icon: Gift, color: 'from-green-500 to-emerald-500' },
    { label: 'Participants Today', value: '1,250', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Winners This Month', value: '45', icon: Crown, color: 'from-blue-500 to-cyan-500' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 backdrop-blur-xl border border-yellow-500/20 rounded-full px-6 py-3 mb-6">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Compete & Win Prizes</span>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Live <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text animate-gradient-x bg-300%">Tournaments</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join competitive programming battles and win amazing prizes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300">
                <div className={`bg-gradient-to-br ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-1">
            {['All', 'Live', 'Upcoming', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab.toLowerCase())}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === tab.toLowerCase()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {tournaments.map((tournament, index) => (
            <TournamentCard key={tournament.id} tournament={tournament} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-2xl" />
          <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Own Tournament</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Host private competitions for your team or community with custom rules and prizes
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              Create Tournament
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedTournaments;