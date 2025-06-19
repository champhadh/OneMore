// src/HealthSection.jsx
import React from 'react';
import './HealthSection.css';

export default function HealthSection({ data, onRecord, onClear }) {
  return (
    <section className="health-section">
      <h2>Health</h2>
      {data && Object.entries(data).map(([key, val]) => (
        <div className="health-row" key={key}>
          <div className="health-info">
            <span className="label">{key.toUpperCase()}</span>
            <span className="desc">
              {val !== null ? val : `Start tracking your daily ${key}`}
            </span>
          </div>
          <div className="health-actions">
            <button className="record-btn" onClick={() => onRecord(key)}>＋</button>
            {val !== null && (
              <button className="clear-btn" onClick={() => onClear(key)}>✕</button>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
