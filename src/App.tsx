import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeData } from './data/mockData';
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

function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <Router>
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
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;