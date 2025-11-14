import React, { useState, useEffect } from 'react';

// Dynamically import ObservationsPage only on client-side
const ObservationsPageWrapper: React.FC = () => {
  const [ObservationsPage, setObservationsPage] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Only load the component on the client side
    import('./ObservationsPage').then((mod) => {
      setObservationsPage(() => mod.default);
    });
  }, []);

  if (!ObservationsPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sas-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading observations...</p>
        </div>
      </div>
    );
  }

  return <ObservationsPage />;
};

export default ObservationsPageWrapper;
