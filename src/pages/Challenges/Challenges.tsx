import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Challenge, getStorageData } from '../../data/mockData';
import { CardSkeleton, Spinner, InlineLoader } from '../../components/Loaders';
import { 
  Search, 
  Filter, 
  Code, 
  Clock, 
  Users, 
  Trophy,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Zap,
  Brain,
  Target,
  Award,
  BookOpen,
  Hash,
  Layers,
  GitBranch,
  Activity,
  BarChart3,
  Shield,
  Flame,
  Star
} from 'lucide-react';

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const storedChallenges = getStorageData('codebattle_challenges', []);
      setChallenges(storedChallenges);
      setFilteredChallenges(storedChallenges);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      let filtered = challenges.filter(challenge => 
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (selectedDifficulty !== 'All') {
        filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
      }

      if (selectedCategory !== 'All') {
        filtered = filtered.filter(challenge => challenge.category === selectedCategory);
      }

      // Sort challenges
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'difficulty':
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          case 'successRate':
            return b.successRate - a.successRate;
          case 'newest':
            return b.id.localeCompare(a.id);
          case 'popular':
            return b.submissionCount - a.submissionCount;
          default:
            return a.title.localeCompare(b.title);
        }
      });

      setFilteredChallenges(filtered);
      setIsFiltering(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [challenges, searchTerm, selectedDifficulty, selectedCategory, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return {
          bg: 'from-green-600 to-emerald-600',
          border: 'border-green-500/30',
          text: 'text-green-400',
          glow: 'hover:shadow-green-500/25'
        };
      case 'Medium':
        return {
          bg: 'from-yellow-600 to-orange-600',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          glow: 'hover:shadow-yellow-500/25'
        };
      case 'Hard':
        return {
          bg: 'from-red-600 to-pink-600',
          border: 'border-red-500/30',
          text: 'text-red-400',
          glow: 'hover:shadow-red-500/25'
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          border: 'border-gray-500/30',
          text: 'text-gray-400',
          glow: 'hover:shadow-gray-500/25'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Arrays': Layers,
      'Strings': Hash,
      'Trees': GitBranch,
      'Graphs': Activity,
      'Dynamic Programming': Brain,
      'Algorithms': Zap,
      'Data Structures': BookOpen,
      'Math': BarChart3
    };
    return icons[category] || Code;
  };

  const categories = ['All', ...Array.from(new Set(challenges.map(c => c.category)))];

  const difficultyStats = {
    Easy: challenges.filter(c => c.difficulty === 'Easy').length,
    Medium: challenges.filter(c => c.difficulty === 'Medium').length,
    Hard: challenges.filter(c => c.difficulty === 'Hard').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Challenge Yourself</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Code Challenges
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Master algorithms, data structures, and problem-solving with our curated collection
            </p>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">{challenges.length}</span>
                </div>
                <p className="text-sm text-gray-400">Total Challenges</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">85%</span>
                </div>
                <p className="text-sm text-gray-400">Avg Success Rate</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">10K+</span>
                </div>
                <p className="text-sm text-gray-400">Active Solvers</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl font-bold text-white">24/7</span>
                </div>
                <p className="text-sm text-gray-400">Live Competitions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search challenges by name, tags, or description..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl text-white hover:border-purple-500/50 transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {(selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="difficulty">By Difficulty</option>
              <option value="successRate">Success Rate</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 sticky top-4">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Filter Challenges
                </h3>
                
                {/* Difficulty Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-300 mb-4">
                    Difficulty Level
                  </label>
                  <div className="space-y-2">
                    {['All', 'Easy', 'Medium', 'Hard'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedDifficulty(level)}
                        className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center justify-between ${
                          selectedDifficulty === level
                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 text-white'
                            : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {level !== 'All' && (
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(level).bg}`} />
                          )}
                          <span>{level}</span>
                        </span>
                        {level !== 'All' && (
                          <span className="text-xs text-gray-400">
                            {difficultyStats[level]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-300 mb-4">
                    Category
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {categories.map((category) => {
                      const Icon = category !== 'All' ? getCategoryIcon(category) : Layers;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 text-white'
                              : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{category === 'All' ? 'All Categories' : category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl border border-purple-500/20">
                  <h4 className="text-sm font-semibold text-purple-300 mb-3">Your Progress</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-400">Easy</span>
                        <span className="text-gray-400">12/20</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-yellow-400">Medium</span>
                        <span className="text-gray-400">8/15</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{ width: '53%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-400">Hard</span>
                        <span className="text-gray-400">3/10</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSelectedDifficulty('All');
                      setSelectedCategory('All');
                    }}
                    className="mt-6 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Challenges Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                {isFiltering ? (
                  <InlineLoader text="Searching" />
                ) : (
                  <>Showing {filteredChallenges.length} of {challenges.length} challenges</>
                )}
              </p>
              
              {filteredChallenges.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Live Updates</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {isLoading ? (
              <CardSkeleton count={6} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" />
            ) : isFiltering ? (
              <div className="flex items-center justify-center py-24">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredChallenges.map((challenge, index) => {
                  const difficultyStyle = getDifficultyColor(challenge.difficulty);
                  const CategoryIcon = getCategoryIcon(challenge.category);
                  
                  return (
                    <div
                      key={challenge.id}
                      className="group relative animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${difficultyStyle.bg} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                      <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                        {/* Difficulty Bar */}
                        <div className={`h-1 bg-gradient-to-r ${difficultyStyle.bg}`}></div>
                        
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                {challenge.title}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {challenge.description}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${difficultyStyle.bg} text-white shadow-lg`}>
                              {challenge.difficulty}
                            </div>
                          </div>

                          {/* Category & Meta */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-lg">
                              <CategoryIcon className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-gray-300">{challenge.category}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{challenge.timeLimit}ms</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-gray-800/30 rounded-lg">
                              <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-400">Attempts</p>
                              <p className="text-sm font-bold text-white">{challenge.submissionCount}</p>
                            </div>
                            <div className="text-center p-2 bg-gray-800/30 rounded-lg">
                              <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-400">Success</p>
                              <p className="text-sm font-bold text-white">{challenge.successRate}%</p>
                            </div>
                            <div className="text-center p-2 bg-gray-800/30 rounded-lg">
                              <Award className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-400">Points</p>
                              <p className="text-sm font-bold text-white">{challenge.points}</p>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {challenge.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-lg"
                              >
                                #{tag}
                              </span>
                            ))}
                            {challenge.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-lg">
                                +{challenge.tags.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Action Button */}
                          <Link
                            to={`/challenges/${challenge.id}`}
                            className="block w-full"
                          >
                            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 group">
                              <Code className="w-4 h-4" />
                              <span>Solve Challenge</span>
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

            {filteredChallenges.length === 0 && !isLoading && !isFiltering && (
              <div className="text-center py-24">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900/60 rounded-2xl mb-6">
                  <Code className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No challenges found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDifficulty('All');
                    setSelectedCategory('All');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-2xl shadow-purple-500/25 flex items-center justify-center text-white transition-all hover:scale-110 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Zap className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default Challenges;