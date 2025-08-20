import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ButtonLoader } from '../../components/Loaders';
import { 
  Code, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  Github,
  Chrome,
  User,
  KeyRound
} from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'codemaster@example.com', password: 'demo123', role: 'Admin', color: 'from-purple-600 to-pink-600' },
    { email: 'algo@example.com', password: 'demo123', role: 'User', color: 'from-blue-600 to-cyan-600' }
  ];

  const loginWithDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
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
              <div className="w-1 h-1 bg-purple-500/30 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-2xl shadow-purple-500/25">
            <Code className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to continue your coding journey</p>
        </div>

        {/* Main Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800 p-8">
            
            {/* Demo Accounts */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Quick Access</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => loginWithDemo(account.email, account.password)}
                    className={`relative group/demo p-3 rounded-xl bg-gradient-to-r ${account.color} bg-opacity-10 border border-gray-700 hover:border-purple-500/50 transition-all`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${account.color} rounded-xl opacity-0 group-hover/demo:opacity-10 transition-opacity`}></div>
                    <div className="relative">
                      <div className="flex items-center justify-center mb-2">
                        {account.role === 'Admin' ? (
                          <Shield className="w-5 h-5 text-purple-400" />
                        ) : (
                          <User className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-xs text-white font-medium">{account.role}</p>
                      <p className="text-xs text-gray-500">Demo Account</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/80 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-800 border-gray-600 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <ButtonLoader
                loading={loading}
                loadingText="Signing in..."
                className="w-full"
                variant="primary"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </span>
              </ButtonLoader>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm">GitHub</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
                >
                  <Chrome className="w-5 h-5" />
                  <span className="text-sm">Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
            >
              Sign up for free
              <Zap className="w-4 h-4" />
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="text-gray-500">
            <div className="text-2xl font-bold text-purple-400 mb-1">500+</div>
            <div className="text-xs">Challenges</div>
          </div>
          <div className="text-gray-500">
            <div className="text-2xl font-bold text-pink-400 mb-1">10K+</div>
            <div className="text-xs">Developers</div>
          </div>
          <div className="text-gray-500">
            <div className="text-2xl font-bold text-orange-400 mb-1">24/7</div>
            <div className="text-xs">Competitions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;