import React from "react";
import "./MealsSection.css";

export default function MealsSection({ title, entries, onAdd }) {
  const total = entries.reduce((sum, e) => sum + e.kcal, 0);

  return (
    <section className="meals-section">
      <div className="meals-header">
        <h2>{title.toUpperCase()}: {total}</h2>
        <button className="add-btn" onClick={onAdd}>
          Add {title.charAt(0).toUpperCase() + title.slice(1)}
        </button>
      </div>
      {entries.map((e,i) => (
        <div key={i} className="meal-entry">
          <span>{e.time}</span>
          <span>{e.name}</span>
          <span>{e.kcal} kcal</span>
        </div>
      ))}
    </section>
  );
}
