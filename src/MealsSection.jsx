// src/MealsSection.jsx
import React from 'react';
import './MealsSection.css';

export default function MealsSection({ title, entries, onAdd }) {
  const total = entries.reduce((sum,e)=>sum+e.kcal,0);
  return (
    <section className="meals-section">
      <div className="section-header">
        <h3>{title.toUpperCase()}: {total}</h3>
        <button className="add-btn" onClick={onAdd}>Add {title}</button>
      </div>
      <ul className="meal-list">
        {entries.map((e,i)=>(
          <li key={i} className="meal-entry">
            <div className="meal-info">
              <strong>{e.name}</strong>
            </div>
            <span className="meal-kcal">{e.kcal}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
