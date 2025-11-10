import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-nocheck
import { useState, useEffect } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User, CheckCircle, Chrome } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
const LoginForm = ({ onSuccess }) => {
    const [mode, setMode] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const { signIn, signUp, signInWithGoogle, sendPasswordReset, error, clearError, initialize, isAuthenticated, isLoading } = useAuthStore();
    // Initialize auth listener on component mount
    useEffect(() => {
        console.log('🔧 LoginForm: Initializing auth store...');
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);
    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            console.log('✅ User already authenticated, redirecting to dashboard...');
            window.location.href = '/dashboard';
        }
    }, [isAuthenticated, isLoading]);
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (isSubmitting)
            return;
        console.log('🔐 Attempting sign in with:', email);
        setIsSubmitting(true);
        clearError();
        try {
            await signIn(email, password);
            console.log('✅ Sign in successful!');
            // Navigate to dashboard after successful login
            if (onSuccess) {
                onSuccess();
            }
            else {
                console.log('🔄 Redirecting to dashboard...');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000); // Small delay to ensure auth state is updated
            }
        }
        catch (error) {
            console.error('❌ Login error:', error);
            // Error is handled by the auth store
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (isSubmitting)
            return;
        if (password !== confirmPassword) {
            clearError();
            // Set error manually since it's not from auth store
            return;
        }
        setIsSubmitting(true);
        clearError();
        try {
            await signUp(email, password, displayName);
            // Navigate to dashboard after successful signup
            if (onSuccess) {
                onSuccess();
            }
            else {
                window.location.href = '/dashboard';
            }
        }
        catch (error) {
            console.error('Signup error:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (isSubmitting || !email)
            return;
        setIsSubmitting(true);
        clearError();
        try {
            await sendPasswordReset(email);
            setResetEmailSent(true);
        }
        catch (error) {
            console.error('Password reset error:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleGoogleSignIn = async () => {
        if (isSubmitting)
            return;
        setIsSubmitting(true);
        clearError();
        try {
            await signInWithGoogle();
            // Navigate to dashboard after successful login
            if (onSuccess) {
                onSuccess();
            }
            else {
                window.location.href = '/dashboard';
            }
        }
        catch (error) {
            console.error('Google sign in error:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setDisplayName('');
        setResetEmailSent(false);
        clearError();
    };
    const switchMode = (newMode) => {
        console.log('Switching mode to:', newMode); // Debug log
        setMode(newMode);
        resetForm();
    };
    return (_jsx("div", { className: "min-h-screen bg-sas-background flex items-center justify-center px-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("img", { src: "https://resources.finalsite.net/images/v1736450683/sas/q9u7ppfdasutt8sglmzh/school-logo.svg", alt: "Singapore American School", className: "h-16 w-auto mx-auto mb-6" }), _jsx("h1", { className: "text-4xl font-bebas text-sas-navy-600 tracking-wider mb-2", children: "EducatorEval" }), _jsx("p", { className: "text-sas-gray-600 font-poppins", children: "Singapore American School" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-8 border border-sas-gray-100", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("h2", { className: "text-2xl font-bebas text-sas-navy-600 tracking-wide mb-2", children: [mode === 'signin' && 'Welcome Back', mode === 'signup' && 'Create Account', mode === 'reset' && 'Reset Password'] }), _jsxs("p", { className: "text-sas-gray-600 font-poppins", children: [mode === 'signin' && 'Sign in to your account to continue', mode === 'signup' && 'Join the EducatorEval community', mode === 'reset' && 'We\'ll help you get back into your account'] })] }), error && (_jsxs("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-sm text-red-700", children: error })] })), _jsxs("div", { className: "flex border-b border-sas-gray-200 mb-6", children: [_jsx("button", { type: "button", onClick: () => switchMode('signin'), className: `flex-1 py-3 text-center font-medium transition-colors ${mode === 'signin'
                                        ? 'text-sas-navy-600 border-b-2 border-sas-navy-600'
                                        : 'text-sas-gray-500 hover:text-sas-gray-700'}`, children: "Sign In" }), _jsx("button", { type: "button", onClick: () => switchMode('signup'), className: `flex-1 py-3 text-center font-medium transition-colors ${mode === 'signup'
                                        ? 'text-sas-navy-600 border-b-2 border-sas-navy-600'
                                        : 'text-sas-gray-500 hover:text-sas-gray-700'}`, children: "Sign Up" }), _jsx("button", { type: "button", onClick: () => switchMode('reset'), className: `flex-1 py-3 text-center font-medium transition-colors ${mode === 'reset'
                                        ? 'text-sas-navy-600 border-b-2 border-sas-navy-600'
                                        : 'text-sas-gray-500 hover:text-sas-gray-700'}`, children: "Reset" })] }), mode === 'signin' && (_jsxs("form", { onSubmit: handleSignIn, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm", placeholder: "Enter your email", disabled: isSubmitting })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { id: "password", type: showPassword ? 'text' : 'password', required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-12 pr-12 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm", placeholder: "Enter your password", disabled: isSubmitting }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center text-sas-gray-400 hover:text-sas-gray-600", disabled: isSubmitting, children: showPassword ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] })] }), _jsx("button", { type: "submit", disabled: isSubmitting || !email || !password, className: "w-full bg-sas-gradient text-white py-3 px-4 rounded-lg font-poppins font-semibold hover:opacity-90 focus:ring-2 focus:ring-sas-navy-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), _jsx("span", { children: "Signing In..." })] })) : (_jsxs(_Fragment, { children: [_jsx(LogIn, { className: "w-4 h-4" }), _jsx("span", { children: "Sign In" })] })) })] })), mode === 'signup' && (_jsxs("form", { onSubmit: handleSignUp, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "displayName", className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { id: "displayName", type: "text", required: true, value: displayName, onChange: (e) => setDisplayName(e.target.value), className: "w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm", placeholder: "Enter your full name", disabled: isSubmitting })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "signup-email", className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { id: "signup-email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm", placeholder: "Enter your email", disabled: isSubmitting })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "signup-password", className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { id: "signup-password", type: showPassword ? "text" : "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-12 pr-12 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm", placeholder: "Enter password", disabled: isSubmitting }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center hover:text-sas-blue-600", disabled: isSubmitting, children: showPassword ? (_jsx(EyeOff, { className: "w-4 h-4 text-sas-gray-400" })) : (_jsx(Eye, { className: "w-4 h-4 text-sas-gray-400" })) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { id: "confirmPassword", type: showPassword ? "text" : "password", required: true, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm", placeholder: "Confirm password", disabled: isSubmitting })] })] }), password !== confirmPassword && confirmPassword && (_jsx("div", { className: "text-sm text-red-600", children: "Passwords do not match" })), _jsx("button", { type: "submit", disabled: isSubmitting || !email || !password || password !== confirmPassword, className: "w-full bg-sas-gradient text-white py-3 px-4 rounded-lg font-poppins font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin w-4 h-4" }), _jsx("span", { children: "Creating Account..." })] })) : (_jsxs(_Fragment, { children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { children: "Create Account" })] })) })] })), mode === 'reset' && (_jsx("div", { className: "space-y-4", children: !resetEmailSent ? (_jsxs("form", { onSubmit: handlePasswordReset, className: "space-y-4", children: [_jsxs("div", { className: "text-center mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-sas-gray-900", children: "Reset Password" }), _jsx("p", { className: "text-sm text-sas-gray-600 mt-1", children: "Enter your email address and we'll send you a link to reset your password." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reset-email", className: "block text-sm font-medium text-sas-gray-700 mb-2", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "w-5 h-5 text-sas-gray-400" }) }), _jsx("input", { id: "reset-email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm", placeholder: "Enter your email", disabled: isSubmitting })] })] }), _jsx("button", { type: "submit", disabled: isSubmitting || !email, className: "w-full bg-sas-gradient text-white py-3 px-4 rounded-lg font-poppins font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin w-4 h-4" }), _jsx("span", { children: "Sending..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Mail, { className: "w-4 h-4" }), _jsx("span", { children: "Send Reset Link" })] })) })] })) : (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4", children: _jsx(CheckCircle, { className: "h-6 w-6 text-green-600" }) }), _jsx("h3", { className: "text-lg font-medium text-sas-gray-900 mb-2", children: "Check your email" }), _jsxs("p", { className: "text-sm text-sas-gray-600 mb-4", children: ["We've sent a password reset link to ", email] }), _jsx("button", { type: "button", onClick: () => switchMode('signin'), className: "text-sas-navy-600 hover:text-sas-navy-500 text-sm font-medium", children: "Back to Sign In" })] })) })), mode !== 'reset' && (_jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-sas-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-sas-gray-500", children: "or" }) })] }), _jsx("div", { className: "mt-6", children: _jsx("button", { type: "button", onClick: handleGoogleSignIn, disabled: isSubmitting, className: "w-full flex justify-center items-center py-3 px-4 border border-sas-gray-300 rounded-lg shadow-sm text-sm font-medium text-sas-gray-700 bg-white hover:bg-sas-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sas-navy-500 disabled:opacity-50 disabled:cursor-not-allowed font-poppins", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin -ml-1 mr-3 h-5 w-5" }), "Connecting..."] })) : (_jsxs(_Fragment, { children: [_jsx(Chrome, { className: "w-5 h-5 mr-3" }), "Continue with Google"] })) }) })] })), _jsx("div", { className: "mt-6 text-center", children: _jsx("p", { className: "text-sm text-sas-gray-600", children: "Need help? Contact your system administrator" }) })] }), _jsxs("div", { className: "mt-6 bg-sas-navy-50 rounded-lg p-4 border border-sas-navy-200", children: [_jsx("p", { className: "text-sm text-sas-navy-700 font-poppins font-semibold mb-2", children: "Demo Credentials:" }), _jsxs("div", { className: "text-xs text-sas-navy-600 font-poppins space-y-1", children: [_jsxs("p", { children: [_jsx("strong", { children: "Super Admin:" }), " superadmin@sas.edu.sg / admin123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Administrator:" }), " admin@sas.edu.sg / admin123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Manager:" }), " manager@sas.edu.sg / manager123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Observer:" }), " observer@sas.edu.sg / observer123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Educator:" }), " teacher@sas.edu.sg / teacher123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Staff:" }), " staff@sas.edu.sg / staff123"] })] })] })] }) }));
};
export default LoginForm;
