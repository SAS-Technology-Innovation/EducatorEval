import React from 'react';
import ObservationDashboard from '../components/ObservationDashboard';
import PageWrapper from '../components/PageWrapper';

const ObservationWrapper: React.FC = () => {
  return (
    <PageWrapper 
      title="Observations" 
      subtitle="View and manage classroom observations"
    >
      <ObservationDashboard />
    </PageWrapper>
  );
};

export default ObservationWrapper;
