import React from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select an option...',
  value = '',
  options,
  onChange,
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-sas-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          block w-full rounded-lg border-sas-gray-300 shadow-sm
          focus:ring-2 focus:ring-sas-blue-500 focus:border-transparent
          disabled:bg-sas-gray-50 disabled:text-sas-gray-500
          px-3 py-2
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
        `.trim()}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
