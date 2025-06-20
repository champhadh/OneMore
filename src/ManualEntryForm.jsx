// src/ManualEntryForm.jsx
import React, { useState, useEffect } from 'react';
import './ManualEntryForm.css';

export default function ManualEntryForm({ mealType, onSave, onClose, initialValues, error }) {
  const [name, setName]       = useState(initialValues?.name || '');
  const [kcal, setKcal]       = useState(initialValues?.kcal || '');
  const [protein, setProtein] = useState(initialValues?.protein || '');
  const [carbs, setCarbs]     = useState(initialValues?.carbs || '');
  const [fat, setFat]         = useState(initialValues?.fat || '');

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setKcal(initialValues.kcal || '');
      setProtein(initialValues.protein || '');
      setCarbs(initialValues.carbs || '');
      setFat(initialValues.fat || '');
    }
  }, [initialValues]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ mealType, name, kcal:Number(kcal), protein:Number(protein),
             carbs:Number(carbs), fat:Number(fat) });
  };

  return (
    <div className="manual-entry-backdrop">
      <form className="manual-entry-form" onSubmit={handleSubmit}>
        <h2>Add {mealType}</h2>
        {error && <div className="error" style={{marginBottom:8}}>{error}</div>}
        <label>Name<input type="text" value={name} onChange={e=>setName(e.target.value)} required/></label>
        <label>Calories<input type="number" value={kcal} onChange={e=>setKcal(e.target.value)} required/></label>
        <label>Protein<input type="number" value={protein} onChange={e=>setProtein(e.target.value)} required/></label>
        <label>Carbs<input type="number" value={carbs} onChange={e=>setCarbs(e.target.value)} required/></label>
        <label>Fat<input type="number" value={fat} onChange={e=>setFat(e.target.value)} required/></label>
        <div className="buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
