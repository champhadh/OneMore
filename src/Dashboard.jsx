// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import CalendarNav from './CalendarNav';
import MealsSection from './MealsSection';
import ManualEntryForm from './ManualEntryForm';
import NutritionModal from './NutritionModal';
import HealthSection from './HealthSection';
import WebScanner from './WebScanner';
import Favorites from './Favorites';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const LOG_KEY   = `onemore-logs-${currentUser}`;
  const MACROS_GOAL_KEY = 'onemore-macros-goal';

  // State
  const [date, setDate]                 = useState(new Date());
  const [goals, setGoals]               = useState({ kcal:0, protein:0, carbs:0, fat:0 });
  const [logs, setLogs]                 = useState([]);
  const [choiceMeal, setChoiceMeal]     = useState(null);
  const [manualMeal, setManualMeal]     = useState(null);
  const [scanningMeal, setScanningMeal] = useState(null);
  const [scannedItem, setScannedItem]   = useState(null);
  const [healthData, setHealthData]     = useState({ water:null, bodyFat:null, steps:null, sleep:null, glucose:null, bp:null });
  const [scanError, setScanError] = useState("");
  const [scanLock, setScanLock] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editingMealType, setEditingMealType] = useState(null);
  const [formError, setFormError] = useState("");
  const [editingHealthKey, setEditingHealthKey] = useState(null);
  const [editingHealthValue, setEditingHealthValue] = useState("");
  const [healthFormError, setHealthFormError] = useState("");

  // Load / Persist
  useEffect(() => {
    const l = JSON.parse(localStorage.getItem(LOG_KEY));  if (l) setLogs(l);

    // Load macro goals from settings
    const savedMacros = JSON.parse(localStorage.getItem(MACROS_GOAL_KEY) || '{}');
    if (savedMacros.calories) {
      setGoals({
        kcal: Number(savedMacros.calories) || 0,
        protein: Number(savedMacros.protein) || 0,
        carbs: Number(savedMacros.carbs) || 0,
        fat: Number(savedMacros.fat) || 0,
      });
    }
  }, [LOG_KEY]);

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }, [logs, LOG_KEY]);

  // Handlers
  const handlePrev     = () => setDate(d=>{ const n=new Date(d); n.setDate(n.getDate()-1); return n; });
  const handleNext     = () => setDate(d=>{ const n=new Date(d); n.setDate(n.getDate()+1); return n; });
  const handlePickWeek = day => setDate(day);

  // Save manual or scanned entry
  const handleSaveManual = entry => {
    // Validation
    if (!entry.name || entry.name.trim() === "") {
      setFormError("Name is required");
      return;
    }
    if ([entry.kcal, entry.protein, entry.carbs, entry.fat].some(v => isNaN(v) || v === null || v === "")) {
      setFormError("All macros must be numbers");
      return;
    }
    setFormError("");
    const todayStr = date.toISOString().slice(0,10); // YYYY-MM-DD
    if (editingEntry !== null && editingMealType) {
      setLogs(l => l.map((e, idx) => (e.mealType === editingMealType && idx === editingEntry ? { ...e, ...entry, date: todayStr } : e)));
      setEditingEntry(null);
      setEditingMealType(null);
    } else {
      setLogs(l => [
        { time: new Date().toLocaleTimeString(), mealType: entry.mealType, ...entry, date: todayStr },
        ...l
      ]);
    }
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

  const handleRecord = (key, value) => {
    if (typeof value === "number") {
      setHealthData(h => ({ ...h, [key]: value }));
      return;
    }
    setEditingHealthKey(key);
    setEditingHealthValue(healthData[key] !== null ? healthData[key] : "");
    setHealthFormError("");
  };

  const handleHealthSave = () => {
    if (editingHealthValue === "" || isNaN(editingHealthValue)) {
      setHealthFormError("Please enter a valid number");
      return;
    }
    setHealthData(h => ({ ...h, [editingHealthKey]: Number(editingHealthValue) }));
    setEditingHealthKey(null);
    setEditingHealthValue("");
    setHealthFormError("");
  };

  const handleClear = key => setHealthData(h=>({...h,[key]:null}));

  const handleDetected = async code => {
    if (scanLock) return;
    setScanLock(true);
    setScanError("");
    try {
      const res  = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const json = await res.json();
      if (json.status===1) {
        setScannedItem({
          product:    json.product,
          nutriments: json.product.nutriments,
          mealType:   scanningMeal
        });
      } else {
        setScanError("Product not found");
        setScanLock(false);
      }
    } catch(err) {
      console.error(err);
      setScanError("Fetch error");
      setScanLock(false);
    }
  };

  // Filter logs by selected date
  const dateStr = date.toISOString().slice(0,10);
  const logsForDate = logs.filter(e => (e.date || "") === dateStr);

  // Computed totals & buckets by mealType
  const totals = logsForDate.reduce((a,e)=>( {
    kcal: a.kcal + e.kcal,
    protein: a.protein + e.protein,
    carbs: a.carbs + e.carbs,
    fat: a.fat + e.fat
  }), { kcal:0, protein:0, carbs:0, fat:0 });

  const mealBuckets = {
    breakfast: logsForDate.filter(e => e.mealType === 'breakfast'),
    lunch:     logsForDate.filter(e => e.mealType === 'lunch'),
    dinner:    logsForDate.filter(e => e.mealType === 'dinner'),
    snacks:    logsForDate.filter(e => e.mealType === 'snacks')
  };

  return (
    <div className="dashboard">
      <header className="app-header">
        <h1>OneMore</h1>
        <div>
          <button className="settings-btn" onClick={()=>navigate('/settings')}>⚙️</button>
          <button className="logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <CalendarNav
        selectedDate={date}
        onDateChange={setDate}
      />

      {/* Meal sections with remove support */}
      {['breakfast','lunch','dinner','snacks'].map(meal => (
        <MealsSection
          key={meal}
          title={meal}
          entries={mealBuckets[meal]}
          onAdd={()=>setChoiceMeal(meal)}
          onEdit={idx => {
            setEditingEntry(idx);
            setEditingMealType(meal);
            setManualMeal(meal);
          }}
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
          <WebScanner onDetected={handleDetected} onError={e=>setScanError(e.message || "Scanner error")}/>
          {scanError && <div className="error" style={{marginTop:8}}>{scanError}</div>}
          <button className="close-btn" onClick={()=>{
            setScanningMeal(null);
            setScanError("");
            setScanLock(false);
          }}>Cancel</button>
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
            setScanError("");
            setScanLock(false);
          }}
          onClose={()=>{
            setScannedItem(null);
            setScanningMeal(null);
            setScanError("");
            setScanLock(false);
          }}
        />
      )}

      {/* Manual entry modal */}
      {manualMeal && (
        <ManualEntryForm
          mealType={manualMeal}
          onSave={handleSaveManual}
          onClose={()=>{ setManualMeal(null); setEditingEntry(null); setEditingMealType(null); setFormError(""); }}
          initialValues={editingEntry !== null && editingMealType ? mealBuckets[editingMealType][editingEntry] : null}
          error={formError}
        />
      )}

      {/* Progress bars - REMOVED */}

      <Favorites data={[
        { label:'Calories', value:totals.kcal, goal:goals.kcal, unit:'kcal' },
        { label:'Protein',  value:totals.protein, goal:goals.protein, unit:'g'   },
        { label:'Carbs',    value:totals.carbs, goal:goals.carbs, unit:'g'    },
        { label:'Fat',      value:totals.fat,   goal:goals.fat,   unit:'g'    }
      ]} />

      <HealthSection data={healthData} onRecord={handleRecord} onClear={handleClear} />

      {editingHealthKey && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit {editingHealthKey.toUpperCase()}</h3>
            {healthFormError && <div className="error" style={{marginBottom:8}}>{healthFormError}</div>}
            <input
              type="number"
              value={editingHealthValue}
              onChange={e => setEditingHealthValue(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button onClick={handleHealthSave}>Save</button>
              <button onClick={() => { setEditingHealthKey(null); setEditingHealthValue(""); setHealthFormError(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
