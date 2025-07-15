import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Code, 
  Trophy, 
  Users, 
  Play, 
  Star, 
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Code,
      title: 'Code Challenges',
      description: 'Solve algorithmic problems across different difficulty levels',
      color: 'bg-blue-500'
    },
    {
      icon: Trophy,
      title: 'Tournaments',
      description: 'Compete in real-time coding competitions',
      color: 'bg-yellow-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with developers worldwide',
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your coding journey and improvement',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Code Challenges', value: '500+', icon: Code },
    { label: 'Tournaments', value: '50+', icon: Trophy },
    { label: 'Success Rate', value: '85%', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your <span className="text-yellow-400">Coding Skills</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers in challenging coding competitions, 
              solve algorithmic problems, and level up your programming expertise.
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/challenges"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Coding
                </Link>
                <Link
                  to="/tournaments"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
                >
                  Join Tournament
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose CodeBattle?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to become a better programmer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-800">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Dashboard Preview */}
      {isAuthenticated && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.username}!
                  </h2>
                  <p className="text-blue-100 mb-4">
                    Ready to continue your coding journey?
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-300" />
                      <span>Rating: {user?.rating}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span>Solved: {user?.solvedChallenges}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/challenges"
                    className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-full transition-colors"
                  >
                    Continue Practicing
                  </Link>
                  <Link
                    to="/tournaments"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full transition-colors"
                  >
                    Join Tournament
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Level Up Your Coding?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join our community of passionate developers and start your journey today.
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Your Journey</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;