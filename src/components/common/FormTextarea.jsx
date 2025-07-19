import React from 'react';

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  className = "",
  readOnly = false,
  rows = 4,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      rows={rows}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 resize-none h-auto ${error ? 'border-red-500' : ''} ${className}`}
      required={required}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FormTextarea;
