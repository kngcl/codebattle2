import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Code, 
  Home, 
  Trophy, 
  Users, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Play,
  Search,
  Bell,
  Command,
  Sparkles,
  BarChart3,
  Star,
  Crown,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { UserLevelDisplay } from '../Gamification';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showInfo } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home, priority: 1 },
    { path: '/challenges', label: 'Challenges', icon: Code, priority: 1 },
    { path: '/tournaments', label: 'Tournaments', icon: Trophy, priority: 2 },
    { path: '/live', label: 'Live', icon: Play, priority: 2 },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, priority: 3 },
    { path: '/gamification', label: 'Achievements', icon: Star, priority: 3 },
    { path: '/leaderboard', label: 'Leaderboard', icon: Users, priority: 3 },
  ];

  // Split nav items by priority for responsive design
  const primaryNavItems = navItems.filter(item => item.priority === 1);
  const secondaryNavItems = navItems.filter(item => item.priority === 2);
  const tertiaryNavItems = navItems.filter(item => item.priority === 3);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/challenges?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      showInfo('Search', `Searching for "${searchQuery}"`);
    }
  };

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CodeBattle</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 mx-2">
            {/* Primary Navigation Items (Always visible) */}
            <div className="flex items-center space-x-2 xl:space-x-4">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden text-xs">{item.label.split(' ')[0]}</span>
                </Link>
              ))}
            </div>

            {/* Secondary Navigation Items (Hidden on smaller large screens) */}
            <div className="hidden xl:flex items-center space-x-4 ml-2">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* More Menu for Hidden Items */}
            <div className="relative ml-2" ref={moreMenuRef}>
              {(secondaryNavItems.length > 0 || tertiaryNavItems.length > 0) && (
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={`xl:hidden flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                    [...secondaryNavItems, ...tertiaryNavItems].some(item => isActive(item.path))
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}

              {/* More Menu for Tertiary Items on XL screens */}
              {tertiaryNavItems.length > 0 && (
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={`hidden xl:flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    tertiaryNavItems.some(item => isActive(item.path))
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}

              {/* Dropdown Menu */}
              {isMoreMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
                  <div className="py-2">
                    {/* Show secondary items on smaller screens */}
                    <div className="xl:hidden">
                      {secondaryNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMoreMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                            isActive(item.path)
                              ? 'bg-purple-600/20 text-purple-300 border-r-2 border-purple-500'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      {secondaryNavItems.length > 0 && tertiaryNavItems.length > 0 && (
                        <div className="my-1 border-t border-gray-700" />
                      )}
                    </div>

                    {/* Always show tertiary items in dropdown */}
                    {tertiaryNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMoreMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                          isActive(item.path)
                            ? 'bg-purple-600/20 text-purple-300 border-r-2 border-purple-500'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs mx-3">
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-400 hover:border-purple-500/50 transition-all group"
                >
                  <Search className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">Search...</span>
                  <div className="ml-auto flex items-center gap-1 text-xs flex-shrink-0">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Notifications */}
            {isAuthenticated && (
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 lg:space-x-3">
                {/* User Level Display - Only show on larger screens */}
                <div className="hidden xl:block">
                  <UserLevelDisplay compact={true} showDetails={false} />
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 lg:space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm font-medium truncate max-w-24">
                    {user?.username}
                  </span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden lg:inline text-sm">Admin</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-blue-400 hover:bg-gray-800 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Medium screen navigation - show condensed nav items */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-900 text-blue-300'
                    : 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* Mobile User Menu */}
          <div className="border-t border-gray-800 px-2 pt-3 pb-2">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>{user?.username}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>

    {/* Search Modal */}
    {isSearchOpen && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>
        <div ref={searchRef} className="relative w-full max-w-2xl animate-fade-in">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges, tournaments, users..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </form>
            
            {/* Quick Links */}
            <div className="px-4 pb-4">
              <div className="text-xs text-gray-500 mb-2">Quick Links</div>
              <div className="space-y-1">
                {[
                  { label: 'Easy Challenges', icon: Sparkles, query: 'difficulty:easy' },
                  { label: 'Active Tournaments', icon: Trophy, query: 'tournament:active' },
                  { label: 'Live Battles', icon: Play, query: 'live:true' }
                ].map((quick, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(quick.query);
                      handleSearch(new Event('submit') as any);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-all text-left group"
                  >
                    <quick.icon className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                    <span className="text-sm text-gray-400 group-hover:text-white">{quick.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Search Tips */}
            <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">Press</span>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">↵</kbd>
                    <span className="text-gray-500">to search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">ESC</kbd>
                    <span className="text-gray-500">to close</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;