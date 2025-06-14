// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import WebScanner from './WebScanner';
import ManualEntryForm from './ManualEntryForm';
import './App.css';

const CUSTOM_KEY    = 'onemore-custom';
const LOG_KEY       = 'onemore-logs';
const REMINDERS_KEY = 'onemore-reminders';

// helper to compute ms until next hh:mm
function msUntil(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}

export default function App() {
  // scanner state
  const [barcode,     setBarcode]    = useState(null);
  const [info,        setInfo]       = useState(null);
  const [error,       setError]      = useState(null);
  const [needsManual, setNeedsManual]= useState(false);

  // logs
  const [logs, setLogs] = useState(() => {
    const s = localStorage.getItem(LOG_KEY);
    return s ? JSON.parse(s) : [];
  });
  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }, [logs]);

  // custom items
  const [customItems, setCustomItems] = useState(() => {
    const s = localStorage.getItem(CUSTOM_KEY);
    return s ? JSON.parse(s) : {};
  });
  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customItems));
  }, [customItems]);

  // meal reminders times
  const [reminders, setReminders] = useState(() => {
    const s = localStorage.getItem(REMINDERS_KEY);
    return s
      ? JSON.parse(s)
      : { breakfast: '08:00', lunch: '12:00', dinner: '18:00' };
  });

  // store timers so we can clear on change
  const timersRef = useRef([]);

  // schedule notifications
  const scheduleReminders = () => {
    // clear old
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    Object.entries(reminders).forEach(([meal, timeStr]) => {
      const ms = msUntil(timeStr);
      // schedule first fire
      const id = setTimeout(function tick() {
        new Notification(`🍽 Time for ${meal}!`);
        // schedule next day
        timersRef.current.push(setTimeout(tick, 24 * 60 * 60 * 1000));
      }, ms);
      timersRef.current.push(id);
    });
  };

  // on mount: request permission & schedule
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    scheduleReminders();
    // clear on unmount
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // re-schedule when reminder times change
  useEffect(() => {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    scheduleReminders();
  }, [reminders]);

  // … your handleDetected, handleSaveCustom, addToLog, totalCalories here …
  // (same as before, omitted for brevity)
  // For full code see previous message.

  return (
    <div className="container">
      <h1>OneMore Web Scanner</h1>

      {/* ── Settings: Meal Reminders ── */}
      <section style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2>Meal Reminders</h2>
        {['breakfast','lunch','dinner'].map(meal => (
          <label key={meal} style={{ margin: '0 1rem' }}>
            {meal.charAt(0).toUpperCase()+meal.slice(1)}:
            <input
              type="time"
              value={reminders[meal]}
              onChange={e =>
                setReminders({...reminders, [meal]: e.target.value})
              }
              style={{ marginLeft: '0.5rem', padding: '0.2rem' }}
            />
          </label>
        ))}
      </section>

      {/* ── Scanner / Manual / Result ── */}
      <div className="scanner">
        {!barcode ? (
          <WebScanner
            onDetected={handleDetected}
            onError={e => {
              setError(e.message);
              setNeedsManual(true);
            }}
          />
        ) : needsManual ? (
          <ManualEntryForm
            code={barcode}
            onSave={handleSaveCustom}
            onCancel={() => {
              setBarcode(null);
              setNeedsManual(false);
            }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem' }}>
              Scanned:
              <input
                className="editable"
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
              />
            </label>
            {error && <p className="error">{error}</p>}
            {info && (
              <>
                <p>
                  <strong>{info.name}</strong>: {info.kcal} kcal
                  <br/>
                  P:{info.protein} C:{info.carbs} F:{info.fat}
                </p>
                <button onClick={addToLog}>➕ Add to Log</button>
                <button onClick={() => setBarcode(null)}>🔄 Scan Again</button>
              </>
            )}
          </div>
        )}
      </div>

      <hr/>

      {/* ── Today's Log ── */}
      <h2>Today's Log</h2>
      <p><strong>Total: {logs.reduce((s,e)=>s+e.kcal,0)} kcal</strong></p>
      {logs.length===0 ? (
        <p>No items logged yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th><th>Name</th><th>Kcal</th>
              <th>P</th><th>C</th><th>F</th><th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((e,i)=>(
              <tr key={i}>
                <td>{e.time}</td><td>{e.name}</td><td>{e.kcal}</td>
                <td>{e.protein}</td><td>{e.carbs}</td><td>{e.fat}</td>
                <td>
                  <button onClick={()=>
                    setLogs(logs.filter((_,idx)=>idx!==i))
                  }>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
