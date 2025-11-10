import { jsx as _jsx } from "react/jsx-runtime";
import { PlatformLayout } from '../../layout';
import SimpleObservationsPage from './SimpleObservationsPage';
const ObservationPageWithNavigation = ({ currentPath = '/observations', onNavigate }) => {
    const breadcrumbItems = [
        { label: 'Platform', href: '/dashboard' },
        { label: 'Observations' }
    ];
    return (_jsx(PlatformLayout, { currentPath: currentPath, onNavigate: onNavigate, showBreadcrumb: true, breadcrumbItems: breadcrumbItems, children: _jsx(SimpleObservationsPage, {}) }));
};
export default ObservationPageWithNavigation;
