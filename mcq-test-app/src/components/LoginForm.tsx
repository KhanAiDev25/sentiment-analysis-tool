import React, { useState } from 'react';
import { database } from '../database';
import { User } from '../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await database.getUserByCredentials(username, password);
      if (user) {
        database.setLastUser(user);
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="logo">MCQ Test App</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: '8px' }}>
            Sign in to continue
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full-width btn-large"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
            Don't have an account?
          </p>
          <button onClick={onSwitchToSignup}>Create account</button>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--background-color)', borderRadius: '4px' }}>
          <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
            Demo credentials:
          </p>
          <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>
            Admin: username=<strong>admin</strong>, password=<strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};