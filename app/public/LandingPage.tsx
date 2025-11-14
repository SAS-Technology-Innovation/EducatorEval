import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import { BookOpen, ArrowRight, Users, Shield, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase auth listener
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      window.location.href = '/app/dashboard';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sas-background">
        <div className="animate-spin w-8 h-8 border-4 border-sas-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sas-background">
      {/* Hero Section with SAS Banner */}
      <div className="sas-hero-banner min-h-screen relative">
        <div className="sas-hero-overlay min-h-screen">
          {/* Header */}
          <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://resources.finalsite.net/images/v1736450683/sas/q9u7ppfdasutt8sglmzh/school-logo.svg"
                    alt="Singapore American School"
                    className="h-12 w-auto filter brightness-0 invert"
                  />
                  <div>
                    <h1 className="text-2xl font-bebas text-white tracking-wider">EducatorEval</h1>
                    <p className="text-sm text-white/80">Singapore American School</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/auth/login"
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Content */}
          <main className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30">
                  <Zap className="w-4 h-4 mr-2" />
                  The Eagle Way - Excellence in Education
                </span>
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bebas text-white leading-none mb-8 tracking-wider">
                EducatorEval
              </h1>
              <p className="text-2xl sm:text-3xl text-white/90 font-light mb-4">
                Excellence in Educational Evaluation
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-12">
                Comprehensive platform for classroom observation, educator evaluation, and professional development - built for Singapore American School's commitment to educational excellence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to="/auth/login"
                  className="bg-white text-sas-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white/90 shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-105 flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="border-2 border-white text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-200 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn More
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-sas-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bebas text-sas-blue-600 tracking-wider mb-4">Platform Features</h2>
            <p className="text-xl text-sas-gray-600">Excellence in educational evaluation</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sas-gray-200 hover:bg-white/90 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-sas-blue-500 to-sas-blue-600 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-sas-gray-900 mb-3 font-bebas tracking-wide">CRP Observations</h3>
            <p className="text-sas-gray-600">
              Culturally Responsive Pedagogy observation tools with real-time data collection and analysis.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sas-gray-200 hover:bg-white/90 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-sas-green-500 to-sas-green-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-sas-gray-900 mb-3 font-bebas tracking-wide">User Management</h3>
            <p className="text-sas-gray-600">
              Role-based access control for teachers, administrators, and observers with secure authentication.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sas-gray-200 hover:bg-white/90 transition-all duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-sas-purple-500 to-sas-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-sas-gray-900 mb-3 font-bebas tracking-wide">Enterprise Security</h3>
            <p className="text-sas-gray-600">
              Firebase Authentication with Firestore security rules ensuring data protection and compliance.
            </p>
          </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center border border-sas-gray-200">
            <h2 className="text-3xl font-bold text-sas-gray-900 mb-4 font-bebas tracking-wider">Ready to get started?</h2>
            <p className="text-sas-gray-600 mb-8 max-w-2xl mx-auto">
              Join educators and administrators using EducatorEval to enhance teaching practices and student outcomes.
            </p>
            <Link
              to="/auth/login"
              className="bg-sas-gradient text-white px-8 py-3 rounded-xl text-lg font-semibold hover:opacity-90 shadow-lg transition-all duration-200 hover:shadow-xl inline-flex items-center"
            >
              Sign In Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;