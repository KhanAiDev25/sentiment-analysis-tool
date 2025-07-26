import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">MCQ Test App</div>
          
          <div className="user-info">
            <span className="username">{user.username}</span>
            {user.isAdmin && <span className="admin-badge">Admin</span>}
            <button 
              className="btn btn-secondary btn-small"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};