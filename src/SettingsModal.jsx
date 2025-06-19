import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, initialGoals, onSave, onClose }) {
  const [localGoals, setLocalGoals] = useState({
    kcal: 2000,
    protein: 75,
    carbs: 250,
    fat: 70,
    water: 2000,
    steps: 10000,
  });

  // When opening, seed the modal with existing goals
  useEffect(() => {
    if (initialGoals) {
      setLocalGoals(initialGoals);
    }
  }, [initialGoals]);

  const handleChange = (field, value) => {
    setLocalGoals(prev => ({ ...prev, [field]: parseInt(value, 10) || 0 }));
  };

  const handleSave = () => {
    onSave(localGoals);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="settings-backdrop" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <h2>⚙️ Daily Goals</h2>
        {['kcal', 'protein', 'carbs', 'fat', 'water', 'steps'].map(key => (
          <div key={key} className="input-row">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="number"
              value={localGoals[key]}
              onChange={e => handleChange(key, e.target.value)}
            />
          </div>
        ))}
        <div className="buttons">
          <button onClick={handleSave}>✅ Save</button>
          <button onClick={onClose}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
}
