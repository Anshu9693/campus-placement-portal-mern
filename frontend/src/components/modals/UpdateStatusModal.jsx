import React, { useState } from 'react';

export default function UpdateStatusModal({ isOpen, onClose, onSubmit }) {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(status);
    setStatus('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Status</h2>
        <form onSubmit={handleSubmit}>
          {/* Status selection */}
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
