import React, { useState, useEffect } from 'react';
import ObservationScheduler from './ObservationScheduler';
import { Loader2 } from 'lucide-react';

// Wrapper component to ensure client-only rendering
const ObservationSchedulerWrapper: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client after hydration
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sas-navy-600 mr-3" />
        <p className="text-gray-600">Loading observations...</p>
      </div>
    );
  }

  return <ObservationScheduler />;
};

export default ObservationSchedulerWrapper;
