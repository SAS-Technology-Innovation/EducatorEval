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
  RefreshCw
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'auth' | 'notifications' | 'integrations'>('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Configure application settings and integrations</p>
            </div>
            <button className="bg-sas-navy-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-sas-navy-600 transition-colors">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-sas-navy-50 text-sas-navy-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent"
                        placeholder="Singapore American School"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent">
                        <option>Asia/Singapore (GMT+8)</option>
                        <option>America/New_York (GMT-5)</option>
                        <option>Europe/London (GMT+0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sas-navy-500 focus:border-transparent">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>Mandarin</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'auth' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Mock Authentication</p>
                        <p className="text-sm text-gray-500">Development mode - bypass Firebase authentication</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Firebase Authentication</p>
                        <p className="text-sm text-gray-500">Production mode - full Firebase Auth integration</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> To switch authentication modes, edit <code className="bg-yellow-100 px-1 rounded">src/stores/auth.ts</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Send email notifications for observations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sas-navy-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">In-App Notifications</p>
                        <p className="text-sm text-gray-500">Show notifications within the application</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sas-navy-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Database className="w-8 h-8 text-orange-500" />
                          <div>
                            <p className="font-medium text-gray-900">Firebase</p>
                            <p className="text-sm text-gray-500">Cloud Firestore, Authentication, Storage</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Connected
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Project ID: educatoreval-sas</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-8 h-8 text-sas-navy-500" />
                          <div>
                            <p className="font-medium text-gray-900">School Calendar System</p>
                            <p className="text-sm text-gray-500">Sync schedules and events</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-sas-navy-600 border border-sas-navy-600 rounded-lg hover:bg-sas-navy-50">
                          Configure
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">Status: Not configured</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
