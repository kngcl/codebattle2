import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { GamificationProvider } from './context/GamificationContext';
import { initializeData } from './data/mockData';
import { PageLoader } from './components/Loaders';
import Layout from './components/Layout/Layout';
import OptimizedHome from './pages/OptimizedHome';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import OptimizedChallenges from './pages/Challenges/OptimizedChallenges';
import ChallengeDetail from './pages/Challenges/ChallengeDetail';
import OptimizedTournaments from './pages/Tournaments/OptimizedTournaments';
import TournamentDetail from './pages/Tournaments/TournamentDetail';
import OptimizedLeaderboard from './pages/OptimizedLeaderboard';
import OptimizedLiveChallenges from './pages/LiveChallenges/OptimizedLiveChallenges';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import OptimizedAnalytics from './pages/Analytics/OptimizedAnalytics';
import OptimizedGamification from './pages/Gamification/OptimizedGamification';
import NotFound from './pages/NotFound';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeData();
    // Simulate app initialization
    setTimeout(() => {
      setIsInitializing(false);
    }, 500);
  }, []);

  if (isInitializing) {
    return <PageLoader />;
  }

  return (
    <ThemeProvider>
      <OnboardingProvider>
        <AuthProvider>
          <GamificationProvider>
            <ToastProvider>
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<OptimizedHome />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="challenges" element={<OptimizedChallenges />} />
                    <Route path="challenges/:id" element={<ChallengeDetail />} />
                    <Route path="tournaments" element={<OptimizedTournaments />} />
                    <Route path="tournaments/:id" element={<TournamentDetail />} />
                    <Route path="leaderboard" element={<OptimizedLeaderboard />} />
                    <Route path="live" element={<OptimizedLiveChallenges />} />
                    <Route path="analytics" element={<OptimizedAnalytics />} />
                    <Route path="gamification" element={<OptimizedGamification />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </ToastProvider>
        </GamificationProvider>
        </AuthProvider>
      </OnboardingProvider>
    </ThemeProvider>
  );
}

export default App;