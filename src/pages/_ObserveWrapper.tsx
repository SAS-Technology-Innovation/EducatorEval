import React from 'react';
import MobileObservationForm from '../components/MobileObservationForm';
import PageWrapper from '../components/PageWrapper';

const ObserveWrapper: React.FC = () => {
  return (
    <PageWrapper 
      title="Live Observation" 
      subtitle="Conduct real-time classroom observations"
    >
      <div className="min-h-screen bg-gray-50">
        <MobileObservationForm />
      </div>
    </PageWrapper>
  );
};

export default ObserveWrapper;
