import React, { useState } from 'react';

export default function ManualEntryForm({ code, onSave, onCancel }) {
  const [name,    setName]    = useState('');
  const [kcal,    setKcal]    = useState('');
  const [protein, setProtein] = useState('');
  const [carbs,   setCarbs]   = useState('');
  const [fat,     setFat]     = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSave(code, {
      name,
      kcal:    parseFloat(kcal)    || 0,
      protein: parseFloat(protein) || 0,
      carbs:   parseFloat(carbs)   || 0,
      fat:     parseFloat(fat)     || 0,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255,255,255,0.2)',
        padding: '1rem',
        borderRadius: '8px',
        margin: '1rem',
        textAlign: 'center',
      }}
    >
      <h3>Define Product for "{code}"</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ margin: '0.4rem', padding: '0.4rem', width: '200px' }}
      />
      <div>
        <input
          placeholder="Kcal"
          type="number"
          value={kcal}
          onChange={e => setKcal(e.target.value)}
          required
          style={{ margin: '0.4rem', padding: '0.4rem', width: '80px' }}
        />
        <input
          placeholder="Protein"
          type="number"
          value={protein}
          onChange={e => setProtein(e.target.value)}
          style={{ margin: '0.4rem', padding: '0.4rem', width: '80px' }}
        />
        <input
          placeholder="Carbs"
          type="number"
          value={carbs}
          onChange={e => setCarbs(e.target.value)}
          style={{ margin: '0.4rem', padding: '0.4rem', width: '80px' }}
        />
        <input
          placeholder="Fat"
          type="number"
          value={fat}
          onChange={e => setFat(e.target.value)}
          style={{ margin: '0.4rem', padding: '0.4rem', width: '80px' }}
        />
      </div>
      <button type="submit" style={{ margin: '0.5rem' }}>💾 Save</button>
      <button type="button" onClick={onCancel} style={{ margin: '0.5rem' }}>
        ❌ Cancel
      </button>
    </form>
  );
}
