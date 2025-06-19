import React from 'react';
import './HealthSection.css';

const METRICS = [
  { key: 'water', label: 'Water', unit: 'ml' },
  { key: 'bodyFat', label: 'Body Fat', unit: '%' },
  { key: 'steps', label: 'Steps', unit: '' },
  { key: 'sleep', label: 'Sleep', unit: 'h' },
  { key: 'glucose', label: 'Blood Glucose', unit: 'mg/dl' },
  { key: 'bp', label: 'Blood Pressure', unit: 'mmHg' },
];

export default function HealthSection({ data, onRecord, onClear }) {
  return (
    <section className="health-section">
      <h2>Health</h2>
      {METRICS.map(m => (
        <div key={m.key} className="health-card">
          <div className="hc-header">
            <div className="hc-label">{m.label.toUpperCase()}</div>
            <button className="hc-clear" onClick={() => onClear(m.key)}>✕</button>
          </div>
          {data[m.key] ? (
            <div className="hc-value">{data[m.key]} {m.unit}</div>
          ) : (
            <div className="hc-empty">
              Start tracking your daily {m.label.toLowerCase()}
            </div>
          )}
          <button className="hc-add" onClick={() => onRecord(m.key)}>＋</button>
        </div>
      ))}
    </section>
  );
}
