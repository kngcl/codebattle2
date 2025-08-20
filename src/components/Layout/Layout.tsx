import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EnhancedNavbar from './EnhancedNavbar';
import Footer from './Footer';
import { OnboardingOverlay, WelcomeModal } from '../Onboarding';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { getTourByPage } from '../../data/onboardingTours';

const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isFirstTime, startOnboarding } = useOnboarding();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome modal for first-time authenticated users on home page
    if (isAuthenticated && isFirstTime && location.pathname === '/') {
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1000); // Delay to let the page load
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isFirstTime, location.pathname]);

  const handleStartTour = () => {
    const tour = getTourByPage(location.pathname);
    if (tour) {
      startOnboarding(tour);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-x-hidden">
      <EnhancedNavbar />
      <main className="flex-1 overflow-x-hidden pt-16">
        <Outlet />
      </main>
      <Footer />
      
      {/* Onboarding Components */}
      <OnboardingOverlay />
      <WelcomeModal 
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStartTour={handleStartTour}
      />
    </div>
  );
};

export default Layout;