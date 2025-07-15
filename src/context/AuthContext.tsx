import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getStorageData, setStorageData } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = getStorageData('codebattle_currentUser', null);
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getStorageData('codebattle_users', []);
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser) {
      // In a real app, you'd verify the password
      setUser(foundUser);
      setIsAuthenticated(true);
      setStorageData('codebattle_currentUser', foundUser);
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = getStorageData('codebattle_users', []);
    const existingUser = users.find((u: User) => u.email === email || u.username === username);
    
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: 'user',
      rating: 1200,
      solvedChallenges: 0,
      joinedAt: new Date().toISOString(),
      achievements: []
    };

    users.push(newUser);
    setStorageData('codebattle_users', users);
    setUser(newUser);
    setIsAuthenticated(true);
    setStorageData('codebattle_currentUser', newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('codebattle_currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};