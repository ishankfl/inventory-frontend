import React from 'react';

const FormInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required,
  type = "text",
  readOnly = false,
  placeholder = "",
  className = ""
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm h-12 px-3 ${error ? 'border-red-500' : ''} ${className}`}
      required={required}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FormInput;
