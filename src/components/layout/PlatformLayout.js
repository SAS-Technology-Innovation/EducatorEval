import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import UnifiedHeader from './UnifiedHeader';
const PlatformLayout = ({ children, currentPath = '/', onNavigate, fullWidth = false, showBreadcrumb = false, breadcrumbItems = [], className = '' }) => {
    return (_jsxs("div", { className: `min-h-screen bg-sas-background ${className}`, children: [_jsx(UnifiedHeader, { currentPath: currentPath, onNavigate: onNavigate, showBreadcrumb: showBreadcrumb, breadcrumbItems: breadcrumbItems }), _jsx("main", { children: _jsx("div", { className: fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', children: children }) })] }));
};
export default PlatformLayout;
