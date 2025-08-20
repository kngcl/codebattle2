import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Code, Home, Trophy, Users, User, Settings, LogOut, Menu, X,
  Play, Search, Bell, Command, BarChart3, Star, ChevronDown,
  Sparkles, Zap, Globe, Activity, Layers, Shield, Github
} from 'lucide-react';

// Memoized navigation item component
const NavItem = memo(({ item, isActive, onClick }: any) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`
      relative group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
      transition-all duration-300 whitespace-nowrap
      ${isActive 
        ? 'text-white' 
        : 'text-gray-400 hover:text-white'
      }
    `}
  >
    {/* Hover Background Effect */}
    <div className={`
      absolute inset-0 rounded-xl transition-all duration-300
      ${isActive 
        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm' 
        : 'bg-transparent group-hover:bg-white/5'
      }
    `} />
    
    {/* Active Indicator */}
    {isActive && (
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
    )}
    
    {/* Icon with Animation */}
    <item.icon className={`
      relative z-10 w-4 h-4 transition-all duration-300
      ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'}
      group-hover:scale-110
    `} />
    
    {/* Label */}
    <span className="relative z-10 hidden lg:inline">{item.label}</span>
  </Link>
));

const OptimizedNavbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/challenges', label: 'Challenges', icon: Code },
    { path: '/tournaments', label: 'Tournaments', icon: Trophy },
    { path: '/live', label: 'Live', icon: Play },
    { path: '/gamification', label: 'Achievements', icon: Star },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/leaderboard', label: 'Leaderboard', icon: Users },
  ];

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsProfileOpen(false);
  }, [logout]);

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
            {/* Logo Section */}
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

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  item={item} 
                  isActive={isActive(item.path)}
                />
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-all duration-300 group"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm hidden lg:inline">Search</span>
                <div className="hidden lg:flex items-center gap-1 text-xs bg-white/10 px-2 py-0.5 rounded">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </button>

              {/* Notifications */}
              {isAuthenticated && (
                <button className="relative p-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-gray-400 hover:text-white transition-all duration-300">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                      {notifications}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 group"
                  >
                    <div className="w-7 h-7 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white hidden lg:inline">
                      {user?.username}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user?.username}</p>
                            <p className="text-xs text-gray-400">Level 12 • 2,450 XP</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">My Profile</span>
                        </Link>
                        
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Admin Panel</span>
                          </Link>
                        )}
                        
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
                          onClick={handleLogout}
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

              {/* Mobile Menu Button */}
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
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsSearchOpen(false)} />
          
          <div ref={searchRef} className="relative w-full max-w-2xl">
            <div className="bg-black/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search challenges, users, tournaments..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="px-4 pb-4">
                <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
                <div className="space-y-1">
                  {[
                    { label: 'Easy Challenges', icon: Sparkles },
                    { label: 'Live Tournaments', icon: Trophy },
                    { label: 'Top Players', icon: Users }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-all text-left group"
                    >
                      <action.icon className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
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

export default memo(OptimizedNavbar);