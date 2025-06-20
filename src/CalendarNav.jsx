// src/CalendarNav.jsx
import React, { useState, useEffect } from 'react';
import './CalendarNav.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarNav({ selectedDate = new Date(), onDateChange }) {
  // Compute the Sunday of the week containing selectedDate
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sun … 6 = Sat
    d.setDate(d.getDate() - day);
    return d;
  };

  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(selectedDate));

  // Whenever parent changes selectedDate, recalc our week
  useEffect(() => {
    setStartOfWeek(getStartOfWeek(selectedDate));
  }, [selectedDate]);

  // Handlers for prev/next week
  const prevWeek = () => {
    const newStart = new Date(startOfWeek);
    newStart.setDate(startOfWeek.getDate() - 7);
    setStartOfWeek(newStart);
    onDateChange?.(newStart);
  };
  const nextWeek = () => {
    const newStart = new Date(startOfWeek);
    newStart.setDate(startOfWeek.getDate() + 7);
    setStartOfWeek(newStart);
    onDateChange?.(newStart);
  };

  // Build the 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="calendar-nav">
      <button className="calendar-nav__arrow" onClick={prevWeek}>&lt;</button>
      {days.map((d) => {
        const isSelected = d.toDateString() === selectedDate.toDateString();
        return (
          <div
            key={d.toDateString()}
            className={`calendar-nav__day${isSelected ? ' selected' : ''}`}
            onClick={() => onDateChange?.(d)}
          >
            <div className="calendar-nav__number">{d.getDate()}</div>
            <div className="calendar-nav__label">{WEEKDAYS[d.getDay()]}</div>
          </div>
        );
      })}
      <button className="calendar-nav__arrow" onClick={nextWeek}>&gt;</button>
    </div>
  );
}
