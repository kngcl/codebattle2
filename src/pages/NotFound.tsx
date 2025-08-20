import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ChevronLeft, 
  Code, 
  AlertTriangle,
  Zap,
  Search,
  Terminal,
  Cpu,
  Binary,
  Bug,
  FileX,
  Ghost
} from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [glitchText, setGlitchText] = useState('404');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const randomGlitch = Math.random() > 0.8 
        ? Array.from('404').map((char, i) => 
            Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
          ).join('')
        : '404';
      setGlitchText(randomGlitch);
    }, 100);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const quickLinks = [
    { path: '/', label: 'Home', icon: Home, color: 'from-blue-600 to-cyan-600' },
    { path: '/challenges', label: 'Challenges', icon: Code, color: 'from-purple-600 to-pink-600' },
    { path: '/tournaments', label: 'Tournaments', icon: Zap, color: 'from-orange-600 to-red-600' },
    { path: '/leaderboard', label: 'Leaderboard', icon: Search, color: 'from-green-600 to-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        
        {/* Matrix-like falling characters */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-500/20 text-xs font-mono animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            >
              {Array.from({ length: 20 }, () => 
                String.fromCharCode(33 + Math.floor(Math.random() * 94))
              ).join('')}
            </div>
          ))}
        </div>

        {/* Floating error icons */}
        <div className="absolute inset-0">
          {[Bug, FileX, AlertTriangle, Terminal, Binary].map((Icon, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-10"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <Icon className="w-8 h-8 text-red-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Glitch Effect 404 */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] font-bold leading-none relative">
            {/* Shadow layers for glitch effect */}
            <span className="absolute inset-0 text-red-500/50 animate-glitch-1">{glitchText}</span>
            <span className="absolute inset-0 text-blue-500/50 animate-glitch-2">{glitchText}</span>
            <span className="relative text-white">{glitchText}</span>
          </div>
          
          {/* Error message */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <Ghost className="w-8 h-8 text-purple-400 animate-bounce" />
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
              Page Not Found
            </h1>
            <Ghost className="w-8 h-8 text-purple-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Terminal-style error message */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-left font-mono">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">system.error</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-red-400">
                <span className="text-gray-500">$</span> Error: The requested URL was not found
              </p>
              <p className="text-yellow-400">
                <span className="text-gray-500">→</span> Status Code: 404
              </p>
              <p className="text-blue-400">
                <span className="text-gray-500">→</span> Path: {window.location.pathname}
              </p>
              <p className="text-purple-400">
                <span className="text-gray-500">→</span> Suggestion: Check the URL or navigate to a valid page
              </p>
              <div className="mt-4 text-gray-400">
                <span className="text-green-400">$</span> Redirecting to home in {countdown}s...
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
          Oops! Looks like you've ventured into uncharted territory. 
          This page doesn't exist in our codebase.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all flex items-center gap-2 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-400 mb-6">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity`}></div>
                <div className="relative bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <link.icon className="w-8 h-8 text-gray-400 group-hover:text-white mx-auto mb-2 transition-colors" />
                  <p className="text-sm text-gray-400 group-hover:text-white transition-colors">{link.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fun Easter Egg */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm rounded-full border border-gray-800">
            <Cpu className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span className="text-xs text-gray-400">
              Fun fact: This error page has more animations than bugs in your code!
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(1px, -1px); }
          40% { transform: translate(-1px, 1px); }
          60% { transform: translate(1px, -1px); }
          80% { transform: translate(-1px, 1px); }
        }
        
        @keyframes fall {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
        
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite reverse;
        }
        
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;