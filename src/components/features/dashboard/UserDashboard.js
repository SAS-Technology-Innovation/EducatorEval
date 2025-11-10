import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Users, ClipboardCheck, TrendingUp, Calendar, BookOpen, BarChart3, Plus, Filter, ArrowRight, Eye, Target, GraduationCap } from 'lucide-react';
import { observationsApi, coreApi } from '../../../lib/api';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [observations, setObservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [observationsLoading, setObservationsLoading] = useState(false);
    const [frameworks, setFrameworks] = useState([]);
    const [frameworksLoading, setFrameworksLoading] = useState(false);
    const [totalObservations, setTotalObservations] = useState(0);
    const [stats, setStats] = useState({
        totalObservations: 0,
        recentObservations: 0,
        crpEvidenceCount: 0,
        upcomingScheduled: 0
    });
    // Helper function to check user permissions
    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || user?.permissions?.includes('*') || false;
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const profile = await coreApi.users.getById(firebaseUser.uid);
                    setUser(profile);
                    // Load user's observations
                    const userObservations = await observationsApi.observations.list({
                        teacherId: firebaseUser.uid,
                        limit: 50
                    });
                    setObservations(userObservations);
                    // Calculate stats
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    const recentObs = userObservations.filter(obs => new Date(obs.context.date) >= oneWeekAgo);
                    const crpEvidence = userObservations.filter(obs => obs.crpPercentage && obs.crpPercentage > 0);
                    const upcoming = userObservations.filter(obs => obs.status === 'draft' && new Date(obs.context.date) > new Date());
                    setStats({
                        totalObservations: userObservations.length,
                        recentObservations: recentObs.length,
                        crpEvidenceCount: crpEvidence.length,
                        upcomingScheduled: upcoming.length
                    });
                    setTotalObservations(userObservations.length);
                }
                catch (error) {
                    console.error('Failed to load dashboard data:', error);
                    setUser(firebaseUser);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsx("div", { className: "animate-spin w-8 h-8 border-4 border-sas-blue-600 border-t-transparent rounded-full" }) }));
    }
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-sas-background", children: _jsxs("div", { className: "text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-sas-blue-500 to-sas-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6", children: _jsx(BookOpen, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold text-sas-gray-900 mb-4 font-serif", children: "Welcome to EducatorEval" }), _jsx("p", { className: "text-sas-gray-600 mb-8", children: "Please sign in to access your dashboard and manage your educational evaluations." }), _jsxs("a", { href: "/login", className: "bg-sas-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-sas-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center mx-auto", children: ["Sign In", _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }) }));
    }
    // Available applets for the user
    const availableApplets = [
        {
            id: 'crp-observations',
            name: 'CRP Observations',
            description: 'Culturally Responsive Pedagogy classroom observation tool',
            icon: _jsx(Eye, { className: "w-6 h-6" }),
            route: '/observations',
            status: 'available',
            usage: 89
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
    const crpEvidenceRate = stats.totalObservations > 0
        ? Math.round((stats.crpEvidenceCount / stats.totalObservations) * 100)
        : 0;
    return (_jsxs("div", { className: "min-h-screen bg-sas-background", children: [_jsx("div", { className: "bg-white shadow-sm border-b border-sas-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-sas-gray-900 font-serif", children: "Dashboard" }), _jsxs("p", { className: "text-sas-gray-600 mt-1", children: ["Welcome back, ", user.displayName || user.email] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [hasPermission('create_observation') && (_jsxs("button", { className: "bg-gradient-to-r from-sas-blue-600 to-sas-green-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-sas-blue-700 hover:to-sas-green-700 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "New Observation"] })), _jsxs("button", { className: "border border-sas-gray-300 text-sas-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-sas-gray-50 shadow-sm hover:shadow-md transition-all duration-200 flex items-center", children: [_jsx(Filter, { className: "w-4 h-4 mr-2" }), "Filter"] })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-blue-500 to-sas-blue-600 rounded-xl flex items-center justify-center", children: _jsx(ClipboardCheck, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Total Observations" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: stats.totalObservations.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-green-500 to-sas-green-600 rounded-xl flex items-center justify-center", children: _jsx(Calendar, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "This Week" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: stats.recentObservations.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-gold-500 to-sas-gold-600 rounded-xl flex items-center justify-center", children: _jsx(TrendingUp, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "CRP Evidence Rate" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: observationsLoading ? '...' : `${crpEvidenceRate}%` })] })] }) }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 border border-sas-gray-100 hover:shadow-xl transition-all duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-purple-500 to-sas-purple-600 rounded-xl flex items-center justify-center", children: _jsx(BookOpen, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-600", children: "Active Frameworks" }), _jsx("p", { className: "text-2xl font-bold text-sas-gray-900", children: frameworksLoading ? '...' : frameworks?.filter(f => f.status === 'active').length || 0 })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-sas-gray-100", children: [_jsx("div", { className: "px-6 py-5 border-b border-sas-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold text-sas-gray-900 font-serif", children: "Recent Observations" }), _jsxs("a", { href: "/observations", className: "text-sas-blue-600 text-sm font-medium hover:text-sas-blue-700 flex items-center", children: ["View all", _jsx(ArrowRight, { className: "w-4 h-4 ml-1" })] })] }) }), _jsx("div", { className: "divide-y divide-sas-gray-100", children: observationsLoading ? (_jsxs("div", { className: "p-8 text-center text-sas-gray-500 flex flex-col items-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-sas-blue-200 border-t-sas-blue-600 mb-4" }), "Loading observations..."] })) : !observations || observations.length === 0 ? (_jsxs("div", { className: "p-8 text-center text-sas-gray-500 flex flex-col items-center", children: [_jsx("div", { className: "w-12 h-12 bg-sas-gray-100 rounded-2xl flex items-center justify-center mb-4", children: _jsx(ClipboardCheck, { className: "w-6 h-6 text-sas-gray-400" }) }), _jsx("p", { className: "text-lg font-medium text-sas-gray-900 mb-2", children: "No observations yet" }), _jsx("p", { className: "text-sas-gray-500", children: "Create your first observation to get started." })] })) : (observations.slice(0, 5).map((observation) => (_jsx("div", { className: "p-6 hover:bg-sas-gray-25 transition-colors duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-sas-blue-100 to-sas-green-100 rounded-xl flex items-center justify-center", children: _jsx(Users, { className: "w-5 h-5 text-sas-blue-600" }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-sas-gray-900", children: observation.teacherName || 'Unknown Teacher' }), _jsxs("p", { className: "text-sm text-sas-gray-600", children: [observation.subject, " \u2022 ", observation.grade] })] })] }) }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-sas-gray-900", children: observation.date
                                                                            ? new Date(observation.date).toLocaleDateString()
                                                                            : 'Not scheduled' }), _jsx("div", { className: "flex items-center mt-2", children: _jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${observation.status === 'completed'
                                                                                ? 'bg-sas-green-100 text-sas-green-800'
                                                                                : observation.status === 'submitted'
                                                                                    ? 'bg-sas-blue-100 text-sas-blue-800'
                                                                                    : observation.status === 'reviewed'
                                                                                        ? 'bg-sas-gold-100 text-sas-gold-800'
                                                                                        : 'bg-sas-gray-100 text-sas-gray-800'}`, children: observation.status === 'completed' ? 'Completed' :
                                                                                observation.status === 'submitted' ? 'Submitted' :
                                                                                    observation.status === 'reviewed' ? 'Reviewed' : 'Draft' }) })] }) })] }) }, observation.id)))) })] }) }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-sas-gray-100", children: [_jsx("div", { className: "px-6 py-5 border-b border-sas-gray-200", children: _jsx("h2", { className: "text-xl font-semibold text-sas-gray-900 font-serif", children: "Quick Actions" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [hasPermission('create_observation') && (_jsx("button", { className: "w-full bg-gradient-to-r from-sas-blue-50 to-sas-blue-100 text-sas-blue-700 p-5 rounded-xl hover:from-sas-blue-100 hover:to-sas-blue-200 text-left transition-all duration-200 border border-sas-blue-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-sas-blue-600 rounded-xl flex items-center justify-center mr-4", children: _jsx(Plus, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sas-gray-900", children: "New Observation" }), _jsx("p", { className: "text-sm text-sas-blue-600 mt-1", children: "Schedule or start an observation" })] })] }) })), _jsx("button", { className: "w-full bg-gradient-to-r from-sas-green-50 to-sas-green-100 text-sas-green-700 p-5 rounded-xl hover:from-sas-green-100 hover:to-sas-green-200 text-left transition-all duration-200 border border-sas-green-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-sas-green-600 rounded-xl flex items-center justify-center mr-4", children: _jsx(BarChart3, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sas-gray-900", children: "View Analytics" }), _jsx("p", { className: "text-sm text-sas-green-600 mt-1", children: "Check progress and trends" })] })] }) }), _jsx("button", { className: "w-full bg-gradient-to-r from-sas-gold-50 to-sas-gold-100 text-sas-gold-700 p-5 rounded-xl hover:from-sas-gold-100 hover:to-sas-gold-200 text-left transition-all duration-200 border border-sas-gold-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-8 h-8 bg-sas-gold-600 rounded-xl flex items-center justify-center mr-4", children: _jsx(BookOpen, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sas-gray-900", children: "Frameworks" }), _jsx("p", { className: "text-sm text-sas-gold-600 mt-1", children: "Manage observation frameworks" })] })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-sas-gray-100", children: [_jsx("div", { className: "px-6 py-5 border-b border-sas-gray-200", children: _jsx("h2", { className: "text-xl font-semibold text-sas-gray-900 font-serif", children: "CRP Progress" }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "text-4xl font-bold bg-gradient-to-r from-sas-blue-600 to-sas-green-600 bg-clip-text text-transparent", children: totalObservations.toLocaleString() }), _jsx("div", { className: "text-sm text-sas-gray-500 mt-1", children: "of 5,000 observations" })] }), _jsx("div", { className: "w-full bg-sas-gray-200 rounded-full h-4 mb-6", children: _jsx("div", { className: "bg-gradient-to-r from-sas-blue-500 to-sas-green-500 h-4 rounded-full transition-all duration-500", style: { width: `${Math.min((totalObservations / 5000) * 100, 100)}%` } }) }), _jsxs("div", { className: "grid grid-cols-2 gap-6 text-center", children: [_jsxs("div", { className: "p-4 bg-sas-gray-50 rounded-xl", children: [_jsxs("div", { className: "text-2xl font-bold text-sas-gray-900", children: [crpEvidenceRate, "%"] }), _jsx("div", { className: "text-sm text-sas-gray-600 mt-1", children: "CRP Evidence" })] }), _jsxs("div", { className: "p-4 bg-sas-gray-50 rounded-xl", children: [_jsx("div", { className: "text-2xl font-bold text-sas-gray-900", children: "70%" }), _jsx("div", { className: "text-sm text-sas-gray-600 mt-1", children: "Target Rate" })] })] })] })] })] })] })] })] }));
};
export default UserDashboard;
