// src/Dashboard.jsx
import React, { useState } from 'react';
import ManualEntryForm from './ManualEntryForm';
import './Dashboard.css';

export default function Dashboard() {
  // per‐meal calorie totals
  const [breakfastTotal, setBreakfastTotal] = useState(0);
  const [lunchTotal,    setLunchTotal]    = useState(0);
  const [dinnerTotal,   setDinnerTotal]   = useState(0);
  const [snacksTotal,   setSnacksTotal]   = useState(0);

  // which meal form is open (if any)
  const [currentMeal, setCurrentMeal] = useState(null);
  const [showForm,     setShowForm]    = useState(false);

  // open manual‐entry form for a meal
  const openForm = (mealType) => {
    setCurrentMeal(mealType);
    setShowForm(true);
  };

  // handle saving a new entry from the form
  const handleSave = ({ mealType, calories }) => {
    switch (mealType) {
      case 'breakfast':
        setBreakfastTotal((b) => b + calories);
        break;
      case 'lunch':
        setLunchTotal((l) => l + calories);
        break;
      case 'dinner':
        setDinnerTotal((d) => d + calories);
        break;
      case 'snacks':
        setSnacksTotal((s) => s + calories);
        break;
      default:
        break;
    }
    setShowForm(false);
    setCurrentMeal(null);
  };

  return (
    <div className="dashboard">
      <section className="meal-section">
        <h2>BREAKFAST: {breakfastTotal} kcal</h2>
        <button className="add-btn" onClick={() => openForm('breakfast')}>
          Add Breakfast
        </button>
      </section>

      <section className="meal-section">
        <h2>LUNCH: {lunchTotal} kcal</h2>
        <button className="add-btn" onClick={() => openForm('lunch')}>
          Add Lunch
        </button>
      </section>

      <section className="meal-section">
        <h2>DINNER: {dinnerTotal} kcal</h2>
        <button className="add-btn" onClick={() => openForm('dinner')}>
          Add Dinner
        </button>
      </section>

      <section className="meal-section">
        <h2>SNACKS: {snacksTotal} kcal</h2>
        <button className="add-btn" onClick={() => openForm('snacks')}>
          Add Snacks
        </button>
      </section>

      {showForm && (
        <ManualEntryForm
          mealType={currentMeal}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

