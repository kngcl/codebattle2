import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Trophy, Clock, Users, Star, TrendingUp, Filter, Search,
  ChevronRight, Zap, Brain, Target, Layers, Activity, BookOpen,
  Award, Flame, Shield, GitBranch, Terminal, Cpu, Hash, BarChart,
  CheckCircle, XCircle, AlertCircle, ArrowUpRight, Sparkles
} from 'lucide-react';

// Challenge Card Component
const ChallengeCard = memo(({ challenge, index }: any) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'hard': return 'from-red-500 to-pink-500';
      case 'expert': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'attempted': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-pink-600/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Card Content */}
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group-hover:translate-y-[-2px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${getDifficultyColor(challenge.difficulty)} rounded-lg`}>
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                {challenge.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white font-medium`}>
                  {challenge.difficulty}
                </span>
                {challenge.status && getStatusIcon(challenge.status)}
              </div>
            </div>
          </div>
          
          {challenge.isNew && (
            <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-medium animate-pulse">
              NEW
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {challenge.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.tags.slice(0, 3).map((tag: string, i: number) => (
            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
              {tag}
            </span>
          ))}
          {challenge.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{challenge.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-xs">{challenge.submissions}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Trophy className="w-4 h-4" />
              <span className="text-xs">{challenge.successRate}%</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Star className="w-4 h-4" />
              <span className="text-xs">{challenge.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-sm font-medium">Solve</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
});

const OptimizedChallenges: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data
  const challenges = [
    {
      id: 1,
      title: 'Two Sum Algorithm',
      description: 'Find two numbers in an array that add up to a target value using optimal time complexity.',
      difficulty: 'Easy',
      category: 'Arrays',
      tags: ['Array', 'Hash Table', 'Two Pointers'],
      submissions: '125K',
      successRate: 65,
      rating: 4.5,
      status: 'solved',
      isNew: false
    },
    {
      id: 2,
      title: 'Binary Tree Traversal',
      description: 'Implement different tree traversal methods including in-order, pre-order, and post-order.',
      difficulty: 'Medium',
      category: 'Trees',
      tags: ['Tree', 'DFS', 'Recursion', 'Stack'],
      submissions: '89K',
      successRate: 45,
      rating: 4.2,
      status: 'attempted',
      isNew: false
    },
    {
      id: 3,
      title: 'Dynamic Programming Master',
      description: 'Solve complex optimization problems using dynamic programming techniques and memoization.',
      difficulty: 'Hard',
      category: 'Dynamic Programming',
      tags: ['DP', 'Optimization', 'Memoization'],
      submissions: '45K',
      successRate: 25,
      rating: 4.8,
      status: null,
      isNew: true
    },
    {
      id: 4,
      title: 'Graph Shortest Path',
      description: 'Find the shortest path between nodes in a weighted graph using Dijkstra\'s algorithm.',
      difficulty: 'Medium',
      category: 'Graphs',
      tags: ['Graph', 'Dijkstra', 'BFS', 'Priority Queue'],
      submissions: '67K',
      successRate: 38,
      rating: 4.6,
      status: null,
      isNew: false
    },
    {
      id: 5,
      title: 'System Design Challenge',
      description: 'Design a scalable distributed system with high availability and fault tolerance.',
      difficulty: 'Expert',
      category: 'System Design',
      tags: ['Architecture', 'Scalability', 'Distributed Systems'],
      submissions: '23K',
      successRate: 15,
      rating: 4.9,
      status: null,
      isNew: true
    },
    {
      id: 6,
      title: 'String Manipulation Pro',
      description: 'Advanced string manipulation using pattern matching and regular expressions.',
      difficulty: 'Medium',
      category: 'Strings',
      tags: ['String', 'Regex', 'Pattern Matching'],
      submissions: '98K',
      successRate: 52,
      rating: 4.3,
      status: 'solved',
      isNew: false
    }
  ];

  const categories = ['All', 'Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'System Design'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];

  const stats = [
    { label: 'Total Challenges', value: '500+', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Solvers', value: '25K', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Avg Success Rate', value: '42%', icon: Target, color: 'from-green-500 to-emerald-500' },
    { label: 'New This Week', value: '12', icon: Sparkles, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white">
              Coding <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Challenges</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Master algorithms and data structures through hands-on practice</p>
        </div>

        {/* Stats Cards */}
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

        {/* Filters and Search */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff.toLowerCase()}>{diff}</option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="difficulty">By Difficulty</option>
                <option value="success">Success Rate</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {challenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            Load More Challenges
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedChallenges;