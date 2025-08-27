import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Palette, 
  Clock, 
  Save, 
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface UserSettingsProps {
  user: any;
  onUpdate?: (settings: any) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user, onUpdate }) => {
  const [settings, setSettings] = useState({
    // Appearance
    theme: 'system', // light, dark, system
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Notifications
    notifications: {
      email: {
        observations: true,
        evaluations: true,
        reminders: true,
        systemUpdates: false,
        weeklyDigest: true
      },
      push: {
        observations: true,
        evaluations: true,
        reminders: true,
        systemUpdates: false
      },
      inApp: {
        observations: true,
        evaluations: true,
        reminders: true,
        systemUpdates: true
      }
    },
    
    // Privacy
    privacy: {
      profileVisibility: 'school', // public, school, division, private
      showEmail: false,
      showPhone: false,
      allowDirectMessages: true
    },
    
    // Dashboard
    dashboard: {
      defaultView: 'overview', // overview, observations, schedule
      showUpcomingObservations: true,
      showRecentActivity: true,
      observationsPerPage: 25,
      autoRefresh: true,
      refreshInterval: 30000 // 30 seconds
    }
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setSettings(prevSettings => ({
        ...prevSettings,
        ...user.preferences
      }));
    }
  }, [user]);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedSettingChange = (category: string, subcategory: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Here you would call your API to save user preferences
      // await coreApi.users.updatePreferences(user.id, settings);
      onUpdate?.(settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const SettingSection: React.FC<{ title: string; description: string; icon: React.ReactNode; children: React.ReactNode }> = 
    ({ title, description, icon, children }) => (
    <div className="bg-white rounded-lg border border-sas-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        {icon}
        <div>
          <h3 className="text-lg font-semibold text-sas-gray-900">{title}</h3>
          <p className="text-sm text-sas-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label: string; description?: string }> = 
    ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium text-sas-gray-900">{label}</div>
        {description && <div className="text-sm text-sas-gray-500">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sas-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-sas-blue-600' : 'bg-sas-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-sas-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sas-gray-900">Settings</h1>
          <p className="text-sas-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <SettingSection
            title="Appearance"
            description="Customize how the platform looks and feels"
            icon={<Palette className="w-6 h-6 text-sas-purple-600" />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => handleSettingChange('', 'theme', theme.value)}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                        settings.theme === theme.value
                          ? 'border-sas-blue-500 bg-sas-blue-50'
                          : 'border-sas-gray-200 hover:border-sas-gray-300'
                      }`}
                    >
                      {theme.icon}
                      <span className="text-sm font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sas-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sas-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sas-gray-700 mb-2">Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('', 'dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sas-gray-700 mb-2">Time Format</label>
                  <select
                    value={settings.timeFormat}
                    onChange={(e) => handleSettingChange('', 'timeFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                  >
                    <option value="12h">12-hour (2:30 PM)</option>
                    <option value="24h">24-hour (14:30)</option>
                  </select>
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Notifications */}
          <SettingSection
            title="Notifications"
            description="Choose how you want to be notified about important updates"
            icon={<Bell className="w-6 h-6 text-sas-blue-600" />}
          >
            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-sas-gray-500" />
                  <h4 className="font-semibold text-sas-gray-900">Email Notifications</h4>
                </div>
                <div className="space-y-2 ml-7">
                  <ToggleSwitch
                    enabled={settings.notifications.email.observations}
                    onChange={(value) => handleNestedSettingChange('notifications', 'email', 'observations', value)}
                    label="Observation Updates"
                    description="Get notified about new observations and feedback"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.email.evaluations}
                    onChange={(value) => handleNestedSettingChange('notifications', 'email', 'evaluations', value)}
                    label="Evaluation Reminders"
                    description="Reminders about upcoming evaluations"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.email.reminders}
                    onChange={(value) => handleNestedSettingChange('notifications', 'email', 'reminders', value)}
                    label="Task Reminders"
                    description="Reminders about pending tasks and deadlines"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.email.weeklyDigest}
                    onChange={(value) => handleNestedSettingChange('notifications', 'email', 'weeklyDigest', value)}
                    label="Weekly Digest"
                    description="A summary of your week's activities"
                  />
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Smartphone className="w-5 h-5 text-sas-gray-500" />
                  <h4 className="font-semibold text-sas-gray-900">Push Notifications</h4>
                </div>
                <div className="space-y-2 ml-7">
                  <ToggleSwitch
                    enabled={settings.notifications.push.observations}
                    onChange={(value) => handleNestedSettingChange('notifications', 'push', 'observations', value)}
                    label="Observation Updates"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.push.evaluations}
                    onChange={(value) => handleNestedSettingChange('notifications', 'push', 'evaluations', value)}
                    label="Evaluation Reminders"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.push.reminders}
                    onChange={(value) => handleNestedSettingChange('notifications', 'push', 'reminders', value)}
                    label="Task Reminders"
                  />
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Privacy */}
          <SettingSection
            title="Privacy & Visibility"
            description="Control who can see your information and contact you"
            icon={<Shield className="w-6 h-6 text-sas-green-600" />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-2">Profile Visibility</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                >
                  <option value="public">Public - Everyone can see</option>
                  <option value="school">School - Only school members</option>
                  <option value="division">Division - Only division members</option>
                  <option value="private">Private - Only you</option>
                </select>
              </div>

              <ToggleSwitch
                enabled={settings.privacy.showEmail}
                onChange={(value) => handleSettingChange('privacy', 'showEmail', value)}
                label="Show Email Address"
                description="Allow others to see your email in your profile"
              />

              <ToggleSwitch
                enabled={settings.privacy.showPhone}
                onChange={(value) => handleSettingChange('privacy', 'showPhone', value)}
                label="Show Phone Number"
                description="Allow others to see your phone number in your profile"
              />

              <ToggleSwitch
                enabled={settings.privacy.allowDirectMessages}
                onChange={(value) => handleSettingChange('privacy', 'allowDirectMessages', value)}
                label="Allow Direct Messages"
                description="Allow other users to send you direct messages"
              />
            </div>
          </SettingSection>

          {/* Dashboard */}
          <SettingSection
            title="Dashboard Preferences"
            description="Customize your dashboard layout and behavior"
            icon={<Eye className="w-6 h-6 text-sas-orange-600" />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-2">Default View</label>
                <select
                  value={settings.dashboard.defaultView}
                  onChange={(e) => handleSettingChange('dashboard', 'defaultView', e.target.value)}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                >
                  <option value="overview">Overview</option>
                  <option value="observations">Observations</option>
                  <option value="schedule">My Schedule</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-sas-gray-700 mb-2">Observations Per Page</label>
                <select
                  value={settings.dashboard.observationsPerPage}
                  onChange={(e) => handleSettingChange('dashboard', 'observationsPerPage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <ToggleSwitch
                enabled={settings.dashboard.showUpcomingObservations}
                onChange={(value) => handleSettingChange('dashboard', 'showUpcomingObservations', value)}
                label="Show Upcoming Observations"
                description="Display upcoming observations on your dashboard"
              />

              <ToggleSwitch
                enabled={settings.dashboard.showRecentActivity}
                onChange={(value) => handleSettingChange('dashboard', 'showRecentActivity', value)}
                label="Show Recent Activity"
                description="Display recent activities and updates"
              />

              <ToggleSwitch
                enabled={settings.dashboard.autoRefresh}
                onChange={(value) => handleSettingChange('dashboard', 'autoRefresh', value)}
                label="Auto-refresh Dashboard"
                description="Automatically refresh dashboard data every 30 seconds"
              />
            </div>
          </SettingSection>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-sas-blue-600 text-white rounded-lg shadow-lg hover:bg-sas-blue-700 disabled:opacity-50 transition-all duration-200 hover:shadow-xl"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span className="font-medium">Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;