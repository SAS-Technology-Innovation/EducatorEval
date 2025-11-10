import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Button = ({ variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', disabled = false, loading = false, onClick, children, className = '', type = 'button' }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        primary: 'bg-sas-blue-600 text-white hover:bg-sas-blue-700 focus:ring-sas-blue-500',
        secondary: 'bg-sas-gray-600 text-white hover:bg-sas-gray-700 focus:ring-sas-gray-500',
        success: 'bg-sas-green-600 text-white hover:bg-sas-green-700 focus:ring-sas-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'bg-white border border-sas-gray-300 text-sas-gray-700 hover:bg-sas-gray-50 focus:ring-sas-blue-500'
    };
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();
    return (_jsxs("button", { type: type, className: classes, onClick: onClick, disabled: disabled || loading, children: [loading ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" })) : (Icon && iconPosition === 'left' && _jsx(Icon, { className: "w-4 h-4 mr-2" })), children, Icon && iconPosition === 'right' && !loading && _jsx(Icon, { className: "w-4 h-4 ml-2" })] }));
};
export default Button;
