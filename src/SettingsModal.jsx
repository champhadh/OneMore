// src/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, initialGoals, onSave, onClose }) {
  const [localGoals, setLocalGoals] = useState(initialGoals);

  useEffect(() => { if (initialGoals) setLocalGoals(initialGoals); }, [initialGoals]);

  if (!isOpen) return null;
  return (
    <div className="settings-backdrop" onClick={onClose}>
      <div className="settings-modal" onClick={e=>e.stopPropagation()}>
        <h2>⚙️ Daily Goals</h2>
        {['kcal','protein','carbs','fat','water','steps'].map(key=>(
          <div key={key} className="input-row">
            <label>{key.charAt(0).toUpperCase()+key.slice(1)}:</label>
            <input
              type="number"
              value={localGoals[key]||0}
              onChange={e=>setLocalGoals(g=>({...g,[key]:parseInt(e.target.value,10)||0}))}
            />
          </div>
        ))}
        <div className="buttons">
          <button onClick={()=>{onSave(localGoals);onClose();}}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
