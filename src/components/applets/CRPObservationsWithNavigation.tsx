import React from 'react';
import { PlatformLayout } from '../layout';
import CRPObservationsApplet from './CRPObservationsApplet';

interface CRPObservationsWithNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const CRPObservationsWithNavigation: React.FC<CRPObservationsWithNavigationProps> = ({
  currentPath = '/applets/crp-observations',
  onNavigate
}) => {
  const breadcrumbItems = [
    { label: 'Observations', onClick: () => onNavigate?.('/observations') },
    { label: 'CRP Framework' }
  ];

  return (
    <PlatformLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      isApplet={true}
      appletName="CRP Observations"
      appletDescription="Culturally Responsive Pedagogy Assessment Tool"
      showBreadcrumb={true}
      breadcrumbItems={breadcrumbItems}
      fullWidth={true}
    >
      <div className="py-8">
        <CRPObservationsApplet />
      </div>
    </PlatformLayout>
  );
};

export default CRPObservationsWithNavigation;