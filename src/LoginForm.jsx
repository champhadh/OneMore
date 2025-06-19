// src/LoginForm.jsx
import React, { useState } from 'react';
import './App.css';

export default function LoginForm({ onLogin }) {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('onemore-users') || '{}');

    if (isRegister) {
      if (users[username]) {
        setError('User already exists');
      } else {
        users[username] = password;
        localStorage.setItem('onemore-users', JSON.stringify(users));
        localStorage.setItem('onemore-current-user', username);
        onLogin(username);
      }
    } else {
      if (users[username] === password) {
        localStorage.setItem('onemore-current-user', username);
        onLogin(username);
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>OneMore</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error">{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p className="toggle-auth">
        {isRegister ? 'Have an account?' : "Don't have an account?"}{' '}
        <button
          className="link-button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}
