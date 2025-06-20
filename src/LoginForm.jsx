// src/LoginForm.jsx
import React, { useState } from 'react';
import './LoginForm.css';
import backgroundVideo from './background-video.mp4';

export default function LoginForm({ onLogin }) {
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('onemore-users') || '{}');
    const username = isRegister ? email : firstName; // Using email as username for login

    if (isRegister) {
      if (users[username]) {
        setError('User already exists');
      } else {
        users[username] = { password, firstName, lastName, phone };
        localStorage.setItem('onemore-users', JSON.stringify(users));
        localStorage.setItem('onemore-current-user', username);
        onLogin(username);
      }
    } else {
      if (users[username]?.password === password) {
        localStorage.setItem('onemore-current-user', username);
        onLogin(username);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-title">one more</h1>
      <video className="background-video" src={backgroundVideo} autoPlay loop muted />
      <div className="login-modal">
        <div className="tab-buttons">
          <button onClick={() => setIsRegister(true)} className={isRegister ? 'active' : ''}>Sign up</button>
          <button onClick={() => setIsRegister(false)} className={!isRegister ? 'active' : ''}>Sign in</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <h2>{isRegister ? 'Create an account' : 'Sign in'}</h2>
          
          {error && <p className="error-message">{error}</p>}
          
          {isRegister && (
            <div className="name-fields">
              <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          )}
          
          <input type="email" placeholder="Enter your email" value={isRegister ? email : firstName} onChange={e => isRegister ? setEmail(e.target.value) : setFirstName(e.target.value)} required />
          
          {isRegister && (
            <div className="phone-field">
              <span>🇺🇸</span>
              <input type="tel" placeholder="(775) 351-6501" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          )}
          
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

          <button type="submit" className="primary-btn">{isRegister ? 'Create an account' : 'Sign in'}</button>
          
          <div className="divider">OR SIGN IN WITH</div>
          
          <div className="social-logins">
            <button type="button" className="social-btn google">G</button>
            <button type="button" className="social-btn apple"></button>
          </div>
          
          {isRegister && <p className="terms">By creating an account, you agree to our Terms & Service</p>}
        </form>
      </div>
    </div>
  );
}
