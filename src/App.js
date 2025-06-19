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

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }
  return <Dashboard currentUser={user} onLogout={handleLogout} />;
}
