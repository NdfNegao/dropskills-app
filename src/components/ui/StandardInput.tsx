import React from 'react';
import TooltipField from './TooltipField';

interface StandardInputProps {
  label: string;
  tooltip?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  icon?: React.ComponentType<any>;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
}

export function StandardInput({
  label,
  tooltip,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  type = 'text',
  icon,
  multiline = false,
  rows = 3,
  maxLength
}: StandardInputProps) {
  const inputClasses = `
    w-full px-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground
    focus:ring-2 focus:ring-primary focus:border-transparent transition-all
    ${error ? 'border-red-500' : 'border-border hover:border-border-hover'}
    ${multiline ? 'resize-none' : ''}
  `;

  const inputElement = multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClasses}
      rows={rows}
      maxLength={maxLength}
    />
  ) : (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClasses}
      maxLength={maxLength}
    />
  );

  if (tooltip) {
    return (
      <TooltipField 
        label={label} 
        tooltip={tooltip} 
        icon={icon} 
        required={required}
      >
        {inputElement}
        {error && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            {error}
          </p>
        )}
        {maxLength && (
          <p className="text-muted-foreground text-xs text-right">
            {value.length}/{maxLength}
          </p>
        )}
      </TooltipField>
    );
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon && React.createElement(icon, { className: "w-4 h-4" })}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {inputElement}
      {error && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <div className="w-1 h-1 bg-red-400 rounded-full" />
          {error}
        </p>
      )}
      {maxLength && (
        <p className="text-muted-foreground text-xs text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

export default StandardInput;
