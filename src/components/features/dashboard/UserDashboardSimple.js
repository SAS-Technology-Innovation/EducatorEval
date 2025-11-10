import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Users, ClipboardCheck, TrendingUp, Calendar, BookOpen, BarChart3, Plus, Filter, ArrowRight, Eye, Target, GraduationCap } from 'lucide-react';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { usersService, firestoreQueries } from '../../../lib/firestore';
const UserDashboardSimple = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalObservations: 0,
        recentObservations: 0,
        crpEvidenceCount: 0,
        upcomingScheduled: 0
    });
    const [observations, setObservations] = useState([]);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get user profile data from Firestore
                    let userProfile = await usersService.getById(firebaseUser.uid);
                    if (!userProfile) {
                        // Create basic user profile from Firebase auth data
                        userProfile = {
                            id: firebaseUser.uid,
                            firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                            lastName: firebaseUser.displayName?.split(' ')[1] || '',
                            email: firebaseUser.email,
                            primaryRole: 'teacher',
                            schoolName: 'School'
                        };
                    }
                    setUser(userProfile);
                    // Get user's observations from Firestore
                    const userObservations = await firestoreQueries.getUserObservations(firebaseUser.uid, 50);
                    setObservations(userObservations);
                    // Calculate real statistics
                    const now = new Date();
                    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    const recentObs = userObservations.filter(obs => obs.createdAt && new Date(obs.createdAt) >= oneWeekAgo);
                    const completedObs = userObservations.filter(obs => obs.status === 'completed');
                    const evidenceObs = completedObs.filter(obs => obs.crpPercentage && obs.crpPercentage > 0);
                    const scheduledObs = userObservations.filter(obs => obs.status === 'scheduled');
                    setStats({
                        totalObservations: userObservations.length,
                        recentObservations: recentObs.length,
                        crpEvidenceCount: evidenceObs.length,
                        upcomingScheduled: scheduledObs.length
                    });
                }
                catch (error) {
                    console.error('Failed to load user data:', error);
                    // Fallback to basic Firebase user data
                    setUser({
                        id: firebaseUser.uid,
                        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                        lastName: firebaseUser.displayName?.split(' ')[1] || '',
                        email: firebaseUser.email,
                        primaryRole: 'teacher',
                        schoolName: 'School'
                    });
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const crpEvidenceRate = stats.totalObservations > 0
        ? Math.round((stats.crpEvidenceCount / stats.totalObservations) * 100)
        : 0;
    // Available applets for the user - calculated dynamically
    const availableApplets = [
        {
            id: 'crp-observations',
            name: 'CRP Observations',
            description: 'Culturally Responsive Pedagogy classroom observation tool',
            icon: _jsx(Eye, { className: "w-6 h-6" }),
            route: '/observations',
            status: 'available',
            usage: stats.totalObservations > 0 ? Math.min(100, Math.round((stats.totalObservations / 10) * 100)) : 0
        },
        {
            id: 'professional-learning',
            name: 'Professional Learning',
            description: 'Track your professional development journey',
            icon: _jsx(GraduationCap, { className: "w-6 h-6" }),
            route: '/learning',
            status: 'coming-soon',
            usage: 0
        },
        {
            id: 'goal-tracking',
            name: 'Goal Tracking',
            description: 'Set and monitor your professional growth goals',
            icon: _jsx(Target, { className: "w-6 h-6" }),
            route: '/goals',
            status: 'coming-soon',
            usage: 0
        }
    ];
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsx("div", { className: "animate-spin w-8 h-8 border-4 border-sas-blue-600 border-t-transparent rounded-full" }) }));
    }
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsxs("div", { className: "text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-sas-blue-500 to-sas-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6", children: _jsx(BookOpen, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-sas-gray-900 mb-4 font-serif", children: "Welcome to EducatorEval" }), _jsx("p", { className: "text-sas-gray-600 mb-8", children: "Please sign in to access your dashboard and manage your educational evaluations." }), _jsxs("a", { href: "/login", className: "bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto", children: ["Sign In", _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-sas-background", children: [_jsx("div", { className: "bg-gradient-to-r from-sas-blue-600 to-sas-purple-700 text-white", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h1", { className: "text-3xl lg:text-4xl font-bold mb-2 font-serif", children: ["Welcome back, ", user.firstName, "!"] }), _jsx("p", { className: "text-xl text-sas-blue-100 mb-6", children: "Your educational excellence dashboard" })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("button", { className: "bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "New Observation"] }), _jsxs("button", { className: "bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center", children: [_jsx(Filter, { className: "w-4 h-4 mr-2" }), "View Schedule"] })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-blue-500 to-sas-blue-600 rounded-xl flex items-center justify-center", children: _jsx(ClipboardCheck, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Total Observations" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: stats.totalObservations.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-green-500 to-sas-green-600 rounded-xl flex items-center justify-center", children: _jsx(Calendar, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "This Week" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: stats.recentObservations.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-gold-500 to-sas-gold-600 rounded-xl flex items-center justify-center", children: _jsx(TrendingUp, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "CRP Evidence Rate" }), _jsxs("p", { className: "text-2xl font-bold text-sas-gray-900", children: [crpEvidenceRate, "%"] })] })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-purple-500 to-sas-purple-600 rounded-xl flex items-center justify-center", children: _jsx(Users, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Upcoming" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: stats.upcomingScheduled })] })] }) })] }), _jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-sas-gray-900 font-serif", children: "Available Tools" }), _jsx("p", { className: "text-sas-gray-600 mt-1", children: "Explore the educational applets available to you" })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: availableApplets.map((applet) => (_jsx("div", { className: "bg-white rounded-2xl shadow-lg border border-sas-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-sas-blue-500 to-sas-purple-600 rounded-xl flex items-center justify-center text-white", children: applet.icon }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-sas-gray-900", children: applet.name }), _jsx("span", { className: `inline-block px-2 py-1 rounded-full text-xs font-medium ${applet.status === 'available'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : applet.status === 'coming-soon'
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : 'bg-gray-100 text-gray-800'}`, children: applet.status === 'available' ? 'Available' : 'Coming Soon' })] })] }) }), _jsx("p", { className: "text-sas-gray-600 text-sm mb-4 line-clamp-2", children: applet.description }), applet.status === 'available' && (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-sas-gray-600 mb-1", children: [_jsx("span", { children: "Usage Rate" }), _jsxs("span", { children: [applet.usage, "%"] })] }), _jsx("div", { className: "w-full bg-sas-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-sas-blue-500 to-sas-green-500 h-2 rounded-full transition-all duration-300", style: { width: `${applet.usage}%` } }) })] })), _jsx("div", { className: "flex space-x-2", children: applet.status === 'available' ? (_jsx("a", { href: applet.route, className: "flex-1 bg-gradient-to-r from-sas-blue-600 to-sas-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-sas-blue-700 hover:to-sas-purple-700 transition-all duration-200 text-center", children: "Launch" })) : (_jsx("button", { disabled: true, className: "flex-1 bg-sas-gray-200 text-sas-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed text-center", children: "Coming Soon" })) })] }) }, applet.id))) })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100", children: [_jsx("h2", { className: "text-xl font-bold text-sas-gray-900 mb-4 font-serif", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("a", { href: "/observations", className: "flex items-center p-4 bg-sas-blue-50 rounded-xl hover:bg-sas-blue-100 transition-colors", children: [_jsx(Eye, { className: "w-8 h-8 text-sas-blue-600 mr-3" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-sas-blue-900", children: "New Observation" }), _jsx("div", { className: "text-sm text-sas-blue-700", children: "Start a classroom observation" })] })] }), _jsxs("a", { href: "/schedule", className: "flex items-center p-4 bg-sas-green-50 rounded-xl hover:bg-sas-green-100 transition-colors", children: [_jsx(Calendar, { className: "w-8 h-8 text-sas-green-600 mr-3" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-sas-green-900", children: "View Schedule" }), _jsx("div", { className: "text-sm text-sas-green-700", children: "Check your observation schedule" })] })] }), _jsxs("a", { href: "/reports", className: "flex items-center p-4 bg-sas-purple-50 rounded-xl hover:bg-sas-purple-100 transition-colors", children: [_jsx(BarChart3, { className: "w-8 h-8 text-sas-purple-600 mr-3" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-sas-purple-900", children: "View Reports" }), _jsx("div", { className: "text-sm text-sas-purple-700", children: "Analyze your progress" })] })] })] })] })] })] }));
};
export default UserDashboardSimple;
