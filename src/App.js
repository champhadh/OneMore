// src/App.js
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

export default function App() {
  const [user, setUser] = useState(
    localStorage.getItem('onemore-current-user')
  );

  const handleLogin = username => {
    localStorage.setItem('onemore-current-user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('onemore-current-user');
    setUser(null);
  };

  return !user
    ? <LoginForm onLogin={handleLogin} />
    : <Dashboard currentUser={user} onLogout={handleLogout} />;
}
