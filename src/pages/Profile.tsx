import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, getStorageData } from '../data/mockData';
import { PageLoader, CardSkeleton } from '../components/Loaders';
import {
  User as UserIcon,
  Trophy,
  Code,
  Target,
  Calendar,
  Award,
  Activity,
  TrendingUp,
  Star,
  Zap,
  Shield,
  Swords,
  Crown,
  Medal,
  Hash,
  Mail,
  Clock,
  ChevronRight,
  Edit3,
  Settings,
  LogOut,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Briefcase,
  BookOpen,
  Heart,
  MessageSquare,
  Users,
  Flame,
  Coffee,
  Sparkles
} from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalSolved: 0,
    winRate: 0,
    currentStreak: 0,
    bestRank: 0,
    tournaments: 0,
    achievements: 0
  });

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      navigate('/login');
      return;
    }

    setTimeout(() => {
      const users = getStorageData('codebattle_users', []);
      const currentUser = users.find((u: User) => u.id === authUser.id);
      if (currentUser) {
        setUser(currentUser);
        // Calculate stats
        setStats({
          totalSolved: currentUser.solvedChallenges,
          winRate: Math.floor(Math.random() * 30) + 60,
          currentStreak: Math.floor(Math.random() * 15) + 1,
          bestRank: Math.floor(Math.random() * 50) + 1,
          tournaments: Math.floor(Math.random() * 10) + 1,
          achievements: currentUser.achievements.length
        });
      }
      setIsLoading(false);
    }, 500);
  }, [authUser, isAuthenticated, navigate]);

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-red-400';
    if (rating >= 2100) return 'text-orange-400';
    if (rating >= 1800) return 'text-yellow-400';
    if (rating >= 1500) return 'text-green-400';
    if (rating >= 1200) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getRatingTitle = (rating: number) => {
    if (rating >= 2400) return { title: 'Grandmaster', icon: Crown, color: 'text-red-400' };
    if (rating >= 2100) return { title: 'Master', icon: Shield, color: 'text-orange-400' };
    if (rating >= 1800) return { title: 'Expert', icon: Star, color: 'text-yellow-400' };
    if (rating >= 1500) return { title: 'Specialist', icon: Zap, color: 'text-green-400' };
    if (rating >= 1200) return { title: 'Pupil', icon: Activity, color: 'text-blue-400' };
    return { title: 'Newbie', icon: Users, color: 'text-gray-400' };
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const ratingInfo = getRatingTitle(user.rating);
  const RatingIcon = ratingInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
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

      {/* Profile Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-1">
                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full border border-gray-700 hover:bg-gray-700 transition-all">
                <Edit3 className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{user.username}</h1>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full`}>
                      <RatingIcon className={`w-4 h-4 ${ratingInfo.color}`} />
                      <span className={`text-sm font-medium ${ratingInfo.color}`}>
                        {ratingInfo.title}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className={`text-lg font-bold ${getRatingColor(user.rating)}`}>
                      {user.rating} Rating
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
                <span>•</span>
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>

              {user.bio && (
                <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/settings')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{stats.tournaments}</span>
                </div>
                <p className="text-xs text-gray-400">Tournaments</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-2xl font-bold text-white">{stats.currentStreak}</span>
                </div>
                <p className="text-xs text-gray-400">Day Streak</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-2xl font-bold text-white">{stats.achievements}</span>
                </div>
                <p className="text-xs text-gray-400">Achievements</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-2xl font-bold text-white">#{stats.bestRank}</span>
                </div>
                <p className="text-xs text-gray-400">Best Rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
                <nav className="flex gap-1 p-1">
                  {[
                    { key: 'overview', label: 'Overview', icon: Activity },
                    { key: 'solutions', label: 'Solutions', icon: Code },
                    { key: 'achievements', label: 'Achievements', icon: Award },
                    { key: 'activity', label: 'Activity', icon: Clock }
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
                    {/* Performance Stats */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-400">Problems Solved</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{user.solvedChallenges}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-400">Win Rate</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-400">Rating Points</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{user.rating}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skill Distribution */}
                    <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-5 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h4 className="font-semibold text-white">Skill Distribution</h4>
                      </div>
                      <div className="space-y-3">
                        {[
                          { skill: 'Algorithms', level: 85, color: 'from-blue-600 to-cyan-600' },
                          { skill: 'Data Structures', level: 75, color: 'from-purple-600 to-pink-600' },
                          { skill: 'Dynamic Programming', level: 60, color: 'from-orange-600 to-red-600' },
                          { skill: 'Graph Theory', level: 70, color: 'from-green-600 to-emerald-600' }
                        ].map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">{skill.skill}</span>
                              <span className="text-gray-400">{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all`}
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'solutions' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-center py-12">
                      <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Recent Solutions</h3>
                      <p className="text-gray-400">Your submitted solutions will appear here</p>
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {user.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="relative group animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                          <div className="relative bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-medium text-white">{achievement}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Activity Timeline</h3>
                      <p className="text-gray-400">Your recent activity will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Connect</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <button className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group">
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
                <button className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group">
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                </button>
                <button className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                </button>
                <button className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all group">
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-white">Solved "Two Sum" challenge</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-white">Joined Spring Tournament</p>
                    <p className="text-xs text-gray-400">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-white">Earned "Problem Solver" badge</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Languages */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Favorite Languages</h3>
              </div>
              <div className="space-y-2">
                {['Python', 'JavaScript', 'Java', 'C++'].map((lang, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition-all cursor-default"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-2xl shadow-purple-500/25 flex items-center justify-center text-white transition-all hover:scale-110 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <UserIcon className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default Profile;