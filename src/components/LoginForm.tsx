import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo bypass for testing
    if (email === 'demo@educatoreval.com' && password === 'password123') {
      console.log('🎯 Using demo bypass');
      sessionStorage.setItem('demoLogin', 'true');
      setTimeout(() => {
        window.location.href = '/dashboard?demo=true';
      }, 1000);
      return;
    }

    try {
      console.log('🔐 Attempting login for:', email);
      
      // Dynamic import to avoid SSR issues
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebase/config');
      
      console.log('🔥 Firebase auth initialized');
      
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful, redirecting...');
      
      // Redirect will happen automatically via auth state change
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting signup for:', email);
      
      // Dynamic import to avoid SSR issues
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebase/config');
      
      console.log('🔥 Firebase auth initialized');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created:', userCredential.user.uid);
      
      // Create user profile in Firestore
      const { userOperations } = await import('../firebase/firestore');
      console.log('💾 Creating user profile in Firestore...');
      
      await userOperations.create({
        name: name,
        email: email,
        role: 'observer', // Default role
        department: 'General', // Default department
        permissions: ['observation.view', 'observation.create'] // Default permissions
      });
      
      console.log('✅ User profile created, redirecting...');
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting password reset for:', email);
      
      // Dynamic import to avoid SSR issues
      const { sendPasswordResetEmail } = await import('firebase/auth');
      const { auth } = await import('../firebase/config');
      
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
      
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
    setMessage('');
  };

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EducatorEval</h1>
          <p className="text-gray-600">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">
                {mode === 'login' && 'Signing in...'}
                {mode === 'signup' && 'Creating account...'}
                {mode === 'reset' && 'Sending reset email...'}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <ArrowRight className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 text-sm">{message}</span>
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleResetPassword} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Email'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === 'login' && (
            <>
              <button
                onClick={() => switchMode('reset')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Forgot your password?
              </button>
              <div className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <div className="text-gray-600 text-sm">
              Remember your password?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </button>
            </div>
          )}
        </div>

        {mode === 'login' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center mb-3">
              Demo Account: demo@educatoreval.com / password123
            </div>
            <button
              onClick={() => {
                setEmail('demo@educatoreval.com');
                setPassword('password123');
              }}
              className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Fill Demo Credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
