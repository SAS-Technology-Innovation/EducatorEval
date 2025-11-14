// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2,
  BookOpen,
  User,
  ArrowRight,
  CheckCircle,
  UserPlus,
  RotateCcw,
  Chrome
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

type FormMode = 'signin' | 'signup' | 'reset';

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [mode, setMode] = useState<FormMode>('signin');
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

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    console.log('🔐 Attempting sign in with:', email);
    setIsSubmitting(true);
    clearError();
    
    try {
      await signIn(email, password);
      console.log('✅ Sign in successful!');
      
      // Navigate to dashboard after successful login
      if (onSuccess) {
        onSuccess();
      } else {
        console.log('🔄 Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000); // Small delay to ensure auth state is updated
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      // Error is handled by the auth store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return;

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
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: any) => {
    e.preventDefault();
    if (isSubmitting || !email) return;

    setIsSubmitting(true);
    clearError();
    
    try {
      await sendPasswordReset(email);
      setResetEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    clearError();
    
    try {
      await signInWithGoogle();
      
      // Navigate to dashboard after successful login
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
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

  const switchMode = (newMode: FormMode) => {
    console.log('Switching mode to:', newMode); // Debug log
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-sas-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* SAS Logo and Header */}
        <div className="text-center mb-8">
          <img 
            src="https://resources.finalsite.net/images/v1736450683/sas/q9u7ppfdasutt8sglmzh/school-logo.svg"
            alt="Singapore American School"
            className="h-16 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl font-bebas text-sas-navy-600 tracking-wider mb-2">EducatorEval</h1>
          <p className="text-sas-gray-600">Singapore American School</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sas-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bebas text-sas-navy-600 tracking-wide mb-2">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}  
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <p className="text-sas-gray-600">
              {mode === 'signin' && 'Sign in to your account to continue'}
              {mode === 'signup' && 'Join the EducatorEval community'}
              {mode === 'reset' && 'We\'ll help you get back into your account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-sas-gray-200 mb-6">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                mode === 'signin' 
                  ? 'text-sas-navy-600 border-b-2 border-sas-navy-600' 
                  : 'text-sas-gray-500 hover:text-sas-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                mode === 'signup' 
                  ? 'text-sas-navy-600 border-b-2 border-sas-navy-600' 
                  : 'text-sas-gray-500 hover:text-sas-gray-700'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => switchMode('reset')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                mode === 'reset' 
                  ? 'text-sas-navy-600 border-b-2 border-sas-navy-600' 
                  : 'text-sas-gray-500 hover:text-sas-gray-700'
              }`}
            >
              Reset
            </button>
          </div>

          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sas-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-sas-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sas-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-sas-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sas-gray-400 hover:text-sas-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full bg-sas-gradient text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 focus:ring-2 focus:ring-sas-navy-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-sas-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-sas-gray-400" />
                  </div>
                  <input
                    id="displayName"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm"
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-sas-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-sas-gray-400" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-sas-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-sas-gray-400" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm"
                    placeholder="Enter password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-sas-blue-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-sas-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-sas-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-sas-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-sas-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm"
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {password !== confirmPassword && confirmPassword && (
                <div className="text-sm text-red-600">
                  Passwords do not match
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email || !password || password !== confirmPassword}
                className="w-full bg-sas-gradient text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Password Reset Form */}
          {mode === 'reset' && (
            <div className="space-y-4">
              {!resetEmailSent ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-sas-gray-900">Reset Password</h3>
                    <p className="text-sm text-sas-gray-600 mt-1">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-sas-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-sas-gray-400" />
                      </div>
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-sas-gray-300 rounded-lg focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent transition-colors text-sm"
                        placeholder="Enter your email"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full bg-sas-gradient text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-sas-gray-900 mb-2">Check your email</h3>
                  <p className="text-sm text-sas-gray-600 mb-4">
                    We've sent a password reset link to {email}
                  </p>
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="text-sas-navy-600 hover:text-sas-navy-500 text-sm font-medium"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google Sign In - Available for all modes except reset */}
          {mode !== 'reset' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sas-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-sas-gray-500">or</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-sas-gray-300 rounded-lg shadow-sm text-sm font-medium text-sas-gray-700 bg-white hover:bg-sas-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sas-navy-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Chrome className="w-5 h-5 mr-3" />
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-sas-gray-600">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-sas-navy-50 rounded-lg p-4 border border-sas-navy-200">
          <p className="text-sm text-sas-navy-700 font-semibold mb-2">Demo Credentials:</p>
          <div className="text-xs text-sas-navy-600 space-y-1">
            <p><strong>Super Admin:</strong> superadmin@sas.edu.sg / admin123</p>
            <p><strong>Administrator:</strong> admin@sas.edu.sg / admin123</p>
            <p><strong>Manager:</strong> manager@sas.edu.sg / manager123</p>
            <p><strong>Observer:</strong> observer@sas.edu.sg / observer123</p>
            <p><strong>Educator:</strong> teacher@sas.edu.sg / teacher123</p>
            <p><strong>Staff:</strong> staff@sas.edu.sg / staff123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;