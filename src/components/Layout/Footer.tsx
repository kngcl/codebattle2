import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube,
  Mail,
  Heart,
  Star,
  Zap,
  Coffee,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: 'Home', path: '/' },
      { label: 'Challenges', path: '/challenges' },
      { label: 'Tournaments', path: '/tournaments' },
      { label: 'Live Battles', path: '/live' },
      { label: 'Leaderboard', path: '/leaderboard' }
    ],
    Resources: [
      { label: 'Documentation', path: '#', external: true },
      { label: 'API Reference', path: '#', external: true },
      { label: 'Tutorials', path: '#', external: true },
      { label: 'Blog', path: '#', external: true },
      { label: 'Community', path: '#', external: true }
    ],
    Company: [
      { label: 'About Us', path: '#' },
      { label: 'Careers', path: '#' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
      { label: 'Contact', path: '#' }
    ],
    Support: [
      { label: 'Help Center', path: '#' },
      { label: 'FAQ', path: '#' },
      { label: 'Report Bug', path: '#' },
      { label: 'Feature Request', path: '#' },
      { label: 'Status', path: '#', external: true }
    ]
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Challenges' },
    { value: '50+', label: 'Tournaments' },
    { value: '24/7', label: 'Live Battles' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CodeBattle</span>
              </Link>
              <p className="text-gray-400 text-sm mb-6">
                Master algorithms, compete in tournaments, and become a coding champion.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      {link.external ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors group"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors group"
                        >
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{link.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-6">
              Get the latest challenges and tournament updates delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} CodeBattle. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by developers
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                <Coffee className="w-4 h-4" />
                Buy us a coffee
              </button>
              <button className="text-gray-400 hover:text-yellow-400 text-sm flex items-center gap-1 transition-colors">
                <Star className="w-4 h-4" />
                Star on GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Fun Easter Egg */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
            <span className="text-xs text-white font-medium">
              You found the secret footer message! 🎉
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;