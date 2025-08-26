import React, { useState, useEffect } from 'react';
import { User, Settings, Shield, Bell, Key, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Layout from './Layout';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface ProfileData {
  name: string;
  email: string;
  department: string;
  currentRole: UserRole;
  availableRoles: UserRole[];
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    observationReminders: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    sessionTimeout: number;
  };
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'preferences' | 'security'>('profile');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    currentRole: user?.role || 'teacher',
    availableRoles: ['teacher', 'observer'], // This would come from user permissions
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: false,
      observationReminders: true
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: '2025-08-01',
      sessionTimeout: 30
    }
  });
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Update profile data
      await updateProfile({
        name: profileData.name,
        department: profileData.department,
        preferences: profileData.preferences
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleSwitch = async (newRole: UserRole) => {
    try {
      await switchRole(newRole);
      setProfileData(prev => ({ ...prev, currentRole: newRole }));
    } catch (err) {
      setError('Failed to switch role. Please try again.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Key }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {saved && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">Profile updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-lg shadow-sm border">
                <div className="p-4">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Settings</h2>
                </div>
                <div className="space-y-1">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={profileData.email}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact admin if needed.</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <select
                              value={profileData.department}
                              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Department</option>
                              <option value="Elementary Education">Elementary Education</option>
                              <option value="Middle School">Middle School</option>
                              <option value="High School">High School</option>
                              <option value="Special Education">Special Education</option>
                              <option value="Administration">Administration</option>
                              <option value="Curriculum & Instruction">Curriculum & Instruction</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                              <span className="capitalize font-medium text-gray-900">{profileData.currentRole}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Roles Tab */}
                  {activeTab === 'roles' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Management</h3>
                        <p className="text-gray-600 mb-6">Switch between your available roles. Your current role determines what features and data you can access.</p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Available Roles</label>
                            <div className="space-y-3">
                              {profileData.availableRoles.map(role => (
                                <div
                                  key={role}
                                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                    profileData.currentRole === role
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => handleRoleSwitch(role)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <Shield className="w-5 h-5 text-gray-400" />
                                      <div>
                                        <h4 className="font-medium text-gray-900 capitalize">{role}</h4>
                                        <p className="text-sm text-gray-500">
                                          {role === 'admin' && 'Full system access and user management'}
                                          {role === 'coordinator' && 'Manage observations and generate reports'}
                                          {role === 'observer' && 'Conduct classroom observations'}
                                          {role === 'teacher' && 'View your observation results and feedback'}
                                        </p>
                                      </div>
                                    </div>
                                    {profileData.currentRole === role && (
                                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        Active
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                        
                        <div className="space-y-4">
                          {[
                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about observations and activities' },
                            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get browser notifications for real-time updates' },
                            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports via email' },
                            { key: 'observationReminders', label: 'Observation Reminders', desc: 'Get reminders about upcoming scheduled observations' }
                          ].map(pref => (
                            <div key={pref.key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3 flex-1">
                                <Bell className="w-5 h-5 text-gray-400" />
                                <div>
                                  <h4 className="font-medium text-gray-900">{pref.label}</h4>
                                  <p className="text-sm text-gray-500">{pref.desc}</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={profileData.preferences[pref.key as keyof typeof profileData.preferences]}
                                  onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    preferences: { ...prev.preferences, [pref.key]: e.target.checked }
                                  }))}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                        
                        <div className="space-y-6">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Password</h4>
                            <p className="text-sm text-gray-500 mb-4">Last changed: {profileData.security.lastPasswordChange}</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                              Change Password
                            </button>
                          </div>
                          
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={profileData.security.twoFactorEnabled}
                                  onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    security: { ...prev.security, twoFactorEnabled: e.target.checked }
                                  }))}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>
                          
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Session Timeout</h4>
                            <p className="text-sm text-gray-500 mb-4">Automatically log out after period of inactivity</p>
                            <select
                              value={profileData.security.sessionTimeout}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                              }))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={60}>1 hour</option>
                              <option value={120}>2 hours</option>
                              <option value={-1}>Never</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
