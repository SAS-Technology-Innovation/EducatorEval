import React from 'react';
import { PlatformLayout } from '../../layout';
import UserDashboardSimple from './UserDashboardSimple';

interface UserDashboardWithNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const UserDashboardWithNavigation: React.FC<UserDashboardWithNavigationProps> = ({
  currentPath = '/dashboard',
  onNavigate
}) => {
  return (
    <PlatformLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
    >
      <UserDashboardSimple />
    </PlatformLayout>
  );
};

export default UserDashboardWithNavigation;