// src/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import WebScanner from './WebScanner';
import ManualEntryForm from './ManualEntryForm';
import GoalsForm from './GoalsForm';
import CalendarNav from './CalendarNav';
import Favorites from './Favorites';
import MealsSection from './MealsSection';
import HealthSection from './HealthSection';
import SettingsModal from './SettingsModal';
import './App.css';

export default function Dashboard({ currentUser, onLogout }) {
  // Storage keys
  const LOG_KEY    = `onemore-logs-${currentUser}`;
  const CUSTOM_KEY = `onemore-custom-${currentUser}`;
  const REM_KEY    = `onemore-reminders-${currentUser}`;
  const GOALS_KEY  = `onemore-goals-${currentUser}`;

  // ─── Settings Modal ─────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);

  // ─── Date Navigator ─────────────────────────────────────────────────
  const [date, setDate] = useState(new Date());

  // ─── Daily Goals ────────────────────────────────────────────────────
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(GOALS_KEY);
    return saved
      ? JSON.parse(saved)
      : { kcal: 2000, protein: 75, carbs: 250, fat: 70 };
  });
  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  // ─── Logs ───────────────────────────────────────────────────────────
  const [logs, setLogs] = useState(() => {
    const s = localStorage.getItem(LOG_KEY);
    return s ? JSON.parse(s) : [];
  });
  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }, [logs]);

  // ─── Custom Items ──────────────────────────────────────────────────
  const [customItems, setCustomItems] = useState(() => {
    const s = localStorage.getItem(CUSTOM_KEY);
    return s ? JSON.parse(s) : {};
  });
  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customItems));
  }, [customItems]);

  // ─── Meal Reminders ─────────────────────────────────────────────────
  const [reminders, setReminders] = useState(() => {
    const s = localStorage.getItem(REM_KEY);
    return s
      ? JSON.parse(s)
      : { breakfast: '08:00', lunch: '12:00', dinner: '18:00' };
  });
  useEffect(() => {
    localStorage.setItem(REM_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const timersRef = useRef([]);
  function msUntil(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    const t = new Date(now);
    t.setHours(h, m, 0, 0);
    if (t <= now) t.setDate(t.getDate() + 1);
    return t - now;
  }
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    Object.entries(reminders).forEach(([meal, time]) => {
      const id = setTimeout(function tick() {
        new Notification(`🍽 Time for ${meal}!`);
        timersRef.current.push(setTimeout(tick, 24 * 60 * 60 * 1000));
      }, msUntil(time));
      timersRef.current.push(id);
    });
    return () => timersRef.current.forEach(clearTimeout);
  }, [reminders]);

  // ─── Barcode Scanner ────────────────────────────────────────────────
  const [barcode, setBarcode] = useState(null);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [needsManual, setNeedsManual] = useState(false);

  const handleDetected = async code => {
    setBarcode(code);
    setError(null);
    setInfo(null);
    setNeedsManual(false);

    // 1) custom override
    if (customItems[code]) {
      setInfo(customItems[code]);
      return;
    }
    // 2) fetch from OpenFoodFacts
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      const json = await res.json();
      if (json.status === 1 && json.product) {
        const p = json.product.product_name || 'Unknown';
        const n = json.product.nutriments || {};
        setInfo({
          name:    p,
          kcal:    n['energy-kcal_serving'] ?? n['energy-kcal_100g'] ?? 0,
          protein: n['proteins_100g']     ?? 0,
          carbs:   n['carbohydrates_100g']?? 0,
          fat:     n['fat_100g']          ?? 0,
        });
      } else {
        setNeedsManual(true);
      }
    } catch {
      setError('Network error');
      setNeedsManual(true);
    }
  };

  const handleSaveCustom = (code, obj) => {
    setCustomItems({ ...customItems, [code]: obj });
    setInfo(obj);
    setNeedsManual(false);
  };

  // ─── Logging ────────────────────────────────────────────────────────
  const addToLog = () => {
    if (!info) return;
    const entry = {
      time:    new Date().toLocaleTimeString(),
      name:    info.name,
      kcal:    info.kcal,
      protein: info.protein,
      carbs:   info.carbs,
      fat:     info.fat,
    };
    setLogs([entry, ...logs]);
    setBarcode(null);
    setInfo(null);
  };

  // ─── Aggregations ──────────────────────────────────────────────────
  const totals = logs.reduce(
    (sum, e) => ({
      kcal: sum.kcal + e.kcal,
      protein: sum.protein + e.protein,
      carbs: sum.carbs + e.carbs,
      fat: sum.fat + e.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const meals = {
    breakfast: logs.slice(0,3),
    lunch:     logs.slice(3,6),
    dinner:    logs.slice(6,9),
    snacks:    logs.slice(9),
  };

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="container">
      <header className="app-header">
        <h1>OneMore</h1>
        <div>
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >3
            ⚙️
          </button>
          <button className="logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <SettingsModal
        isOpen={showSettings}
        initialTarget={goals.kcal}
        onSave={newKcal => setGoals(g => ({ ...g, kcal: newKcal }))}
        onClose={() => setShowSettings(false)}
      />

      <CalendarNav
        date={date}
        onPrev={()  => setDate(d => { const dd = new Date(d); dd.setDate(dd.getDate()-1); return dd; })}
        onNext={()  => setDate(d => { const dd = new Date(d); dd.setDate(dd.getDate()+1); return dd; })}
        onPickWeek={d => setDate(d)}
      />

      <GoalsForm initialGoals={goals} onSave={setGoals} />

      <div className="progress-bars">
        {['kcal','protein','carbs','fat'].map(field => {
          const done   = totals[field];
          const target = goals[field];
          const pct    = Math.min(100, Math.round((done/target)*100));
          return (
            <div key={field} className="progress-row">
              <label>{field.toUpperCase()}: {done}/{target}</label>
              <progress value={done} max={target}></progress>
              <span>{pct}%</span>
            </div>
          );
        })}
      </div>

      <Favorites data={[
        { label:'Calories', value:totals.kcal,    goal:goals.kcal,    unit:'cals', color:'#4caf50' },
        { label:'Protein',  value:totals.protein, goal:goals.protein, unit:'g',    color:'#9c27b0' },
        { label:'Carbs',    value:totals.carbs,   goal:goals.carbs,   unit:'g',    color:'#03a9f4' },
        { label:'Fat',      value:totals.fat,     goal:goals.fat,     unit:'g',    color:'#ff9800' },
      ]} />

      <MealsSection title="Breakfast" entries={meals.breakfast} onAdd={()=>{}} />
      <MealsSection title="Lunch"     entries={meals.lunch}     onAdd={()=>{}} />
      <MealsSection title="Dinner"    entries={meals.dinner}    onAdd={()=>{}} />
      <MealsSection title="Snacks"    entries={meals.snacks}    onAdd={()=>{}} />

      <HealthSection
        data={{ water:0, bodyFat:null, steps:null, sleep:null, glucose:null, bp:null }}
        onRecord={k=>{}}
        onClear={k=>{}}
      />

      <div className="scanner">
        {!barcode ? (
          <WebScanner
            onDetected={handleDetected}
            onError={e => { setError(e.message); setNeedsManual(true); }}
          />
        ) : needsManual ? (
          <ManualEntryForm
            code={barcode}
            onSave={handleSaveCustom}
            onCancel={() => { setBarcode(null); setNeedsManual(false); }}
          />
        ) : (
          <div className="result-area">
            <label>
              Scanned:
              <input
                className="editable"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
              />
            </label>
            {error && <p className="error">{error}</p>}
            {info && (
              <>
                <p>
                  <strong>{info.name}</strong>: {info.kcal} kcal<br/>
                  P:{info.protein} C:{info.carbs} F:{info.fat}
                </p>
                <button onClick={addToLog}>➕ Add to Log</button>
                <button onClick={() => setBarcode(null)}>🔄 Scan Again</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
