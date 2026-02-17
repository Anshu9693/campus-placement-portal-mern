import React from 'react';

export default function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="select-field">
      {label && <label htmlFor={name}>{label}</label>}
      <select id={name} name={name} value={value} onChange={onChange}>
        <option value="">Select an option</option>
        {options?.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
