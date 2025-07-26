import React from 'react';
import { User } from '../types';

interface DashboardProps {
  user: User;
  onNavigateToAdminUpload: () => void;
  onNavigateToSubjectSelect: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onNavigateToAdminUpload, 
  onNavigateToSubjectSelect 
}) => {
  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--on-surface)' }}>
            Welcome back, {user.username}!
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '18px' }}>
            What would you like to do today?
          </p>
        </div>

        <div className="subjects-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {user.isAdmin && (
            <div className="subject-card" onClick={onNavigateToAdminUpload}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <div className="subject-name">Upload Questions</div>
              <div className="subject-count">Add new MCQ questions to the database</div>
            </div>
          )}
          
          <div className="subject-card" onClick={onNavigateToSubjectSelect}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <div className="subject-name">Take Test</div>
            <div className="subject-count">Start a new MCQ test session</div>
          </div>
        </div>

        {user.isAdmin && (
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--on-surface)' }}>
                Admin Features
              </h3>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>
                As an admin, you can upload new MCQ questions and manage the question database.
              </p>
              <button 
                className="btn btn-primary btn-large"
                onClick={onNavigateToAdminUpload}
              >
                Go to Admin Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};