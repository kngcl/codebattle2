import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Code, Home, Trophy, Users, User, Settings, LogOut, Menu, X,
  Play, Search, Bell, Command, BarChart3, Star, ChevronDown,
  Sparkles, Grid3x3, Activity, Shield, Github, Layers
} from 'lucide-react';

// Smart Navigation Select Component
const SmartNavSelect = memo(({ navItems, currentPath, onNavigate }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentItem = navItems.find((item: any) => item.path === currentPath) || navItems[0];
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 min-w-[180px]"
      >
        <currentItem.icon className="w-4 h-4 text-purple-400" />
        <span className="text-white font-medium">{currentItem.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down">
          <div className="p-2">
            {navItems.map((item: any, index: number) => {
              const isActive = item.path === currentPath;
              const Icon = item.icon;
              
              return (
                <React.Fragment key={item.path}>
                  {item.separator && index > 0 && (
                    <div className="my-2 border-t border-white/10" />
                  )}
                  <Link
                    to={item.path}
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate(item.path);
                    }}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-purple-600/20' : 'bg-white/5'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs opacity-70">{item.description}</div>
                      )}
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        item.badge === 'NEW' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : item.badge === 'LIVE'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

const EnhancedNavbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState(5);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Enhanced navigation items with descriptions and badges
  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      description: 'Dashboard & Overview'
    },
    { 
      path: '/challenges', 
      label: 'Challenges', 
      icon: Code,
      description: 'Practice coding problems',
      badge: 'NEW'
    },
    { 
      path: '/tournaments', 
      label: 'Tournaments', 
      icon: Trophy,
      description: 'Competitive battles',
      badge: 'LIVE'
    },
    { 
      path: '/live', 
      label: 'Live Coding', 
      icon: Play,
      description: 'Real-time competitions'
    },
    { 
      path: '/gamification', 
      label: 'Achievements', 
      icon: Star,
      description: 'Track your progress',
      separator: true
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Performance insights'
    },
    { 
      path: '/leaderboard', 
      label: 'Leaderboard', 
      icon: Users,
      description: 'Global rankings'
    },
  ];

  // Primary nav items for desktop
  const primaryNavItems = navItems.slice(0, 4);
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled 
          ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/50' 
          : 'bg-transparent'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-black text-white hidden sm:inline">
                Code<span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Battle</span>
              </span>
            </Link>

            {/* Desktop Navigation - Primary Items + Smart Select */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Primary Navigation Items */}
              {primaryNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'text-white bg-white/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        item.badge === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              {/* Smart Select for More Items */}
              <SmartNavSelect 
                navItems={navItems}
                currentPath={location.pathname}
                onNavigate={handleNavigation}
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-all duration-300"
                  title="Search (⌘K)"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications */}
                {isAuthenticated && (
                  <button className="relative p-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-all duration-300">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {notifications}
                      </span>
                    )}
                  </button>
                )}

                {/* Quick Stats */}
                {isAuthenticated && (
                  <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white font-medium">1,337</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white font-medium">Lv 12</span>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/30 rounded-xl transition-all duration-300"
                  >
                    <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white hidden lg:inline">
                      {user?.username}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Enhanced Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down">
                      {/* Profile Header */}
                      <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                            <User className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-white">{user?.username}</p>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs text-gray-300">Level 12</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-purple-400" />
                                <span className="text-xs text-gray-300">2,450 XP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">My Profile</span>
                        </Link>
                        
                        <Link
                          to="/gamification"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm">Achievements</span>
                          <span className="ml-auto px-2 py-0.5 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                            3 New
                          </span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Settings</span>
                        </Link>
                        
                        <div className="my-2 border-t border-white/10" />
                        
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white hover:text-purple-400 transition-colors duration-300 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu */}
              <button
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-2xl border-t border-white/10 animate-fade-in-down">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        item.badge === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsSearchOpen(false)} />
          
          <div ref={searchRef} className="relative w-full max-w-3xl">
            <div className="bg-black/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search challenges, tournaments, users..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">ESC</kbd>
                </div>
              </div>
              
              {/* Quick Actions Grid */}
              <div className="p-6">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Quick Actions</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Easy Challenges', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
                    { label: 'Live Tournaments', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
                    { label: 'Top Players', icon: Users, color: 'from-purple-500 to-pink-500' },
                    { label: 'Recent Activity', icon: Activity, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Your Progress', icon: BarChart3, color: 'from-red-500 to-pink-500' },
                    { label: 'Help Center', icon: Shield, color: 'from-gray-500 to-gray-600' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 group"
                    >
                      <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-white">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(EnhancedNavbar);