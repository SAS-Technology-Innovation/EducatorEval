import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const InputField = ({ label, placeholder, type = 'text', value = '', onChange, error, required = false, disabled = false, icon, className = '' }) => {
    const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
    return (_jsxs("div", { className: `space-y-1 ${className}`, children: [label && (_jsxs("label", { htmlFor: inputId, className: "block text-sm font-medium text-sas-gray-700", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: icon })), _jsx("input", { id: inputId, type: type, value: value, onChange: (e) => onChange?.(e.target.value), placeholder: placeholder, disabled: disabled, className: `
            block w-full rounded-lg border-sas-gray-300 shadow-sm
            focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent
            disabled:bg-sas-gray-50 disabled:text-sas-gray-500
            ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
          `.trim() })] }), error && (_jsx("p", { className: "text-sm text-red-600", children: error }))] }));
};
export default InputField;
