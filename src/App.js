// src/App.js
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import Settings from './Settings';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <Route path="*" element={<LoginForm onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard currentUser={user} onLogout={handleLogout} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
