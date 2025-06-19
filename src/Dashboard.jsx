// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import CalendarNav from './CalendarNav';
import MealsSection from './MealsSection';
import ManualEntryForm from './ManualEntryForm';
import NutritionModal from './NutritionModal';
import HealthSection from './HealthSection';
import WebScanner from './WebScanner';
import SettingsModal from './SettingsModal';
import Favorites from './Favorites';
import './Dashboard.css';

export default function Dashboard({ currentUser, onLogout }) {
  const LOG_KEY   = `onemore-logs-${currentUser}`;
  const GOALS_KEY = `onemore-goals-${currentUser}`;

  // State
  const [date, setDate]                 = useState(new Date());
  const [goals, setGoals]               = useState({ kcal:0, protein:0, carbs:0, fat:0 });
  const [logs, setLogs]                 = useState([]);
  const [choiceMeal, setChoiceMeal]     = useState(null);
  const [manualMeal, setManualMeal]     = useState(null);
  const [scanningMeal, setScanningMeal] = useState(null);
  const [scannedItem, setScannedItem]   = useState(null);
  const [healthData, setHealthData]     = useState({ water:null, bodyFat:null, steps:null, sleep:null, glucose:null, bp:null });
  const [showSettings, setShowSettings] = useState(false);

  // Load / Persist
  useEffect(() => {
    const g = JSON.parse(localStorage.getItem(GOALS_KEY)); if (g) setGoals(g);
    const l = JSON.parse(localStorage.getItem(LOG_KEY));  if (l) setLogs(l);
  }, [GOALS_KEY, LOG_KEY]);

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals, GOALS_KEY]);

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }, [logs, LOG_KEY]);

  // Handlers
  const handlePrev     = () => setDate(d=>{ const n=new Date(d); n.setDate(n.getDate()-1); return n; });
  const handleNext     = () => setDate(d=>{ const n=new Date(d); n.setDate(n.getDate()+1); return n; });
  const handlePickWeek = day => setDate(day);

  // Save manual or scanned entry
  const handleSaveManual = entry => {
    setLogs(l => [
      { time: new Date().toLocaleTimeString(), mealType: entry.mealType, ...entry },
      ...l
    ]);
    setManualMeal(null);
  };

  // Remove by index within mealType
  const handleRemove = (mealType, idx) => {
    setLogs(l => {
      let count = 0;
      return l.filter(entry => {
        if (entry.mealType !== mealType) return true;
        if (count === idx) { count++; return false; }
        count++; return true;
      });
    });
  };

  const handleSaveGoals = newGoals => { setGoals(newGoals); setShowSettings(false); };

  const handleRecord = key => { const v=prompt(`Enter ${key}:`); if (v!=null) setHealthData(h=>({...h,[key]:Number(v)})); };
  const handleClear  = key => setHealthData(h=>({...h,[key]:null}));

  const handleDetected = async code => {
    try {
      const res  = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const json = await res.json();
      if (json.status===1) {
        setScannedItem({
          product:    json.product,
          nutriments: json.product.nutriments,
          mealType:   scanningMeal
        });
      } else alert('Product not found');
    } catch(err) { console.error(err); alert('Fetch error'); }
  };

  // Computed totals & buckets by mealType
  const totals = logs.reduce((a,e)=>( {
    kcal: a.kcal + e.kcal,
    protein: a.protein + e.protein,
    carbs: a.carbs + e.carbs,
    fat: a.fat + e.fat
  }), { kcal:0, protein:0, carbs:0, fat:0 });

  const mealBuckets = {
    breakfast: logs.filter(e => e.mealType === 'breakfast'),
    lunch:     logs.filter(e => e.mealType === 'lunch'),
    dinner:    logs.filter(e => e.mealType === 'dinner'),
    snacks:    logs.filter(e => e.mealType === 'snacks')
  };

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

      <CalendarNav date={date} onPrev={handlePrev} onNext={handleNext} onPickWeek={handlePickWeek} />

      {/* Meal sections with remove support */}
      {['breakfast','lunch','dinner','snacks'].map(meal => (
        <MealsSection
          key={meal}
          title={meal}
          entries={mealBuckets[meal]}
          onAdd={()=>setChoiceMeal(meal)}
          onRemove={idx=>handleRemove(meal, idx)}
        />
      ))}

      {/* Type‐or‐Scan chooser */}
      {choiceMeal && (
        <div className="choice-backdrop">
          <div className="choice-modal">
            <h2>Add {choiceMeal}</h2>
            <button className="choice-btn" onClick={()=>{ setManualMeal(choiceMeal); setChoiceMeal(null); }}>Type It</button>
            <button className="choice-btn" onClick={()=>{ setScanningMeal(choiceMeal); setChoiceMeal(null); }}>Scan It</button>
            <button className="choice-cancel" onClick={()=>setChoiceMeal(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Scanner view */}
      {scanningMeal && !scannedItem && (
        <div className="scanner-modal">
          <WebScanner onDetected={handleDetected} onError={e=>console.error(e)} />
          <button className="close-btn" onClick={()=>setScanningMeal(null)}>Cancel</button>
        </div>
      )}

      {/* NutritionModal */}
      {scannedItem && (
        <NutritionModal
          product={scannedItem.product}
          nutriments={scannedItem.nutriments}
          onAdd={entry=>{
            handleSaveManual({ mealType: scannedItem.mealType, ...entry });
            setScannedItem(null);
            setScanningMeal(null);
          }}
          onClose={()=>{ setScannedItem(null); setScanningMeal(null); }}
        />
      )}

      {/* Manual entry modal */}
      {manualMeal && (
        <ManualEntryForm
          mealType={manualMeal}
          onSave={handleSaveManual}
          onClose={()=>setManualMeal(null)}
        />
      )}

      {/* Progress bars */}
      {(goals.kcal||goals.protein||goals.carbs||goals.fat)>0 && (
        <div className="progress-bars">
          {['kcal','protein','carbs','fat'].map(f=>{
            const done = totals[f]; const tgt = goals[f]; const pct = tgt>0?Math.min(100,Math.round(done/tgt*100)):0;
            return (
              <div key={f} className="progress-row">
                <label>{f.toUpperCase()}: {done}/{tgt}</label>
                <progress value={done} max={tgt||1} />
                <span>{pct}%</span>
              </div>
            );
          })}
        </div>
      )}

      <Favorites data={[
        { label:'Calories', value:totals.kcal, goal:goals.kcal, unit:'kcal' },
        { label:'Protein',  value:totals.protein, goal:goals.protein, unit:'g'   },
        { label:'Carbs',    value:totals.carbs, goal:goals.carbs, unit:'g'    },
        { label:'Fat',      value:totals.fat,   goal:goals.fat,   unit:'g'    }
      ]} />

      <HealthSection data={healthData} onRecord={handleRecord} onClear={handleClear} />
    </div>
  );
}
