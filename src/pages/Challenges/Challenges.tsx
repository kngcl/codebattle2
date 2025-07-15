import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Challenge, getStorageData } from '../../data/mockData';
import { 
  Search, 
  Filter, 
  Code, 
  Clock, 
  Users, 
  Trophy,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    const storedChallenges = getStorageData('codebattle_challenges', []);
    setChallenges(storedChallenges);
    setFilteredChallenges(storedChallenges);
  }, []);

  useEffect(() => {
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
        case 'submissions':
          return b.submissionCount - a.submissionCount;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredChallenges(filtered);
  }, [challenges, searchTerm, selectedDifficulty, selectedCategory, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-900 text-green-400';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-400';
      case 'Hard':
        return 'bg-red-900 text-red-400';
      default:
        return 'bg-gray-900 text-gray-400';
    }
  };

  const categories = ['All', ...Array.from(new Set(challenges.map(c => c.category)))];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Code Challenges</h1>
              <p className="mt-2 text-gray-400">
                Sharpen your coding skills with our curated collection of algorithmic problems
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <Code className="w-4 h-4 mr-1" />
                {challenges.length} challenges
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search challenges..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="title">Title</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="successRate">Success Rate</option>
                  <option value="submissions">Submissions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing {filteredChallenges.length} of {challenges.length} challenges
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-800 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {challenge.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-400">
                        {challenge.category}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.timeLimit}ms</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{challenge.submissionCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{challenge.successRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {challenge.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {challenge.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
                          +{challenge.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/challenges/${challenge.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
                    >
                      Solve Challenge
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Code className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No challenges found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;