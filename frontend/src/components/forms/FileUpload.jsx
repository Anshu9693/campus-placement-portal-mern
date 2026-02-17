import React from 'react';

export default function FileUpload({ label, name, onChange, accept }) {
  return (
    <div className="file-upload">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
      />
    </div>
  );
}
