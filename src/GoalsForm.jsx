import React, { useState } from 'react';
import './App.css';

export default function GoalsForm({ initialGoals, onSave }) {
  const [goals, setGoals] = useState(initialGoals);

  const handleChange = field => e => {
    setGoals({ ...goals, [field]: parseInt(e.target.value, 10) || 0 });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(goals);
  };

  return (
    <form className="goals-form" onSubmit={handleSubmit}>
      <h2>Set Daily Targets</h2>
      {['kcal','protein','carbs','fat'].map(field => (
        <label key={field}>
          {field.toUpperCase()}:
          <input
            type="number"
            min="0"
            value={goals[field]}
            onChange={handleChange(field)}
          />
        </label>
      ))}
      <button type="submit">Save Goals</button>
    </form>
  );
}
