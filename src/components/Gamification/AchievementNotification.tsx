import React, { useState, useEffect } from 'react';
import { Achievement } from '../../services/achievementService';
import { useTheme } from '../../context/ThemeContext';
import {
  Trophy, Star, Award, X, Sparkles, Crown, Zap
} from 'lucide-react';
import { createPortal } from 'react-dom';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const { actualTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && achievement) {
      setIsAnimating(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, achievement, autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-800';
      case 'rare': return 'from-blue-600 to-blue-800';
      case 'epic': return 'from-purple-600 to-purple-800';
      case 'legendary': return 'from-yellow-600 to-orange-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500';
      case 'rare': return 'border-blue-500';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  const getRarityParticles = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return Array.from({ length: 20 }, (_, i) => i);
      case 'epic': return Array.from({ length: 15 }, (_, i) => i);
      case 'rare': return Array.from({ length: 10 }, (_, i) => i);
      default: return Array.from({ length: 5 }, (_, i) => i);
    }
  };

  if (!isVisible || !achievement) {
    return null;
  }

  const notification = (
    <div className={`
      fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none
      transition-all duration-500 ease-out
      ${isAnimating ? 'opacity-100' : 'opacity-0'}
    `}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Notification Container */}
      <div className={`
        relative pointer-events-auto transform transition-all duration-500 ease-out
        ${isAnimating 
          ? 'scale-100 translate-y-0' 
          : 'scale-75 translate-y-8'
        }
      `}>
        {/* Particle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {getRarityParticles(achievement.rarity).map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 rounded-full animate-ping
                ${achievement.rarity === 'legendary' ? 'bg-yellow-400' :
                  achievement.rarity === 'epic' ? 'bg-purple-400' :
                  achievement.rarity === 'rare' ? 'bg-blue-400' :
                  'bg-gray-400'
                }
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>

        {/* Main Notification Card */}
        <div className={`
          relative bg-gradient-to-br ${getRarityColor(achievement.rarity)}
          rounded-2xl border-2 ${getRarityBorder(achievement.rarity)}
          p-8 max-w-md w-full mx-auto shadow-2xl overflow-hidden
        `}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full border border-white transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border border-white transform -translate-x-12 translate-y-12" />
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all group"
          >
            <X className="w-5 h-5 text-white/70 group-hover:text-white" />
          </button>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-3xl
                    bg-white/10 backdrop-blur-sm border border-white/20
                    animate-pulse
                  `}>
                    {achievement.icon || <Trophy className="w-10 h-10 text-white" />}
                  </div>
                  
                  {/* Glow Effect */}
                  <div className={`
                    absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse
                    ${achievement.rarity === 'legendary' ? 'bg-yellow-400' :
                      achievement.rarity === 'epic' ? 'bg-purple-400' :
                      achievement.rarity === 'rare' ? 'bg-blue-400' :
                      'bg-gray-400'
                    }
                  `} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Achievement Unlocked!
              </h2>
              
              <div className={`
                inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500' :
                  achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border border-purple-500' :
                  achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300 border border-blue-500' :
                  'bg-gray-500/20 text-gray-300 border border-gray-500'
                }
              `}>
                {achievement.rarity} Achievement
              </div>
            </div>

            {/* Achievement Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {achievement.description}
                </p>
              </div>

              {/* Points Reward */}
              <div className="flex items-center justify-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-white">
                  +{achievement.points} XP
                </span>
              </div>

              {/* Special Effects for Legendary */}
              {achievement.rarity === 'legendary' && (
                <div className="flex items-center justify-center gap-2 text-yellow-300 animate-pulse">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Legendary Achievement!</span>
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all backdrop-blur-sm border border-white/30 hover:border-white/50"
            >
              Awesome!
            </button>
          </div>

          {/* Sparkle Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }, (_, i) => (
              <Sparkles
                key={i}
                className={`
                  absolute w-4 h-4 text-yellow-300 animate-ping opacity-70
                  ${achievement.rarity === 'legendary' ? 'animate-bounce' : ''}
                `}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(notification, document.body);
};

export default AchievementNotification;