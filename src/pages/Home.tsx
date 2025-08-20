import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader, CardSkeleton, ButtonLoader } from '../components/Loaders';
import { 
  Code, 
  Trophy, 
  Users, 
  Play, 
  Star, 
  TrendingUp,
  Target,
  Clock,
  Zap,
  Award,
  BookOpen,
  Shield,
  ChevronRight,
  Sparkles,
  Brain,
  Rocket,
  GitBranch,
  Terminal
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  const features = [
    {
      icon: Code,
      title: 'Real-World Challenges',
      description: 'Practice with problems from top tech companies',
      color: 'from-blue-600 to-cyan-500',
      bgPattern: 'bg-gradient-to-br'
    },
    {
      icon: Trophy,
      title: 'Live Tournaments',
      description: 'Compete globally in real-time coding battles',
      color: 'from-yellow-500 to-orange-500',
      bgPattern: 'bg-gradient-to-br'
    },
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Get personalized hints and solution analysis',
      color: 'from-purple-600 to-pink-500',
      bgPattern: 'bg-gradient-to-br'
    },
    {
      icon: GitBranch,
      title: 'Collaborative Coding',
      description: 'Team up with others for pair programming',
      color: 'from-green-600 to-teal-500',
      bgPattern: 'bg-gradient-to-br'
    }
  ];

  const stats = [
    { label: 'Active Developers', value: '25,000+', icon: Users, increment: 2500 },
    { label: 'Problems Solved', value: '1M+', icon: Code, increment: 100000 },
    { label: 'Live Competitions', value: '150+', icon: Trophy, increment: 15 },
    { label: 'Success Stories', value: '95%', icon: Target, increment: 9.5 }
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate features loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturesLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        const intervals = stats.map((stat, index) => {
          const finalValue = parseInt(stat.value.replace(/[^0-9]/g, ''));
          const increment = finalValue / 50;
          
          return setInterval(() => {
            setCounters(prev => {
              const newCounters = [...prev];
              if (newCounters[index] < finalValue) {
                newCounters[index] = Math.min(newCounters[index] + increment, finalValue);
              }
              return newCounters;
            });
          }, 30);
        });

        return () => intervals.forEach(clearInterval);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const formatCounter = (value: number, format: string) => {
    if (format.includes('M')) {
      return `${Math.floor(value / 1000000)}M+`;
    } else if (format.includes('%')) {
      return `${Math.floor(value)}%`;
    } else if (format.includes(',')) {
      return value.toLocaleString() + '+';
    }
    return Math.floor(value).toString() + '+';
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">AI-Powered Code Learning Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Code. Compete.
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Conquer.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Master algorithms through <span className="text-white font-semibold">real-time battles</span>, 
              learn from <span className="text-white font-semibold">AI-powered insights</span>, 
              and join a community of <span className="text-white font-semibold">25,000+ developers</span>
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/challenges"
                  className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Start Coding
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/tournaments"
                  className="group bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Join Live Battle
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Start Free
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="group bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Sign In
                  </span>
                </Link>
              </div>
            )}

            {/* Scroll Indicator */}
            <div className="mt-16 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full relative">
                <div className="absolute w-1 h-3 bg-white/60 rounded-full left-1/2 transform -translate-x-1/2 top-2 animate-scroll"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all">
                  <div className={`bg-gradient-to-br ${features[index % features.length].color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2 tabular-nums">
                    {formatCounter(counters[index], stat.value)}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built by developers, for developers who want to push their limits
            </p>
          </div>
          
          {featuresLoading ? (
            <CardSkeleton count={4} className="md:grid-cols-2 lg:grid-cols-4" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`group relative ${activeFeature === index ? 'scale-105' : ''} transition-all duration-500 animate-fade-in`}
                  onMouseEnter={() => setActiveFeature(index)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 ${feature.bgPattern} ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>
                  <div className="relative bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-transparent transition-all duration-300 h-full">
                    <div className={`${feature.bgPattern} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-teal-600/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Journey to{' '}
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Mastery
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Path',
                description: 'Select from beginner to expert challenges, or jump into live competitions',
                icon: Target
              },
              {
                step: '02',
                title: 'Code & Learn',
                description: 'Write solutions, get instant feedback, and learn from AI-powered hints',
                icon: Brain
              },
              {
                step: '03',
                title: 'Track Progress',
                description: 'Monitor your growth, earn achievements, and climb the global leaderboard',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition-all">
                  <div className="text-6xl font-bold text-gray-800 mb-4">{item.step}</div>
                  <item.icon className="w-10 h-10 text-green-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Dashboard Preview */}
      {isAuthenticated && (
        <section className="relative z-10 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-1">
                <div className="bg-gray-950 rounded-3xl p-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">
                          Welcome back, {user?.username}!
                        </h2>
                      </div>
                      <p className="text-gray-300 mb-6 text-lg">
                        You're on fire! Keep the momentum going.
                      </p>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-500/20 p-2 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Rating</p>
                            <p className="text-white font-bold text-xl">{user?.rating}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500/20 p-2 rounded-lg">
                            <Trophy className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Solved</p>
                            <p className="text-white font-bold text-xl">{user?.solvedChallenges}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/challenges"
                        className="group bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-full transition-all flex items-center gap-2"
                      >
                        <Terminal className="w-5 h-5" />
                        Continue Coding
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/tournaments"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-full transition-all"
                      >
                        Join Battle
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Senior Developer at Google',
                content: 'CodeBattle helped me ace my technical interviews. The real-time competitions are incredibly valuable.',
                rating: 5
              },
              {
                name: 'Alex Kumar',
                role: 'Full Stack Developer',
                content: 'The AI-powered hints are game-changing. I learn something new with every challenge I solve.',
                rating: 5
              },
              {
                name: 'Maria Garcia',
                role: 'Software Engineer at Meta',
                content: 'Best platform for competitive programming. The community is supportive and the challenges are top-notch.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Level Up?
            </span>
          </h2>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
            Join 25,000+ developers who are mastering algorithms and winning competitions every day.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 inline-flex items-center gap-3"
              >
                <Rocket className="w-6 h-6" />
                <span>Start Coding for Free</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>5 minute setup</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;