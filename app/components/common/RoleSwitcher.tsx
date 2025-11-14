import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth';
import type { UserRole } from '../../types';

interface RoleSwitcherProps {
  className?: string;
}

// Role display configuration
const ROLE_CONFIG: Record<UserRole, { label: string; emoji: string; color: string; bgColor: string }> = {
  'staff': { label: 'Staff', emoji: '👤', color: 'text-sas-gray-700', bgColor: 'bg-sas-gray-100' },
  'educator': { label: 'Teacher', emoji: '📚', color: 'text-sas-blue-700', bgColor: 'bg-sas-blue-100' },
  'observer': { label: 'Observer', emoji: '👁️', color: 'text-sas-purple-700', bgColor: 'bg-sas-purple-100' },
  'manager': { label: 'Manager', emoji: '📊', color: 'text-sas-green-700', bgColor: 'bg-sas-green-100' },
  'administrator': { label: 'Admin', emoji: '⚙️', color: 'text-sas-red-700', bgColor: 'bg-sas-red-100' },
  'super_admin': { label: 'Super Admin', emoji: '🔧', color: 'text-sas-navy-700', bgColor: 'bg-sas-navy-100' }
};

export default function RoleSwitcher({ className = '' }: RoleSwitcherProps) {
  const activeRole = useAuthStore(state => state.activeRole);
  const setActiveRole = useAuthStore(state => state.setActiveRole);
  const getAvailableRoles = useAuthStore(state => state.getAvailableRoles);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableRoles = getAvailableRoles();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Don't show switcher if user only has one role
  if (availableRoles.length <= 1) {
    return null;
  }

  if (!activeRole) return null;

  const activeConfig = ROLE_CONFIG[activeRole];

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Active Role Badge - Clickable to open dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
          transition-all duration-200 hover:shadow-md
          ${activeConfig.bgColor} ${activeConfig.color}
          border-2 border-transparent hover:border-current
        `}
        aria-label="Switch role"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{activeConfig.emoji}</span>
        <span className="font-semibold">{activeConfig.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Switch Role
            </p>
          </div>

          <div className="py-1">
            {availableRoles.map((role) => {
              const config = ROLE_CONFIG[role];
              const isActive = role === activeRole;

              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-sm
                    transition-colors duration-150
                    ${isActive
                      ? `${config.bgColor} ${config.color} font-semibold`
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  disabled={isActive}
                >
                  <span className="text-lg leading-none">{config.emoji}</span>
                  <span className="flex-1 text-left">{config.label}</span>
                  {isActive && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Your view and navigation adapt to your active role
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
