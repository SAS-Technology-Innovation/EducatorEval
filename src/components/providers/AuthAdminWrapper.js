import { jsx as _jsx } from "react/jsx-runtime";
import AuthWrapper from './AuthWrapper';
import AdminDashboard from '../admin/AdminDashboard';
const AuthAdminWrapper = ({ defaultTab = 'overview' }) => {
    return (_jsx(AuthWrapper, { requireAuth: true, requireRoles: ['super_admin', 'administrator'], children: _jsx(AdminDashboard, { defaultTab: defaultTab }) }));
};
export default AuthAdminWrapper;
