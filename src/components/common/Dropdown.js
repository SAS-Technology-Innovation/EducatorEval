import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Dropdown = ({ label, placeholder = 'Select an option...', value = '', options, onChange, error, required = false, disabled = false, className = '' }) => {
    const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
    return (_jsxs("div", { className: `space-y-1 ${className}`, children: [label && (_jsxs("label", { htmlFor: selectId, className: "block text-sm font-medium text-sas-gray-700", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("select", { id: selectId, value: value, onChange: (e) => onChange?.(e.target.value), disabled: disabled, className: `
          block w-full rounded-lg border-sas-gray-300 shadow-sm
          focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent
          disabled:bg-sas-gray-50 disabled:text-sas-gray-500
          px-3 py-2
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
        `.trim(), children: [_jsx("option", { value: "", disabled: true, children: placeholder }), options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }), error && (_jsx("p", { className: "text-sm text-red-600", children: error }))] }));
};
export default Dropdown;
