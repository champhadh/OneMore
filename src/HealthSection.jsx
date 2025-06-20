// src/HealthSection.jsx
import React, { useState } from 'react';
import './HealthSection.css';

export default function HealthSection({ data, onRecord, onClear }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (key, val) => {
    setEditingKey(key);
    setEditValue(val);
  };

  const handleEditSave = () => {
    if (editValue === "" || isNaN(editValue)) return;
    onRecord(editingKey, Number(editValue));
    setEditingKey(null);
    setEditValue("");
  };

  return (
    <section className="health-section">
      <h2>Health</h2>
      <ul className="health-list">
        {data && Object.entries(data).map(([key, val]) => (
          <li className="health-entry" key={key}>
            <div className="health-info">
              <strong>{key.toUpperCase()}</strong>
              <span className="health-value">{val !== null ? val : <span className="desc">Start tracking your daily {key}</span>}</span>
            </div>
            <div className="health-actions">
              <button className="add-btn" onClick={() => onRecord(key)}>{val === null ? 'Add' : 'Edit'}</button>
              {val !== null && (
                <button className="delete-btn" onClick={() => onClear(key)}>Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {editingKey && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit {editingKey.toUpperCase()}</h3>
            <input
              type="number"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={handleEditSave}>Save</button>
              <button onClick={() => setEditingKey(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
