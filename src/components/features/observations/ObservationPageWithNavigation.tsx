import React from 'react';
import { PlatformLayout } from '../../layout';
import SimpleObservationsPage from './SimpleObservationsPage';

interface ObservationPageWithNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const ObservationPageWithNavigation: React.FC<ObservationPageWithNavigationProps> = ({
  currentPath = '/observations',
  onNavigate
}) => {
  const breadcrumbItems = [
    { label: 'Platform', href: '/dashboard' },
    { label: 'Observations' }
  ];

  return (
    <PlatformLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      showBreadcrumb={true}
      breadcrumbItems={breadcrumbItems}
    >
      <SimpleObservationsPage />
    </PlatformLayout>
  );
};

export default ObservationPageWithNavigation;