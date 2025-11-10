import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
// Dynamically import ObservationsPage only on client-side
const ObservationsPageWrapper = () => {
    const [ObservationsPage, setObservationsPage] = useState(null);
    useEffect(() => {
        // Only load the component on the client side
        import('./ObservationsPage').then((mod) => {
            setObservationsPage(() => mod.default);
        });
    }, []);
    if (!ObservationsPage) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Loading observations..." })] }) }));
    }
    return _jsx(ObservationsPage, {});
};
export default ObservationsPageWrapper;
