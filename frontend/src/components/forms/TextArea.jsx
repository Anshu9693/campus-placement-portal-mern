import React from 'react';

export default function TextArea({ label, name, value, onChange, placeholder, rows }) {
  return (
    <div className="textarea-field">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows || 4}
      />
    </div>
  );
}
