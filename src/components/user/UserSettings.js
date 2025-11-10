import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Bell, Shield, Eye, Palette, Save, Monitor, Sun, Moon, Smartphone, Mail } from 'lucide-react';
const UserSettings = ({ user, onUpdate }) => {
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
    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
        setHasChanges(true);
    };
    const handleNestedSettingChange = (category, subcategory, key, value) => {
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
        }
        catch (error) {
            console.error('Failed to save settings:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const SettingSection = ({ title, description, icon, children }) => (_jsxs("div", { className: "bg-white rounded-lg border border-sas-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [icon, _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-sas-gray-900", children: title }), _jsx("p", { className: "text-sm text-sas-gray-600", children: description })] })] }), children] }));
    const ToggleSwitch = ({ enabled, onChange, label, description }) => (_jsxs("div", { className: "flex items-center justify-between py-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sas-gray-900", children: label }), description && _jsx("div", { className: "text-sm text-sas-gray-500", children: description })] }), _jsx("button", { onClick: () => onChange(!enabled), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sas-blue-500 focus:ring-offset-2 ${enabled ? 'bg-sas-blue-600' : 'bg-sas-gray-200'}`, children: _jsx("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}` }) })] }));
    return (_jsx("div", { className: "min-h-screen bg-sas-background", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-sas-gray-900", children: "Settings" }), _jsx("p", { className: "text-sas-gray-600 mt-2", children: "Manage your account preferences and privacy settings" })] }), _jsxs("div", { className: "space-y-6", children: [_jsx(SettingSection, { title: "Appearance", description: "Customize how the platform looks and feels", icon: _jsx(Palette, { className: "w-6 h-6 text-sas-purple-600" }), children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Theme" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                                                    { value: 'light', label: 'Light', icon: _jsx(Sun, { className: "w-4 h-4" }) },
                                                    { value: 'dark', label: 'Dark', icon: _jsx(Moon, { className: "w-4 h-4" }) },
                                                    { value: 'system', label: 'System', icon: _jsx(Monitor, { className: "w-4 h-4" }) }
                                                ].map((theme) => (_jsxs("button", { onClick: () => handleSettingChange('', 'theme', theme.value), className: `flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${settings.theme === theme.value
                                                        ? 'border-sas-blue-500 bg-sas-blue-50'
                                                        : 'border-sas-gray-200 hover:border-sas-gray-300'}`, children: [theme.icon, _jsx("span", { className: "text-sm font-medium", children: theme.label })] }, theme.value))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Language" }), _jsxs("select", { value: settings.language, onChange: (e) => handleSettingChange('', 'language', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Espa\u00F1ol" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" }), _jsx("option", { value: "zh", children: "\u4E2D\u6587" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Timezone" }), _jsxs("select", { value: settings.timezone, onChange: (e) => handleSettingChange('', 'timezone', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "America/New_York", children: "Eastern Time" }), _jsx("option", { value: "America/Chicago", children: "Central Time" }), _jsx("option", { value: "America/Denver", children: "Mountain Time" }), _jsx("option", { value: "America/Los_Angeles", children: "Pacific Time" }), _jsx("option", { value: "Europe/London", children: "London" }), _jsx("option", { value: "Europe/Paris", children: "Paris" }), _jsx("option", { value: "Asia/Tokyo", children: "Tokyo" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Date Format" }), _jsxs("select", { value: settings.dateFormat, onChange: (e) => handleSettingChange('', 'dateFormat', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }), _jsx("option", { value: "DD/MM/YYYY", children: "DD/MM/YYYY" }), _jsx("option", { value: "YYYY-MM-DD", children: "YYYY-MM-DD" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Time Format" }), _jsxs("select", { value: settings.timeFormat, onChange: (e) => handleSettingChange('', 'timeFormat', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "12h", children: "12-hour (2:30 PM)" }), _jsx("option", { value: "24h", children: "24-hour (14:30)" })] })] })] })] }) }), _jsx(SettingSection, { title: "Notifications", description: "Choose how you want to be notified about important updates", icon: _jsx(Bell, { className: "w-6 h-6 text-sas-blue-600" }), children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(Mail, { className: "w-5 h-5 text-sas-gray-500" }), _jsx("h4", { className: "font-semibold text-sas-gray-900", children: "Email Notifications" })] }), _jsxs("div", { className: "space-y-2 ml-7", children: [_jsx(ToggleSwitch, { enabled: settings.notifications.email.observations, onChange: (value) => handleNestedSettingChange('notifications', 'email', 'observations', value), label: "Observation Updates", description: "Get notified about new observations and feedback" }), _jsx(ToggleSwitch, { enabled: settings.notifications.email.evaluations, onChange: (value) => handleNestedSettingChange('notifications', 'email', 'evaluations', value), label: "Evaluation Reminders", description: "Reminders about upcoming evaluations" }), _jsx(ToggleSwitch, { enabled: settings.notifications.email.reminders, onChange: (value) => handleNestedSettingChange('notifications', 'email', 'reminders', value), label: "Task Reminders", description: "Reminders about pending tasks and deadlines" }), _jsx(ToggleSwitch, { enabled: settings.notifications.email.weeklyDigest, onChange: (value) => handleNestedSettingChange('notifications', 'email', 'weeklyDigest', value), label: "Weekly Digest", description: "A summary of your week's activities" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(Smartphone, { className: "w-5 h-5 text-sas-gray-500" }), _jsx("h4", { className: "font-semibold text-sas-gray-900", children: "Push Notifications" })] }), _jsxs("div", { className: "space-y-2 ml-7", children: [_jsx(ToggleSwitch, { enabled: settings.notifications.push.observations, onChange: (value) => handleNestedSettingChange('notifications', 'push', 'observations', value), label: "Observation Updates" }), _jsx(ToggleSwitch, { enabled: settings.notifications.push.evaluations, onChange: (value) => handleNestedSettingChange('notifications', 'push', 'evaluations', value), label: "Evaluation Reminders" }), _jsx(ToggleSwitch, { enabled: settings.notifications.push.reminders, onChange: (value) => handleNestedSettingChange('notifications', 'push', 'reminders', value), label: "Task Reminders" })] })] })] }) }), _jsx(SettingSection, { title: "Privacy & Visibility", description: "Control who can see your information and contact you", icon: _jsx(Shield, { className: "w-6 h-6 text-sas-green-600" }), children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Profile Visibility" }), _jsxs("select", { value: settings.privacy.profileVisibility, onChange: (e) => handleSettingChange('privacy', 'profileVisibility', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "public", children: "Public - Everyone can see" }), _jsx("option", { value: "school", children: "School - Only school members" }), _jsx("option", { value: "division", children: "Division - Only division members" }), _jsx("option", { value: "private", children: "Private - Only you" })] })] }), _jsx(ToggleSwitch, { enabled: settings.privacy.showEmail, onChange: (value) => handleSettingChange('privacy', 'showEmail', value), label: "Show Email Address", description: "Allow others to see your email in your profile" }), _jsx(ToggleSwitch, { enabled: settings.privacy.showPhone, onChange: (value) => handleSettingChange('privacy', 'showPhone', value), label: "Show Phone Number", description: "Allow others to see your phone number in your profile" }), _jsx(ToggleSwitch, { enabled: settings.privacy.allowDirectMessages, onChange: (value) => handleSettingChange('privacy', 'allowDirectMessages', value), label: "Allow Direct Messages", description: "Allow other users to send you direct messages" })] }) }), _jsx(SettingSection, { title: "Dashboard Preferences", description: "Customize your dashboard layout and behavior", icon: _jsx(Eye, { className: "w-6 h-6 text-sas-orange-600" }), children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Default View" }), _jsxs("select", { value: settings.dashboard.defaultView, onChange: (e) => handleSettingChange('dashboard', 'defaultView', e.target.value), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: "overview", children: "Overview" }), _jsx("option", { value: "observations", children: "Observations" }), _jsx("option", { value: "schedule", children: "My Schedule" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Observations Per Page" }), _jsxs("select", { value: settings.dashboard.observationsPerPage, onChange: (e) => handleSettingChange('dashboard', 'observationsPerPage', parseInt(e.target.value)), className: "w-full px-3 py-2 border border-sas-gray-300 rounded-md focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent", children: [_jsx("option", { value: 10, children: "10" }), _jsx("option", { value: 25, children: "25" }), _jsx("option", { value: 50, children: "50" }), _jsx("option", { value: 100, children: "100" })] })] }), _jsx(ToggleSwitch, { enabled: settings.dashboard.showUpcomingObservations, onChange: (value) => handleSettingChange('dashboard', 'showUpcomingObservations', value), label: "Show Upcoming Observations", description: "Display upcoming observations on your dashboard" }), _jsx(ToggleSwitch, { enabled: settings.dashboard.showRecentActivity, onChange: (value) => handleSettingChange('dashboard', 'showRecentActivity', value), label: "Show Recent Activity", description: "Display recent activities and updates" }), _jsx(ToggleSwitch, { enabled: settings.dashboard.autoRefresh, onChange: (value) => handleSettingChange('dashboard', 'autoRefresh', value), label: "Auto-refresh Dashboard", description: "Automatically refresh dashboard data every 30 seconds" })] }) })] }), hasChanges && (_jsx("div", { className: "fixed bottom-6 right-6 z-50", children: _jsxs("button", { onClick: handleSave, disabled: loading, className: "flex items-center space-x-2 px-6 py-3 bg-sas-blue-600 text-white rounded-lg shadow-lg hover:bg-sas-blue-700 disabled:opacity-50 transition-all duration-200 hover:shadow-xl", children: [loading ? (_jsx("div", { className: "animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" })) : (_jsx(Save, { className: "w-5 h-5" })), _jsx("span", { className: "font-medium", children: "Save Changes" })] }) }))] }) }));
};
export default UserSettings;
