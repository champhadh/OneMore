// src/CalendarNav.jsx
import React from 'react';
import './CalendarNav.css';

export default function CalendarNav({ date, onPrev, onNext, onPickWeek }) {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <div className="calendar-nav">
      <button onClick={onPrev} className="nav-btn">‹</button>
      <div className="calendar-days">
        {days.map(d => {
          const sel = d.toDateString() === date.toDateString();
          return (
            <div
              key={d}
              className={`day${sel ? ' selected' : ''}`}
              onClick={() => onPickWeek(d)}
            >
              <div className="date">{d.getDate()}</div>
              <div className="weekday">
                {d.toLocaleDateString(undefined, { weekday:'short' })}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onNext} className="nav-btn">›</button>
    </div>
  );
}
