import React from 'react';
import ObservationScheduler from '../components/ObservationScheduler';
import PageWrapper from '../components/PageWrapper';

const ScheduleWrapper: React.FC = () => {
  return (
    <PageWrapper 
      title="Schedule Observations" 
      subtitle="Plan and schedule classroom observations"
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <ObservationScheduler />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ScheduleWrapper;
