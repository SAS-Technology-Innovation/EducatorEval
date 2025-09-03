import React from 'react';
import TopHeader from './TopHeader';
import ProtectedRoute from './ProtectedRoute';

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, subtitle, children }) => {
  return (
    <ProtectedRoute>
      <div className="h-full flex flex-col">
        <TopHeader title={title} subtitle={subtitle} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PageWrapper;
