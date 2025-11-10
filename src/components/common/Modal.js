import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', icon: Icon }) => {
    if (!isOpen)
        return null;
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity", onClick: onClose }), _jsxs("div", { className: `
          inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all
          sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]}
        `, children: [_jsx("div", { className: "bg-white px-6 py-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [Icon && _jsx(Icon, { className: "w-5 h-5 text-sas-gray-500 mr-2" }), _jsx("h3", { className: "text-lg font-medium text-sas-gray-900", children: title })] }), _jsx("button", { onClick: onClose, className: "text-sas-gray-400 hover:text-sas-gray-600 transition-colors", children: _jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) }), _jsx("div", { className: "bg-white px-6 py-4", children: children }), footer && (_jsx("div", { className: "bg-gray-50 px-6 py-3 border-t border-gray-200", children: footer }))] })] }) }));
};
export default Modal;
