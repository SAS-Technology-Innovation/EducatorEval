import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import ObservationScheduler from './ObservationScheduler';
import { Loader2 } from 'lucide-react';
// Wrapper component to ensure client-only rendering
const ObservationSchedulerWrapper = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        // Only run on client after hydration
        setIsClient(true);
    }, []);
    if (!isClient) {
        return (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-sas-navy-600 mr-3" }), _jsx("p", { className: "text-gray-600", children: "Loading observations..." })] }));
    }
    return _jsx(ObservationScheduler, {});
};
export default ObservationSchedulerWrapper;
