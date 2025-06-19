import React, { useState, useEffect } from "react";
import WebScanner from "./WebScanner";
import ManualEntryForm from "./ManualEntryForm";
import GoalsForm from "./GoalsForm";
import CalendarNav from "./CalendarNav";
import Favorites from "./Favorites";
import MealsSection from "./MealsSection";
import HealthSection from "./HealthSection";
import SettingsModal from "./SettingsModal";
import "./Dashboard.css";

export default function Dashboard({ currentUser, onLogout }) {
  // —–––––––––––– State & Storage Keys –––––––––––—
  const LOG_KEY   = `onemore-logs-${currentUser}`;
  const GOALS_KEY = `onemore-goals-${currentUser}`;

  // daily goals
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(GOALS_KEY);
    return saved
      ? JSON.parse(saved)
      : { kcal: 2000, protein: 75, carbs: 250, fat: 70, water: 2000, steps: 10000 };
  });
  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  // logs
  const [logs, setLogs] = useState(() => {
    const s = localStorage.getItem(LOG_KEY);
    return s ? JSON.parse(s) : [];
  });
  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }, [logs]);

  // for manual‐entry form
  const [manualMeal, setManualMeal] = useState(null);

  // settings modal
  const [showSettings, setShowSettings] = useState(false);

  // aggregate totals
  const totals = logs.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const mealBuckets = {
    breakfast: logs.slice(0, 3),
    lunch: logs.slice(3, 6),
    dinner: logs.slice(6, 9),
    snacks: logs.slice(9),
  };

  // ─── Health data ───────────────────────────────────────────────────
  const [healthData, setHealthData] = useState({
    water: null,
    bodyFat: null,
    steps: null,
    sleep: null,
    glucose: null,
    bp: null,
  });

  const handleRecordHealth = key => {
    const val = prompt(`Enter your ${key} for today:`);
    if (val !== null && !isNaN(Number(val))) {
      setHealthData(h => ({ ...h, [key]: Number(val) }));
    }
  };
  const handleClearHealth = key => {
    setHealthData(h => ({ ...h, [key]: null }));
  };

  // ─── Manual Entry Save ─────────────────────────────────────────────
  const handleSaveManual = ({ mealType, calories, protein, carbs, fat }) => {
    const entry = {
      time: new Date().toLocaleTimeString(),
      name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
      kcal: calories,
      protein,
      carbs,
      fat,
    };
    setLogs([entry, ...logs]);
    setManualMeal(null);
  };

  return (
    <div className="dashboard">
      <header className="app-header">
        <h1>OneMore</h1>
        <div>
          <button className="header-btn" onClick={() => setShowSettings(true)}>
            ⚙️
          </button>
          <button className="header-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <SettingsModal
        isOpen={showSettings}
        initialGoals={goals}
        onSave={setGoals}
        onClose={() => setShowSettings(false)}
      />

      <CalendarNav /* … */ />

      <GoalsForm initialGoals={goals} onSave={setGoals} />

      <div className="progress-bars">
        {["kcal", "protein", "carbs", "fat"].map(f => {
          const done = totals[f], tgt = goals[f];
          const pct = Math.min(100, Math.round((done / tgt) * 100));
          return (
            <div key={f} className="progress-row">
              <label>
                {f.toUpperCase()}: {done}/{tgt}
              </label>
              <progress value={done} max={tgt} />
              <span>{pct}%</span>
            </div>
          );
        })}
      </div>

      <Favorites
        data={[
          { label: "Cals", value: totals.kcal, goal: goals.kcal, unit: "cals", color: "#CC8B65" },
          { label: "Prot", value: totals.protein, goal: goals.protein, unit: "g", color: "#013328" },
          { label: "Carb", value: totals.carbs, goal: goals.carbs, unit: "g", color: "#4F3E34" },
          { label: "Fat", value: totals.fat, goal: goals.fat, unit: "g", color: "#30312F" },
        ]}
      />

      {["breakfast", "lunch", "dinner", "snacks"].map(meal => (
        <MealsSection
          key={meal}
          title={meal}
          entries={mealBuckets[meal]}
          onAdd={() => setManualMeal(meal)}
        />
      ))}

      {manualMeal && (
        <ManualEntryForm
          mealType={manualMeal}
          onSave={handleSaveManual}
          onClose={() => setManualMeal(null)}
        />
      )}

      <HealthSection
        data={healthData}
        onRecord={handleRecordHealth}
        onClear={handleClearHealth}
      />

      <div className="scanner">{/* … your WebScanner / results … */}</div>
    </div>
  );
}
