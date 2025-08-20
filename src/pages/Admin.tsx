import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageLoader } from '../components/Loaders';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { AreaChart, BarChart, LineChart, PieChart, StatsCard, RadialProgressChart } from '../components/Charts';
import {
  Shield,
  Users,
  Code,
  Trophy,
  BarChart3,
  Settings,
  AlertTriangle,
  Eye,
  UserPlus,
  UserMinus,
  Play,
  Pause,
  ChevronLeft,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Database,
  Server,
  Zap,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  Calendar,
  DollarSign,
  Star,
  Flag
} from 'lucide-react';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock user data for pagination demo
  const mockUsers = Array.from({ length: 157 }, (_, index) => ({
    id: index + 1,
    username: `User${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: Math.random() > 0.9 ? 'admin' : 'user',
    rating: Math.floor(Math.random() * 2000) + 1000,
    joined: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: Math.random() > 0.2 ? 'active' : 'inactive'
  }));

  const userPagination = usePagination({
    totalItems: mockUsers.length,
    itemsPerPage: 10,
    initialPage: 1
  });

  // Mock data for charts
  const userGrowthData = [
    { name: 'Jan', users: 4000, active: 2400 },
    { name: 'Feb', users: 5200, active: 3100 },
    { name: 'Mar', users: 6800, active: 4200 },
    { name: 'Apr', users: 8100, active: 5300 },
    { name: 'May', users: 9500, active: 6200 },
    { name: 'Jun', users: 11200, active: 7400 },
    { name: 'Jul', users: 12540, active: 8950 },
  ];

  const challengesByDifficulty = [
    { name: 'Easy', value: 450, color: '#10b981' },
    { name: 'Medium', value: 620, color: '#f59e0b' },
    { name: 'Hard', value: 175, color: '#ef4444' }
  ];

  const languageUsage = [
    { name: 'Python', value: 2450 },
    { name: 'JavaScript', value: 1980 },
    { name: 'Java', value: 1650 },
    { name: 'C++', value: 1320 },
    { name: 'Go', value: 890 },
    { name: 'Rust', value: 560 }
  ];

  const tournamentStats = [
    { name: 'Q1', completed: 12, active: 3 },
    { name: 'Q2', completed: 18, active: 5 },
    { name: 'Q3', completed: 24, active: 7 },
    { name: 'Q4', completed: 31, active: 8 }
  ];

  // Mock data for admin dashboard
  const [stats, setStats] = useState({
    totalUsers: 12540,
    activeUsers: 8950,
    totalChallenges: 1245,
    totalTournaments: 156,
    monthlyRevenue: 45600,
    systemUptime: 99.9
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'user', action: 'User registration', user: 'john_doe', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'challenge', action: 'Challenge submitted', user: 'admin', time: '5 minutes ago', status: 'pending' },
    { id: 3, type: 'tournament', action: 'Tournament created', user: 'admin', time: '10 minutes ago', status: 'success' },
    { id: 4, type: 'system', action: 'System backup completed', user: 'system', time: '1 hour ago', status: 'success' },
    { id: 5, type: 'error', action: 'Failed login attempt', user: 'unknown', time: '2 hours ago', status: 'error' }
  ]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      showError('Access Denied', 'You do not have admin privileges');
      return;
    }
  }, [isAuthenticated, user, navigate, showError]);

  const handleRefreshStats = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStats({
        totalUsers: stats.totalUsers + Math.floor(Math.random() * 10),
        activeUsers: stats.activeUsers + Math.floor(Math.random() * 5),
        totalChallenges: stats.totalChallenges + Math.floor(Math.random() * 3),
        totalTournaments: stats.totalTournaments + Math.floor(Math.random() * 2),
        monthlyRevenue: stats.monthlyRevenue + Math.floor(Math.random() * 1000),
        systemUptime: 99.9
      });
      setIsLoading(false);
      showSuccess('Stats Updated', 'Dashboard statistics have been refreshed');
    }, 1000);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'challenges', label: 'Challenges', icon: Code },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'system', label: 'System', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                change={12.5}
                changeLabel="this month"
                icon={Users}
                color="#3b82f6"
              />
              <StatsCard
                title="Active Users"
                value={stats.activeUsers}
                change={8.2}
                changeLabel="this week"
                icon={Activity}
                color="#10b981"
              />
              <StatsCard
                title="Challenges"
                value={stats.totalChallenges}
                change={5.1}
                changeLabel="new this week"
                icon={Code}
                color="#8b5cf6"
              />
              <StatsCard
                title="Revenue"
                value={stats.monthlyRevenue}
                prefix="$"
                change={15.3}
                changeLabel="this month"
                icon={DollarSign}
                color="#10b981"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LineChart
                title="User Growth Over Time"
                data={userGrowthData}
                lines={[
                  { dataKey: 'users', color: '#3b82f6', label: 'Total Users' },
                  { dataKey: 'active', color: '#10b981', label: 'Active Users' }
                ]}
                height={300}
              />
              <AreaChart
                title="Monthly Active Users"
                data={userGrowthData}
                dataKey="active"
                color="#10b981"
                height={300}
              />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PieChart
                title="Challenges by Difficulty"
                data={challengesByDifficulty}
                height={250}
              />
              <BarChart
                title="Language Usage"
                data={languageUsage}
                color="#8b5cf6"
                height={250}
              />
              <div className="space-y-4">
                <RadialProgressChart
                  title="System Uptime"
                  value={stats.systemUptime}
                  color="#10b981"
                  size={100}
                  label="Last 30 days"
                />
                <RadialProgressChart
                  title="Storage Used"
                  value={73}
                  color="#f59e0b"
                  size={100}
                  label="of 1TB"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Recent Activity
                  </h3>
                  <button
                    onClick={handleRefreshStats}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm">by {activity.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">User Management</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Users Table */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Joined</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {userPagination.getPageItems(mockUsers).map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/20">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.username}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-600/20 text-gray-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">{user.rating}</td>
                        <td className="px-6 py-4 text-gray-400">{user.joined}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-400 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={userPagination.currentPage}
                totalPages={userPagination.totalPages}
                onPageChange={userPagination.setCurrentPage}
                showSizeChanger
                showQuickJumper
                pageSize={userPagination.itemsPerPage}
                onPageSizeChange={userPagination.setItemsPerPage}
                total={mockUsers.length}
              />
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-white">System Monitoring</h3>
            
            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-green-400" />
                  <h4 className="text-white font-medium">Server Status</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">CPU Usage</span>
                    <span className="text-green-400">45%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-blue-400" />
                  <h4 className="text-white font-medium">Database</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Connection Pool</span>
                    <span className="text-blue-400">78%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-white font-medium">API Health</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-green-400">127ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">All endpoints healthy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Actions */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h4 className="text-white font-medium mb-4">System Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => showSuccess('Backup Started', 'System backup has been initiated')}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all text-left"
                >
                  <Download className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-white font-medium">Backup System</p>
                  <p className="text-gray-400 text-sm">Create system backup</p>
                </button>

                <button
                  onClick={() => showWarning('Maintenance Mode', 'System will enter maintenance mode')}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all text-left"
                >
                  <Settings className="w-5 h-5 text-yellow-400 mb-2" />
                  <p className="text-white font-medium">Maintenance</p>
                  <p className="text-gray-400 text-sm">Enable maintenance mode</p>
                </button>

                <button
                  onClick={() => showSuccess('Cache Cleared', 'System cache has been cleared')}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all text-left"
                >
                  <RefreshCw className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-white font-medium">Clear Cache</p>
                  <p className="text-gray-400 text-sm">Clear system cache</p>
                </button>

                <button
                  onClick={() => showError('Access Denied', 'Only super admins can restart the system')}
                  className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all text-left"
                >
                  <Server className="w-5 h-5 text-red-400 mb-2" />
                  <p className="text-white font-medium">Restart System</p>
                  <p className="text-gray-400 text-sm">Restart application</p>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400">This section is under development</p>
          </div>
        );
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Manage your CodeBattle platform</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                Admin Access
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 text-white border border-red-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;