// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import CalendarNav from './CalendarNav';
import GoalsForm from './GoalsForm';
import Favorites from './Favorites';
import MealsSection from './MealsSection';
import ManualEntryForm from './ManualEntryForm';
import HealthSection from './HealthSection';
import WebScanner from './WebScanner';
import SettingsModal from './SettingsModal';
import './Dashboard.css';

export default function Dashboard({ currentUser, onLogout }) {
  const LOG_KEY   = `onemore-logs-${currentUser}`;
  const GOALS_KEY = `onemore-goals-${currentUser}`;

  const [date, setDate] = useState(new Date());
  const [goals, setGoals] = useState({ kcal:0, protein:0, carbs:0, fat:0 });
  const [logs, setLogs] = useState([]);
  const [manualMeal, setManualMeal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [healthData, setHealthData] = useState({
    water: null, bodyFat: null, steps: null,
    sleep: null, glucose: null, bp: null,
  });

  // Load & persist
  useEffect(() => {
    const g = JSON.parse(localStorage.getItem(GOALS_KEY));
    if (g) setGoals(g);
    const l = JSON.parse(localStorage.getItem(LOG_KEY));
    if (l) setLogs(l);
  }, [GOALS_KEY, LOG_KEY]);

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals, GOALS_KEY]);

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }, [logs, LOG_KEY]);

  // Calendar handlers
  const handlePrev = () => setDate(d => { const n=new Date(d); n.setDate(n.getDate()-1); return n; });
  const handleNext = () => setDate(d => { const n=new Date(d); n.setDate(n.getDate()+1); return n; });
  const handlePickWeek = d => setDate(d);

  // Health handlers
  const handleRecord = key => { const v=prompt(`Enter ${key}:`); if(v) setHealthData(h=>({...h,[key]:Number(v)})); };
  const handleClear = key => setHealthData(h=>({...h,[key]:null}));

  // Calculate totals & buckets
  const totals = logs.reduce((a,e)=>({
    kcal:a.kcal+e.kcal, protein:a.protein+e.protein,
    carbs:a.carbs+e.carbs, fat:a.fat+e.fat
  }),{kcal:0,protein:0,carbs:0,fat:0});
  const mealBuckets = {
    breakfast: logs.slice(0,3),
    lunch:     logs.slice(3,6),
    dinner:    logs.slice(6,9),
    snacks:    logs.slice(9),
  };

  // Save manual entry
  const handleSaveManual = entry => {
    const newLogs = [{ time: new Date().toLocaleTimeString(), ...entry }, ...logs];
    setLogs(newLogs);
    setManualMeal(null);
  };

  // Save goals
  const handleSaveGoals = g => { setGoals(g); };

  return (
    <div className="dashboard">
      <header className="app-header">
        <h1>OneMore</h1>
        <div>
          <button className="settings-btn" onClick={()=>setShowSettings(true)}>⚙️</button>
          <button className="logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <SettingsModal
        isOpen={showSettings}
        initialGoals={goals}
        onSave={handleSaveGoals}
        onClose={()=>setShowSettings(false)}
      />

      <CalendarNav
        date={date}
        onPrev={handlePrev}
        onNext={handleNext}
        onPickWeek={handlePickWeek}
      />

      <GoalsForm initialGoals={goals} onSave={handleSaveGoals} />

      <div className="progress-bars">
        {['kcal','protein','carbs','fat'].map(f=> {
          const done=totals[f], tgt=goals[f];
          return (
            <div key={f} className="progress-row">
              <label>{f.toUpperCase()}: {done}/{tgt}</label>
              <progress value={done} max={tgt} />
              <span>{Math.min(100,Math.round(done/tgt*100))}%</span>
            </div>
          );
        })}
      </div>

      <Favorites data={[
        { label:'Calories', value:totals.kcal, goal:goals.kcal, unit:'kcal', color:'#CC8B65' },
        { label:'Protein', value:totals.protein, goal:goals.protein, unit:'g', color:'#013328' },
        { label:'Carbs',   value:totals.carbs, goal:goals.carbs, unit:'g', color:'#4F3E34'  },
        { label:'Fat',     value:totals.fat, goal:goals.fat, unit:'g', color:'#30312F'    },
      ]} />

      {['breakfast','lunch','dinner','snacks'].map(m=>(
        <MealsSection
          key={m}
          title={m}
          entries={mealBuckets[m]}
          onAdd={()=>setManualMeal(m)}
        />
      ))}

      {manualMeal && (
        <ManualEntryForm
          mealType={manualMeal}
          onSave={handleSaveManual}
          onClose={()=>setManualMeal(null)}
        />
      )}

      <HealthSection
        data={healthData}
        onRecord={handleRecord}
        onClear={handleClear}
      />

      <aside className="scanner">
        <WebScanner />
      </aside>
    </div>
  );
}
