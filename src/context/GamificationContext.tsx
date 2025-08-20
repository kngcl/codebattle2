import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { achievementService, Achievement } from '../services/achievementService';
import { AchievementNotification } from '../components/Gamification';

interface GamificationContextType {
  showAchievementNotification: (achievement: Achievement) => void;
  checkAchievements: (activity: any) => Promise<void>;
  isNotificationVisible: boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);

  // Show achievement notification
  const showAchievementNotification = (achievement: Achievement) => {
    if (isNotificationVisible) {
      // If notification is already showing, queue this achievement
      setPendingAchievements(prev => [...prev, achievement]);
    } else {
      setCurrentAchievement(achievement);
      setIsNotificationVisible(true);
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setIsNotificationVisible(false);
    setCurrentAchievement(null);
    
    // Show next queued achievement if any
    setTimeout(() => {
      if (pendingAchievements.length > 0) {
        const nextAchievement = pendingAchievements[0];
        setPendingAchievements(prev => prev.slice(1));
        showAchievementNotification(nextAchievement);
      }
    }, 500);
  };

  // Check for achievements based on user activity
  const checkAchievements = async (activity: {
    type: 'challenge_solved' | 'submission_made' | 'streak_updated' | 'collaboration' | 'social_interaction';
    data: any;
  }) => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      const unlockedAchievements = await achievementService.checkAchievements(user.id, activity);
      
      // Show notifications for newly unlocked achievements
      unlockedAchievements.forEach(achievement => {
        showAchievementNotification(achievement);
      });
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  // Auto-check achievements on certain page loads/activities
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // Example: Check login streak achievement on app load
    const checkLoginStreak = async () => {
      const lastLogin = localStorage.getItem(`last_login_${user.id}`);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastLogin !== today) {
        localStorage.setItem(`last_login_${user.id}`, today);
        
        // Check if this extends a streak
        if (lastLogin === yesterday) {
          await checkAchievements({
            type: 'streak_updated',
            data: { streakExtended: true }
          });
        }
      }
    };

    checkLoginStreak();
  }, [isAuthenticated, user?.id]);

  const value = {
    showAchievementNotification,
    checkAchievements,
    isNotificationVisible
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
      
      {/* Global Achievement Notification */}
      <AchievementNotification
        achievement={currentAchievement}
        isVisible={isNotificationVisible}
        onClose={handleNotificationClose}
        autoClose={true}
        duration={6000}
      />
    </GamificationContext.Provider>
  );
};

export default GamificationContext;