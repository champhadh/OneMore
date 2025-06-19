import React, { useState } from 'react';
import './ManualEntryForm.css';

export default function ManualEntryForm({ mealType, onSave, onClose }) {
  const [name, setName]       = useState('');
  const [kcal, setKcal]       = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs]     = useState('');
  const [fat, setFat]         = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      mealType,
      name,
      kcal:    Number(kcal),
      protein: Number(protein),
      carbs:   Number(carbs),
      fat:     Number(fat),
    });
  };

  return (
    <div className="manual-entry-backdrop">
      <form className="manual-entry-form" onSubmit={handleSubmit}>
        <h2>Add {mealType}</h2>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Calories
          <input
            type="number"
            value={kcal}
            onChange={e => setKcal(e.target.value)}
            required
          />
        </label>
        <label>
          Protein (g)
          <input
            type="number"
            value={protein}
            onChange={e => setProtein(e.target.value)}
            required
          />
        </label>
        <label>
          Carbs (g)
          <input
            type="number"
            value={carbs}
            onChange={e => setCarbs(e.target.value)}
            required
          />
        </label>
        <label>
          Fat (g)
          <input
            type="number"
            value={fat}
            onChange={e => setFat(e.target.value)}
            required
          />
        </label>
        <div className="buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
