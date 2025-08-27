import React, { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2,
  BookOpen 
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    clearError();
    
    try {
      await signIn(email, password);
      
      // Navigate to dashboard after successful login
      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Error is handled by the auth store
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="text-sas-gray-600 font-poppins">Singapore American School</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sas-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bebas text-sas-navy-600 tracking-wide mb-2">Welcome Back</h2>
            <p className="text-sas-gray-600 font-poppins">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-sas-gradient text-white py-3 px-4 rounded-lg font-poppins font-semibold hover:opacity-90 focus:ring-2 focus:ring-sas-navy-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-sas-gray-600">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-sas-navy-50 rounded-lg p-4 border border-sas-navy-200">
          <p className="text-sm text-sas-navy-700 font-poppins font-semibold mb-2">Demo Credentials:</p>
          <div className="text-xs text-sas-navy-600 font-poppins space-y-1">
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