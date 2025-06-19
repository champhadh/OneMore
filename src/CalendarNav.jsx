import React from 'react';
import './CalendarNav.css';    // make sure this matches the filename below

export default function CalendarNav({ date, onPrev, onNext, onPickWeek }) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(d.getDate() - date.getDay() + i);
    days.push(d);
  }

  return (
    <div className="calendar-nav">
      <button onClick={onPrev}  className="nav-btn">‹</button>
      <div  className="calendar-days">
        {days.map(d => (
          <div
            key={d.toDateString()}
            className={`day${d.getDate()===date.getDate()? ' active':''}`}
            onClick={() => onPickWeek(d)}
          >
            <div className="dow">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]}</div>
            <div className="dom">{d.getDate()}</div>
            <div className="circle">
              <svg viewBox="0 0 36 36">
                <path className="bg"
                  d="M18 2a16 16 0 1 0 0 32 16 16 0 1 0 0-32"
                />
                <path className="fg"
                  d="M18 2a16 16 0 1 0 0 32 16 16 0 1 0 0-32"
                  strokeDasharray={`${Math.random()*100},100`}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="nav-btn">›</button>
      <button onClick={() => onPickWeek(date)} className="week-btn">Week</button>
    </div>
  );
}
