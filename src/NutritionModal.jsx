// src/NutritionModal.jsx
import React, { useState, useEffect } from 'react';
import './NutritionModal.css';

export default function NutritionModal({ product, nutriments, onAdd, onClose }) {
  const [amount, setAmount] = useState(1);
  const [macros, setMacros] = useState({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
  const unit = product.serving_size || 'serving';

  // Initialize editable macros from the API data
  useEffect(() => {
    setMacros({
      kcal:    Math.round(nutriments['energy-kcal_100g']    || 0),
      protein: Math.round(nutriments['proteins_100g']      || 0),
      carbs:   Math.round(nutriments['carbohydrates_100g'] || 0),
      fat:     Math.round(nutriments['fat_100g']           || 0),
    });
  }, [nutriments]);

  const handleAdd = () => {
    // Multiply by amount directly (no /100)
    const entry = {
      name:    product.product_name || product.generic_name || 'Unknown',
      kcal:    Math.round(macros.kcal    * amount),
      protein: Math.round(macros.protein * amount),
      carbs:   Math.round(macros.carbs   * amount),
      fat:     Math.round(macros.fat     * amount),
    };
    onAdd(entry);
  };

  const staticFacts = {
    'saturated-fat_100g': 'Sat Fat',
    'cholesterol_100g':   'Cholesterol',
    'sodium_100g':        'Sodium',
    'fiber_100g':         'Fiber',
    'sugars_100g':        'Sugars',
  };

  return (
    <div className="nutrition-backdrop">
      <div className="nutrition-modal">
        <nav className="nutrition-nav">
          <button onClick={onClose} className="nav-btn">Cancel</button>
          <span className="nav-title">Add Food</span>
          <button onClick={handleAdd} className="nav-btn nav-add">Add</button>
        </nav>

        <header className="nutrition-header">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.product_name}
              className="food-img"
            />
          )}
          <div className="food-info">
            <h2>{product.product_name}</h2>
            {product.brands && <p className="brand">{product.brands}</p>}
          </div>
        </header>

        <section className="nutrition-facts">
          {/* Editable Macros */}
          {['kcal','protein','carbs','fat'].map(key => (
            <div key={key} className="fact-row">
              <label className="fact-label" htmlFor={key}>
                {key === 'kcal' ? 'Calories' : key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                id={key}
                type="number"
                className="fact-input"
                value={macros[key]}
                onChange={e => setMacros(m => ({ ...m, [key]: Number(e.target.value) }))}
              />
              <span className="fact-unit">{key === 'kcal' ? 'kcal' : 'g'}</span>
            </div>
          ))}

          {/* Static Nutrition Facts */}
          {Object.entries(nutriments).map(([k,v]) => {
            if (!staticFacts[k]) return null;
            return (
              <div key={k} className="fact-row">
                <span className="fact-label">{staticFacts[k]}</span>
                <span className="fact-value">{v}g</span>
              </div>
            );
          })}
        </section>

        <footer className="nutrition-footer">
          <div className="quantity-picker">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
            />
            <span className="quantity-unit">{unit}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
