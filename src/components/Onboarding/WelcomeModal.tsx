import React from 'react';
import { Rocket, Code, Trophy, Users, Zap, X } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onStartTour }) => {
  const { setIsFirstTime } = useOnboarding();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  if (!isOpen) return null;

  const features = [
    {
      icon: Code,
      title: 'Coding Challenges',
      description: 'Solve problems in multiple programming languages'
    },
    {
      icon: Trophy,
      title: 'Tournaments',
      description: 'Compete with other developers in real-time'
    },
    {
      icon: Users,
      title: 'Leaderboards',
      description: 'Track your progress and compete globally'
    },
    {
      icon: Zap,
      title: 'Live Coding',
      description: 'Join live coding sessions and learn together'
    }
  ];

  const handleStartTour = () => {
    onStartTour();
    onClose();
  };

  const handleSkip = () => {
    setIsFirstTime(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleSkip} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`max-w-2xl w-full rounded-2xl shadow-2xl border animate-fade-in ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className="relative p-8 pb-4">
            <button
              onClick={handleSkip}
              className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Welcome to CodeBattle!
                </h1>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Your journey to becoming a coding champion starts here
                </p>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="px-8 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg">
                      <feature.icon className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`p-4 rounded-xl border border-dashed mb-6 text-center ${
              isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-300 bg-gray-50'
            }`}>
              <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className={`font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Ready to get started?
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Take a quick tour to learn the basics, or dive right in!
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleSkip}
                className={`px-6 py-3 font-medium rounded-xl transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Skip for now
              </button>
              <button
                onClick={handleStartTour}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Start Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeModal;