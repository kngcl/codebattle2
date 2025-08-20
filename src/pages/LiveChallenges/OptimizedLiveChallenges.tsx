import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Users, Clock, Trophy, Zap, Activity, Radio, Wifi,
  Monitor, Code, Terminal, Globe, Timer, Award, Shield,
  TrendingUp, Eye, MessageSquare, Heart, Share2, Sparkles,
  AlertCircle, Circle, Square, ChevronRight, Swords, Flag
} from 'lucide-react';

const LiveSessionCard = memo(({ session, index }: any) => {
  const getStatusColor = () => {
    switch (session.status) {
      case 'live': return 'from-red-500 to-pink-500';
      case 'starting': return 'from-yellow-500 to-orange-500';
      case 'ended': return 'from-gray-500 to-gray-600';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Live Indicator */}
      {session.status === 'live' && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
            <div className="relative px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Radio className="w-3 h-3" />
              LIVE
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group-hover:translate-y-[-2px]">
        {/* Thumbnail/Preview */}
        <div className="relative h-48 bg-gradient-to-br from-gray-900 to-black p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
          
          {/* Live Preview Grid */}
          <div className="relative grid grid-cols-2 gap-2 h-full">
            {session.participants.slice(0, 4).map((participant: any, i: number) => (
              <div key={i} className="bg-black/60 backdrop-blur rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <span className="text-xs text-white truncate">{participant.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-white/20 rounded" />
                  <div className="h-1 bg-white/20 rounded w-3/4" />
                  <div className="h-1 bg-white/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Viewer Count */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur rounded-full">
            <Eye className="w-4 h-4 text-red-400" />
            <span className="text-white text-sm font-medium">{session.viewers}</span>
          </div>

          {/* Duration */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur rounded-full">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">{session.duration}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                {session.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{session.host}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor()} text-white`}>
              {session.difficulty}
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {session.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-xs">{session.participants.length} coding</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">{session.messages} messages</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{session.likes}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {session.status === 'live' ? (
              <button className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Watch Live
              </button>
            ) : session.status === 'starting' ? (
              <button className="flex-1 py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Starting Soon
              </button>
            ) : (
              <button className="flex-1 py-2.5 bg-white/5 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Ended
              </button>
            )}
            
            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300">
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const OptimizedLiveChallenges: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const liveSessions = [
    {
      id: 1,
      title: 'Binary Search Tree Battle',
      host: 'CodeMaster Pro',
      status: 'live',
      difficulty: 'Medium',
      description: 'Real-time competition on BST algorithms with live commentary',
      viewers: 1234,
      duration: '45:32',
      participants: [
        { name: 'Player1', score: 450 },
        { name: 'Player2', score: 380 },
        { name: 'Player3', score: 320 },
        { name: 'Player4', score: 290 }
      ],
      messages: 234,
      likes: 89
    },
    {
      id: 2,
      title: 'Dynamic Programming Sprint',
      host: 'AlgoExpert',
      status: 'live',
      difficulty: 'Hard',
      description: 'Intense DP problem solving session with expert tips',
      viewers: 892,
      duration: '1:23:45',
      participants: [
        { name: 'Coder1', score: 520 },
        { name: 'Coder2', score: 480 },
        { name: 'Coder3', score: 410 },
        { name: 'Coder4', score: 350 }
      ],
      messages: 412,
      likes: 156
    },
    {
      id: 3,
      title: 'Beginner Algorithms Workshop',
      host: 'TeachCode',
      status: 'starting',
      difficulty: 'Easy',
      description: 'Learn basic algorithms through interactive coding',
      viewers: 456,
      duration: '00:00',
      participants: [
        { name: 'Student1', score: 0 },
        { name: 'Student2', score: 0 },
        { name: 'Student3', score: 0 },
        { name: 'Student4', score: 0 }
      ],
      messages: 45,
      likes: 32
    }
  ];

  const featuredStream = {
    id: 99,
    title: 'World Championship Qualifier',
    host: 'CodeBattle Official',
    prize: '$10,000',
    viewers: 5678,
    timeLeft: '2:45:30',
    participants: 256,
    description: 'Top 32 advance to the main tournament'
  };

  const categories = [
    { id: 'all', label: 'All Streams', icon: Globe },
    { id: 'competitive', label: 'Competitive', icon: Swords },
    { id: 'educational', label: 'Educational', icon: Monitor },
    { id: 'practice', label: 'Practice', icon: Terminal }
  ];

  const stats = [
    { label: 'Live Now', value: '12', icon: Radio, color: 'from-red-500 to-pink-500' },
    { label: 'Active Coders', value: '3.4K', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Viewers', value: '15.2K', icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { label: 'Battles Today', value: '89', icon: Swords, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-black pt-8">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/10 to-pink-600/10 backdrop-blur-xl border border-red-500/20 rounded-full px-6 py-3 mb-6">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <Radio className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm font-medium text-red-300">Live Coding Sessions</span>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Watch & Code <span className="text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text animate-gradient-x bg-300%">Live</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join real-time coding battles, learn from experts, and compete with developers worldwide
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

        {/* Featured Stream */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-2xl overflow-hidden">
              <div className="absolute top-4 left-4 z-10">
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-black font-bold rounded-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  FEATURED
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 p-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {featuredStream.title}
                  </h2>
                  <p className="text-gray-400 mb-6">{featuredStream.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-gray-400 text-sm">Prize Pool</div>
                      <div className="text-2xl font-bold text-yellow-400">{featuredStream.prize}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Time Remaining</div>
                      <div className="text-2xl font-bold text-white">{featuredStream.timeLeft}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Participants</div>
                      <div className="text-2xl font-bold text-white">{featuredStream.participants}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Watching Now</div>
                      <div className="text-2xl font-bold text-red-400">{featuredStream.viewers}</div>
                    </div>
                  </div>
                  
                  <button className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Watch Championship Live
                  </button>
                </div>
                
                <div className="relative h-64 lg:h-auto bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/10 p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-white font-medium">Stream Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Sessions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {liveSessions.map((session, index) => (
            <LiveSessionCard key={session.id} session={session} index={index} />
          ))}
        </div>

        {/* Create Stream CTA */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-2xl" />
          <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <Wifi className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Start Your Own Stream</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Share your coding knowledge, host competitions, or practice with friends
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              Start Streaming
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedLiveChallenges;