import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageLoader } from '../components/Loaders';
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Shield,
  Palette,
  Code,
  ChevronLeft,
  Save,
  Camera,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Github,
  Linkedin,
  Twitter,
  Link2,
  MapPin,
  Briefcase,
  Calendar,
  Hash,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Settings as SettingsIcon,
  Check,
  X
} from 'lucide-react';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  // Form states
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    challengeUpdates: true,
    tournamentReminders: true,
    weeklyDigest: false,
    achievements: true,
    mentions: true,
    liveAlerts: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    showStatistics: true,
    allowMessages: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    codeTheme: 'monokai',
    fontSize: 'medium',
    animations: true,
    compactMode: false
  });

  const tabs: SettingsTab[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Code }
  ];

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      showSuccess('Profile Updated', 'Your profile has been updated successfully');
      setIsLoading(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    showSuccess('Password Changed', 'Your password has been updated successfully');
  };

  const handleToggleTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    setAppearanceSettings({ ...appearanceSettings, theme: newTheme });
    showSuccess('Theme Updated', `Switched to ${newTheme} mode`);
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Profile Information
              </h3>
              
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-1">
                    <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {profileData.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-all">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-white font-medium">{profileData.username}</p>
                  <p className="text-gray-400 text-sm">Click to change avatar</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.github}
                      onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="GitHub username"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Twitter handle"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="LinkedIn profile"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Account Security
              </h3>
              
              {/* Change Password */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                <h4 className="text-white font-medium mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="mt-6 bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                <h4 className="text-white font-medium mb-4">Two-Factor Authentication</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all">
                  Enable 2FA
                </button>
              </div>

              {/* Delete Account */}
              <div className="mt-6 bg-red-900/20 rounded-xl p-6 border border-red-900/50">
                <h4 className="text-red-400 font-medium mb-4">Danger Zone</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-xl transition-all border border-red-600/50">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div>
                      <p className="text-white font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'challengeUpdates' && 'Get notified about new challenges'}
                        {key === 'tournamentReminders' && 'Reminders for upcoming tournaments'}
                        {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                        {key === 'achievements' && 'Notifications for new achievements'}
                        {key === 'mentions' && 'When someone mentions you'}
                        {key === 'liveAlerts' && 'Real-time alerts during live events'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, [key]: !value })}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {value ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-600" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Appearance Settings
              </h3>
              
              {/* Theme Selection */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Theme</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleToggleTheme('light')}
                    className={`p-4 rounded-xl border ${
                      theme === 'light' 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50' 
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    } transition-all`}
                  >
                    <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-white">Light</p>
                  </button>
                  <button
                    onClick={() => handleToggleTheme('dark')}
                    className={`p-4 rounded-xl border ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50' 
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    } transition-all`}
                  >
                    <Moon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-white">Dark</p>
                  </button>
                  <button
                    onClick={() => handleToggleTheme('system')}
                    className={`p-4 rounded-xl border ${
                      theme === 'system' 
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50' 
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    } transition-all`}
                  >
                    <Monitor className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-white">System</p>
                  </button>
                </div>
              </div>

              {/* Code Editor Theme */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Code Editor Theme</h4>
                <select 
                  value={appearanceSettings.codeTheme}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, codeTheme: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="monokai">Monokai</option>
                  <option value="dracula">Dracula</option>
                  <option value="github">GitHub</option>
                  <option value="vscode">VS Code</option>
                  <option value="sublime">Sublime</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Font Size</h4>
                <div className="flex gap-3">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, fontSize: size })}
                      className={`px-4 py-2 rounded-lg border ${
                        appearanceSettings.fontSize === size
                          ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                          : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:text-white'
                      } transition-all capitalize`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Animations</p>
                    <p className="text-gray-400 text-sm">Enable smooth animations and transitions</p>
                  </div>
                  <button
                    onClick={() => setAppearanceSettings({ ...appearanceSettings, animations: !appearanceSettings.animations })}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {appearanceSettings.animations ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Compact Mode</p>
                    <p className="text-gray-400 text-sm">Reduce spacing for more content</p>
                  </div>
                  <button
                    onClick={() => setAppearanceSettings({ ...appearanceSettings, compactMode: !appearanceSettings.compactMode })}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {appearanceSettings.compactMode ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Privacy Settings
              </h3>
              
              {/* Profile Visibility */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Profile Visibility</h4>
                <select 
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private - Only you</option>
                </select>
              </div>

              {/* Privacy Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Show Email Address</p>
                    <p className="text-gray-400 text-sm">Display your email on your profile</p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ ...privacySettings, showEmail: !privacySettings.showEmail })}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {privacySettings.showEmail ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Show Activity</p>
                    <p className="text-gray-400 text-sm">Let others see your recent activity</p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ ...privacySettings, showActivity: !privacySettings.showActivity })}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {privacySettings.showActivity ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Show Statistics</p>
                    <p className="text-gray-400 text-sm">Display your coding statistics publicly</p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ ...privacySettings, showStatistics: !privacySettings.showStatistics })}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {privacySettings.showStatistics ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Allow Messages</p>
                    <p className="text-gray-400 text-sm">Let other users send you messages</p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({ ...privacySettings, allowMessages: !privacySettings.allowMessages })}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {privacySettings.allowMessages ? (
                      <ToggleRight className="w-8 h-8" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                Coding Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Default Language</label>
                  <select className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Python</option>
                    <option>JavaScript</option>
                    <option>Java</option>
                    <option>C++</option>
                    <option>Go</option>
                    <option>Rust</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Editor Key Bindings</label>
                  <select className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Default</option>
                    <option>Vim</option>
                    <option>Emacs</option>
                    <option>VS Code</option>
                    <option>Sublime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tab Size</label>
                  <select className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>2 spaces</option>
                    <option>4 spaces</option>
                    <option>Tabs</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Auto-complete</p>
                    <p className="text-gray-400 text-sm">Enable code auto-completion</p>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <ToggleRight className="w-8 h-8" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Syntax Highlighting</p>
                    <p className="text-gray-400 text-sm">Highlight code syntax</p>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <ToggleRight className="w-8 h-8" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div>
                    <p className="text-white font-medium">Line Numbers</p>
                    <p className="text-gray-400 text-sm">Show line numbers in editor</p>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <ToggleRight className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Profile</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
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
          <div className="lg:col-span-3">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;