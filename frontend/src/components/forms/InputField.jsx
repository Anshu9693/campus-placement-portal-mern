import React from 'react';

export default function InputField({ label, type, name, value, onChange, placeholder }) {
  return (
    <div className="input-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
