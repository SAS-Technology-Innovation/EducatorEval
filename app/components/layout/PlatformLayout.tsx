import React from 'react';
import UnifiedHeader from './UnifiedHeader';

interface PlatformLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  
  // Layout options
  fullWidth?: boolean;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string; onClick?: () => void }>;
  
  // Layout state
  className?: string;
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({
  children,
  currentPath = '/',
  onNavigate,
  fullWidth = false,
  showBreadcrumb = false,
  breadcrumbItems = [],
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-sas-background ${className}`}>
      {/* Unified Navigation Header */}
      <UnifiedHeader
        currentPath={currentPath}
        onNavigate={onNavigate}
        showBreadcrumb={showBreadcrumb}
        breadcrumbItems={breadcrumbItems}
      />

      {/* Main Content */}
      <main>
        <div className={fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlatformLayout;