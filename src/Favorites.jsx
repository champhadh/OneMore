// src/Favorites.jsx
import React from 'react';
import './Favorites.css';

export default function Favorites({ data }) {
  return (
    <div className="favorites-grid">
      {data.map(({ label, value, goal, unit, color }) => {
        const pct = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
        const status = goal > 0 && value > goal ? 'OVER' : 'UNDER';

        return (
          <div key={label} className="fav-card">
            <h3>{label.toUpperCase()}</h3>
            <div className="ring-chart" style={{ '--pct': pct, '--accent': color }}>
              <svg viewBox="0 0 36 36">
                <path className="bg" d="M18 2a16 16 0 1 0 0 32 16 16 0 1 0 0-32"/>
                <path className="fg" d="M18 2a16 16 0 1 0 0 32 16 16 0 1 0 0-32"
                      strokeDasharray={`${pct} 100`}/>
              </svg>
              <div className="inner">
                <span className="val">{value || 0}</span>
                <span className="unit">{unit}</span>
              </div>
            </div>
            <p className="status">{status}</p>
          </div>
        );
      })}
    </div>
  );
}
