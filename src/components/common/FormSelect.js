import React from 'react';

const FormSelect = ({ label, name, value, onChange, options, error, required, className = "", readOnly = false }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={readOnly}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${error ? 'border-red-500' : ''} ${className}`}
      required={required}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FormSelect;
