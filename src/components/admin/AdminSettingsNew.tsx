import React, { useState } from 'react';
import {
  Settings,
  Database,
  Shield,
  Bell,
  Mail,
  Globe,
  Code,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Users as UsersIcon,
  Calendar,
  Download,
  Upload
} from 'lucide-react';

export default function AdminSettingsNew() {
  const [activeTab, setActiveTab] = useState<'general' | 'crp' | 'auth' | 'notifications' | 'data'>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'crp', label: 'CRP Settings', icon: FileText },
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure application behavior and integrations</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="flex space-x-8">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content - More spacious */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="Singapore American School"
                      />
                      <p className="text-xs text-gray-500 mt-1">This appears in emails and reports</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Year
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>2024-2025</option>
                        <option>2025-2026</option>
                        <option>2026-2027</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Asia/Singapore (GMT+8)</option>
                        <option>America/New_York (GMT-5)</option>
                        <option>Europe/London (GMT+0)</option>
                        <option>America/Los_Angeles (GMT-8)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Language
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>Mandarin</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'crp' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">CRP Observation Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observation Goal (by May 2026)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="5000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Target number of observations to complete</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CRP Evidence Target Rate
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          defaultValue="70"
                          min="0"
                          max="100"
                        />
                        <span className="text-gray-700">%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Target percentage of observations with CRP evidence</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Observation Duration
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>15 minutes</option>
                        <option selected>30 minutes</option>
                        <option>45 minutes</option>
                        <option>60 minutes</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">CRP Framework</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Total Look-Fors</span>
                          <span className="text-sm font-semibold text-gray-900">10 integrated look-fors</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">Rating Scale</span>
                          <span className="text-sm font-semibold text-gray-900">4-Point + Not Observed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'auth' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Authentication Settings</h2>
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">Mock Authentication</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Development mode - bypass Firebase authentication for testing
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Auto-login as: dev@sas.edu.sg (Super Admin)
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Shield className="w-6 h-6 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">Firebase Authentication</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Production mode - full Firebase Auth integration with user management
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Project: educatoreval-sas
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">Configuration Required</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          To switch authentication modes, edit <code className="bg-yellow-100 px-2 py-0.5 rounded font-mono text-xs">src/stores/auth.ts</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Email Notifications',
                        description: 'Send email notifications for new observations, goals, and system updates',
                        enabled: false
                      },
                      {
                        title: 'In-App Notifications',
                        description: 'Show notifications within the application',
                        enabled: true
                      },
                      {
                        title: 'Observation Reminders',
                        description: 'Send reminders for scheduled observations 24 hours in advance',
                        enabled: true
                      },
                      {
                        title: 'Goal Progress Updates',
                        description: 'Notify users when they reach milestones in their professional goals',
                        enabled: true
                      },
                      {
                        title: 'Weekly Digest',
                        description: 'Send weekly summary of observations and system activity',
                        enabled: false
                      }
                    ].map((setting, idx) => (
                      <div key={idx} className="flex items-start justify-between p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex-1 pr-4">
                          <p className="font-medium text-gray-900">{setting.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Database className="w-6 h-6 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Firebase Integration</h3>
                          <p className="text-sm text-gray-600 mt-1">Connected to Cloud Firestore</p>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Project ID</p>
                              <p className="text-sm font-medium text-gray-900">educatoreval-sas</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Last Backup</p>
                              <p className="text-sm font-medium text-gray-900">2 hours ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Data Operations</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                          <Download className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-700">Export Data</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                          <Upload className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-700">Import Data</span>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Schedule System Integration</h3>
                      <div className="p-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">School Calendar System</p>
                              <p className="text-sm text-gray-500">Sync teacher schedules and class data</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            Configure
                          </button>
                        </div>
                        <p className="text-xs text-gray-600">Status: Not configured • Required for auto-populating observation forms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
