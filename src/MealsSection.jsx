import React from 'react';
import './MealsSection.css';

export default function MealsSection({ title, entries, onAdd }) {
  const total = entries.reduce((sum, e) => sum + e.kcal, 0);
  return (
    <section className="meals-section">
      <div className="section-header">
        <h3>{title.toUpperCase()}: {total}</h3>
        <button onClick={onAdd}>Add {title}</button>
      </div>
      <ul className="meal-list">
        {entries.map((e,i) => (
          <li key={i} className="meal-entry">
            <div className="meal-info">
              <strong>{e.name}</strong>
              <small>{e.qty} {e.unit}</small>
            </div>
            <span className="meal-kcal">{e.kcal}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
