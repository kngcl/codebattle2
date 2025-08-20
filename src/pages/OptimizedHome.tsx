import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Code, Trophy, Users, Play, Star, TrendingUp, Target, Clock,
  Zap, Award, BookOpen, Shield, ChevronRight, Sparkles, Brain,
  Rocket, GitBranch, Terminal, Cpu, Globe, Layers, Activity,
  Command, ArrowRight, Github, Twitter, Linkedin, Youtube
} from 'lucide-react';

// Memoized feature card component
const FeatureCard = memo(({ feature, index, isActive, onHover }: any) => (
  <div 
    className={`group relative ${isActive ? 'scale-105' : ''} transition-all duration-500`}
    onMouseEnter={() => onHover(index)}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
    <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 h-full group-hover:translate-y-[-4px] group-hover:shadow-2xl group-hover:shadow-purple-500/20">
      <div className={`relative w-16 h-16 mb-6`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-500`}></div>
        <div className={`relative bg-gradient-to-br ${feature.color} w-full h-full rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          <feature.icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500">
        {feature.title}
      </h3>
      <p className="text-gray-400 leading-relaxed text-sm">
        {feature.description}
      </p>
      <div className="mt-6 flex items-center gap-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <span className="text-sm font-medium">Explore</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  </div>
));

const OptimizedHome: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = useMemo(() => [
    {
      icon: Cpu,
      title: 'AI-Powered Solutions',
      description: 'Get intelligent hints and learn optimal approaches with machine learning',
      color: 'from-violet-600 to-indigo-600'
    },
    {
      icon: Globe,
      title: 'Global Competitions',
      description: 'Compete with developers worldwide in real-time coding battles',
      color: 'from-cyan-600 to-blue-600'
    },
    {
      icon: Layers,
      title: 'Progressive Learning',
      description: 'Structured paths from beginner to expert with adaptive difficulty',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      icon: Activity,
      title: 'Live Analytics',
      description: 'Track your progress with detailed performance metrics and insights',
      color: 'from-rose-600 to-pink-600'
    }
  ], []);

  const stats = useMemo(() => [
    { label: 'Active Developers', value: '50K+', icon: Users, color: 'from-blue-600 to-cyan-600' },
    { label: 'Challenges Solved', value: '2M+', icon: Code, color: 'from-purple-600 to-pink-600' },
    { label: 'Live Battles', value: '500+', icon: Trophy, color: 'from-yellow-500 to-orange-600' },
    { label: 'Success Rate', value: '97%', icon: Target, color: 'from-green-600 to-emerald-600' }
  ], []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleFeatureHover = useCallback((index: number) => {
    setActiveFeature(index);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs with Parallax */}
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: '20%',
            top: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            right: '10%',
            bottom: '20%',
            animationDelay: '2s',
            transform: `translate(${-mousePosition.x * 0.03}px, ${-mousePosition.y * 0.03}px)`
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section with Glassmorphism */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8 animate-fade-in-down">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-300">
                🚀 New: AI Code Review Feature Launched
              </span>
            </div>
            
            {/* Main Heading with Gradient Animation */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="block text-white mb-2">Master</span>
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-2xl opacity-70 animate-pulse"></span>
                <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x bg-300%">
                  Algorithms
                </span>
              </span>
              <span className="block text-white mt-2">Through Battle</span>
            </h1>
            
            {/* Subtitle with Typewriter Effect */}
            <p className="text-xl md:text-2xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join <span className="text-white font-bold">50,000+ developers</span> competing in
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-bold"> real-time coding battles</span> with
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-bold"> AI-powered learning</span>
            </p>
            
            {/* CTA Buttons with Hover Effects */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/challenges"
                    className="group relative px-8 py-4 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Terminal className="w-5 h-5" />
                      Start Coding Now
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  <Link
                    to="/tournaments"
                    className="group px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105"
                  >
                    <span className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Join Live Tournament
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative px-10 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 animate-gradient-x bg-300%"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Rocket className="w-6 h-6" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    to="/login"
                    className="group px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105"
                  >
                    <span className="flex items-center gap-3">
                      <Users className="w-6 h-6" />
                      Sign In
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Animated Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-7 h-12 border-2 border-white/30 rounded-full p-2">
              <div className="w-1 h-3 bg-white/60 rounded-full mx-auto animate-scroll" />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Stats Cards */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 group-hover:translate-y-[-4px]">
                  <div className={`bg-gradient-to-br ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid with Hover Effects */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3 mb-6">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Cutting-Edge Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Built for <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Modern Developers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to excel in technical interviews and competitive programming
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                isActive={activeFeature === index}
                onHover={handleFeatureHover}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 p-12 hover:border-white/20 transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-green-600/10 backdrop-blur-xl border border-green-500/20 rounded-full px-4 py-2 mb-6">
                    <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                    <span className="text-sm font-medium text-green-300">Live Demo</span>
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6">
                    See It In <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">Action</span>
                  </h3>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Watch how our platform helps you solve complex algorithms with AI assistance, 
                    real-time collaboration, and instant feedback.
                  </p>
                  <button className="group px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105">
                    <span className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Watch Demo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-30" />
                  <div className="relative bg-gray-900/90 rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <pre className="text-green-400 text-sm font-mono">
{`function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[0];
  const left = [];
  const right = [];
  
  for (let i = 1; i < arr.length; i++) {
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-400 mb-8">Trusted by developers from</h3>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'].map((company, index) => (
              <div key={index} className="text-white text-xl font-bold hover:opacity-100 transition-opacity">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
            Your Journey to <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text animate-gradient-x bg-300%">Excellence</span> Starts Here
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Don't just learn to code. Master the art of problem-solving and join the elite developers shaping the future.
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl text-white font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 animate-gradient-x bg-300%"
            >
              <Rocket className="w-7 h-7" />
              <span>Start Your Free Journey</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default OptimizedHome;