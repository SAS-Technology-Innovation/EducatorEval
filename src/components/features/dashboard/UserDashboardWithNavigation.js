import { jsx as _jsx } from "react/jsx-runtime";
import { PlatformLayout } from '../../layout';
import UserDashboardSimple from './UserDashboardSimple';
const UserDashboardWithNavigation = ({ currentPath = '/dashboard', onNavigate }) => {
    return (_jsx(PlatformLayout, { currentPath: currentPath, onNavigate: onNavigate, children: _jsx(UserDashboardSimple, {}) }));
};
export default UserDashboardWithNavigation;
