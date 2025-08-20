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
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Challenges from './pages/Challenges/Challenges';
import ChallengeDetail from './pages/Challenges/ChallengeDetail';
import Tournaments from './pages/Tournaments/Tournaments';
import TournamentDetail from './pages/Tournaments/TournamentDetail';
import Leaderboard from './pages/Leaderboard';
import LiveChallenges from './pages/LiveChallenges/LiveChallenges';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AnalyticsDashboard from './pages/Analytics/AnalyticsDashboard';
import GamificationPage from './pages/Gamification/GamificationPage';
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
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="challenges" element={<Challenges />} />
                    <Route path="challenges/:id" element={<ChallengeDetail />} />
                    <Route path="tournaments" element={<Tournaments />} />
                    <Route path="tournaments/:id" element={<TournamentDetail />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="live" element={<LiveChallenges />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="gamification" element={<GamificationPage />} />
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