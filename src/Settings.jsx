import React from 'react';
import './Settings.css';

const sections = [
  {
    title: 'Automatic Tracking',
    items: [
      { icon: '🍎', label: 'Apple Health' },
      { icon: '⌚️', label: 'Apple Watch' },
      { icon: '📱', label: 'Steps from iPhone' },
      { icon: '🎽', label: 'Fitbit' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { icon: '🔄', label: 'Patterns' },
      { icon: '🍽️', label: 'Food' },
      { icon: '💰', label: 'Budget' },
      { icon: '🥗', label: 'Nutrition' },
      { icon: '🍲', label: 'Meals' },
    ],
  },
  {
    title: 'Export Data',
    items: [
      { icon: '✉️', label: 'Manual Email Reports' },
      { icon: '📧', label: 'Scheduled Email Reports' },
    ],
  },
  {
    title: 'Personalize OneMore',
    items: [
      { icon: '🎨', label: 'Themes' },
      { icon: '⚙️', label: 'Meal Settings' },
      { icon: '⏰', label: 'Reminders' },
    ],
  },
  {
    title: 'Foods',
    items: [
      { icon: '📋', label: 'My Foods' },
      { icon: '🍴', label: 'Custom Foods' },
      { icon: '🥘', label: 'Recipes' },
      { icon: '🌐', label: 'Food Database Region' },
    ],
  },
  {
    title: 'Exercises',
    items: [
      { icon: '🏃', label: 'My Exercises' },
      { icon: '🏋️', label: 'Custom Exercises' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { icon: '🔧', label: 'Application Preferences' },
      { icon: '⚖️', label: 'Units' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { icon: '📧', label: 'OneMore Account' },
      { icon: '🏅', label: 'Get Lifetime Premium' },
      { icon: '🔒', label: 'Privacy' },
      { icon: '🔑', label: 'Passcode Lock' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'ℹ️', label: 'About OneMore' },
      { icon: '❓', label: 'Help Center' },
    ],
  },
];

export default function Settings() {
  return (
    <div className="settings-page">
      {sections.map(({ title, items }) => (
        <section key={title} className="section">
          <h2 className="section-title">{title}</h2>
          <div className="item-list">
            {items.map(({ icon, label }) => (
              <div key={label} className="item">
                <div className="icon">{icon}</div>
                <div className="label">{label}</div>
                <div className="arrow">›</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
