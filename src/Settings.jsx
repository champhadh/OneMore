// src/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import { useTheme } from './ThemeContext';

const sections = [
  {
    title: 'Insights',
    items: [
      { icon: '📱', label: 'Steps' },
      { icon: '🎽', label: 'Strength Goals' },
      { icon: '🎽', label: 'Calorie + Weight Goals' },
    ],
  },
  {
    title: 'Personalization',
    items: [
      { icon: '🎨', label: 'Themes' },
      { icon: '🔔', label: 'Notifications' },
      { icon: '🗓️', label: 'Meal Reminders' },
      { icon: '⏱️', label: 'Rest Timers' },
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

// Placeholder data for profile and program
const profile = {
  username: 'hadywehbi',
  membership: 'Premium Member',
  streak: 0,
  achievements: 10,
};

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  // Profile modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    username: profile.username,
    email: '',
    phone: '',
    gender: '',
    password: '',
    picture: null,
    pictureUrl: '',
  });
  const [error, setError] = useState('');

  // --- Program Bar Chart: Real Data ---
  const [weekCals, setWeekCals] = useState([0,0,0,0,0,0,0]);
  
  // --- State for all features ---
  const [weightGoal, setWeightGoal] = useState({ value: '', unit: 'kg' });
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [macros, setMacros] = useState({ calories: '', protein: '', carbs: '', fat: '' });
  const [isMacroModalOpen, setIsMacroModalOpen] = useState(false);
  const [stepsGoal, setStepsGoal] = useState('');
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Get logs for current user
    const user = localStorage.getItem('onemore-current-user');
    const LOG_KEY = `onemore-logs-${user}`;
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    
    // Get start of this week (Monday)
    const now = new Date();
    const week = [];
    const start = new Date(now);
    start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    for (let i=0; i<7; ++i) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d.toISOString().slice(0,10));
    }
    // Sum kcal for each day
    const cals = week.map(day => logs.filter(e => (e.date||"") === day).reduce((a,e)=>a+e.kcal,0));
    setWeekCals(cals);

    // Calculate Streak
    if (logs.length > 0) {
      const logDates = [...new Set(logs.map(l => l.date))].sort().reverse();
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      today.setDate(today.getDate() - 1);
      const yesterdayStr = today.toISOString().slice(0, 10);

      let currentStreak = 0;
      if (logDates[0] === todayStr || logDates[0] === yesterdayStr) {
          currentStreak = 1;
          for (let i = 0; i < logDates.length - 1; i++) {
              const current = new Date(logDates[i]);
              const next = new Date(logDates[i+1]);
              const diff = current.getTime() - next.getTime();
              if (Math.round(diff / (1000 * 60 * 60 * 24)) === 1) {
                  currentStreak++;
              } else {
                  break;
              }
          }
      }
      setStreak(currentStreak);
    }
  }, []);

  // Load goals from localStorage
  useEffect(() => {
    const savedWeight = JSON.parse(localStorage.getItem('onemore-weight-goal') || '{}');
    if (savedWeight.value) setWeightGoal(savedWeight);

    const savedMacros = JSON.parse(localStorage.getItem('onemore-macros-goal') || '{}');
    if (savedMacros.protein) setMacros(savedMacros);

    const savedSteps = localStorage.getItem('onemore-steps-goal');
    if (savedSteps) setStepsGoal(savedSteps);
  }, []);

  // Load profile from localStorage
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('onemore-profile') || '{}');
    if (saved.username) setForm(f => ({ ...f, ...saved }));
  }, []);

  // Handle form changes
  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => setForm(f => ({ ...f, picture: file, pictureUrl: ev.target.result }));
        reader.readAsDataURL(file);
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Save handlers
  const handleSave = e => {
    e.preventDefault();
    if (!form.username || !form.email || !form.gender) return setError('All fields except phone/password required');
    setError('');
    localStorage.setItem('onemore-profile', JSON.stringify(form));
    setModalOpen(false);
  };

  const handleSaveWeightGoal = e => {
    e.preventDefault();
    if (!weightGoal.value) return;
    localStorage.setItem('onemore-weight-goal', JSON.stringify(weightGoal));
    setIsWeightModalOpen(false);
  };

  const handleSaveMacros = e => {
    e.preventDefault();
    localStorage.setItem('onemore-macros-goal', JSON.stringify(macros));
    setIsMacroModalOpen(false);
  };
  
  const handleSaveSteps = e => {
    e.preventDefault();
    if (!stepsGoal) return;
    localStorage.setItem('onemore-steps-goal', stepsGoal);
    setIsStepsModalOpen(false);
  };
  
  const features = [
    { icon: '⚖️', label: 'Weight Goal', value: weightGoal.value ? `${weightGoal.value} ${weightGoal.unit}` : 'Set your goal', arrow: true, onClick: () => setIsWeightModalOpen(true) },
    { icon: '🥗', label: 'Macro Intake Goal', value: macros.calories ? `${macros.calories}cal / ${macros.protein}p/${macros.carbs}c/${macros.fat}f` : 'Set macros', arrow: true, onClick: () => setIsMacroModalOpen(true) },
    { icon: '👣', label: 'Steps', value: stepsGoal ? `${stepsGoal} steps` : 'Track steps', arrow: true, onClick: () => setIsStepsModalOpen(true) },
    { icon: '🔥', label: 'Streak', value: `${streak} days`, arrow: false },
    { icon: '🎨', label: 'Theme', value: theme === 'dark' ? 'Dark' : 'Light', arrow: true, onClick: toggleTheme },
    { icon: '🚪', label: 'Logout', value: '', arrow: false, logout: true },
  ];

  return (
    <div className="settings-page">
      <button
        className="settings-page__back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-avatar">
            {form.pictureUrl ? (
              <img src={form.pictureUrl} alt="avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
            ) : (
              <span role="img" aria-label="avatar">👤</span>
            )}
          </div>
          <div>
            <div className="profile-username">{form.username}</div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-btn" onClick={()=>setModalOpen(true)}>Edit Profile</button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <form className="modal profile-modal" onSubmit={handleSave}>
            <h2>Edit Profile</h2>
            {error && <div className="error" style={{marginBottom:8}}>{error}</div>}
            <label>Profile Picture
              <input type="file" name="picture" accept="image/*" onChange={handleChange} />
            </label>
            {form.pictureUrl && <img src={form.pictureUrl} alt="preview" style={{width:64, height:64, borderRadius:'50%', margin:'0.5rem 0'}} />}
            <label>Name
              <input type="text" name="username" value={form.username} onChange={handleChange} required />
            </label>
            <label>Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>Phone (optional)
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>Password
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </label>
            <label>Gender
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={()=>setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Program Bar Chart */}
      <div className="program-card">
        <div className="program-title">Program</div>
        <div className="program-bars">
          {weekCals.map((val, i) => (
            <div key={i} className="program-bar-wrap">
              <div className="program-bar" style={{height: `${Math.max(20, val/10)}px`}}></div>
              <div className="program-day">{['M','Tu','W','Th','F','Sa','Su'][i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Rows */}
      <div className="features-card">
        {features.map(f => (
          <div
            className={`feature-row${f.logout ? ' logout-row' : ''}`}
            key={f.label}
            onClick={f.logout ? () => { localStorage.removeItem('onemore-current-user'); window.location.reload(); } : f.onClick}
            style={f.logout ? { cursor: 'pointer', color: '#ff5040' } : {}}
          >
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-label">{f.label}</span>
            <span className="feature-value">{f.value}</span>
            {f.arrow && <span className="feature-arrow">›</span>}
          </div>
        ))}
      </div>
      
      {/* Modals for Features */}
      {isWeightModalOpen && (
        <div className="modal-overlay">
          <form className="modal profile-modal" onSubmit={handleSaveWeightGoal}>
            <h2>Set Weight Goal</h2>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              <label style={{flex: 1}}>Weight Goal
                <input type="number" min="1" value={weightGoal.value} onChange={e => setWeightGoal(g => ({...g, value: e.target.value}))} required />
              </label>
              <label>Unit
                <select value={weightGoal.unit} onChange={e => setWeightGoal(g => ({...g, unit: e.target.value}))}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </label>
            </div>
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={()=>setIsWeightModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isMacroModalOpen && (
        <div className="modal-overlay">
          <form className="modal profile-modal" onSubmit={handleSaveMacros}>
            <h2>Set Macro Goals</h2>
            <label>Calories
              <input type="number" min="0" value={macros.calories} onChange={e => setMacros(m => ({...m, calories: e.target.value}))} required />
            </label>
            <label>Protein (g)
              <input type="number" min="0" value={macros.protein} onChange={e => setMacros(m => ({...m, protein: e.target.value}))} required />
            </label>
            <label>Carbs (g)
              <input type="number" min="0" value={macros.carbs} onChange={e => setMacros(m => ({...m, carbs: e.target.value}))} required />
            </label>
            <label>Fat (g)
              <input type="number" min="0" value={macros.fat} onChange={e => setMacros(m => ({...m, fat: e.target.value}))} required />
            </label>
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={()=>setIsMacroModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isStepsModalOpen && (
        <div className="modal-overlay">
          <form className="modal profile-modal" onSubmit={handleSaveSteps}>
            <h2>Set Steps Goal</h2>
            <label>Daily Steps
              <input type="number" min="1" value={stepsGoal} onChange={e => setStepsGoal(e.target.value)} required />
            </label>
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={()=>setIsStepsModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
