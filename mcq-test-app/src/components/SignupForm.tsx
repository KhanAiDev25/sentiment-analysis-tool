import React, { useState } from 'react';
import { database } from '../database';
import { User } from '../types';

interface SignupFormProps {
  onSignup: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const user = await database.createUser(username, password);
      database.setLastUser(user);
      onSignup(user);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
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
            Create your account
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
              placeholder="Choose a username"
              minLength={3}
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
              placeholder="Choose a password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Confirm your password"
              minLength={6}
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
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
            Already have an account?
          </p>
          <button onClick={onSwitchToLogin}>Sign in</button>
        </div>
      </div>
    </div>
  );
};