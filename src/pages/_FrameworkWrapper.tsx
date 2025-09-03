import React from 'react';
import FrameworkEditor from '../components/FrameworkEditor';
import PageWrapper from '../components/PageWrapper';

const FrameworkWrapper: React.FC = () => {
  return (
    <PageWrapper 
      title="Framework Configuration" 
      subtitle="Configure observation frameworks and question sets"
    >
      <FrameworkEditor />
    </PageWrapper>
  );
};

export default FrameworkWrapper;
