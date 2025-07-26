import React, { useState, useEffect } from 'react';
import { database } from '../database';

interface SubjectSelectProps {
  onSubjectSelect: (subject: string) => void;
  onBack: () => void;
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({ onSubjectSelect, onBack }) => {
  const [subjects, setSubjects] = useState<Array<{name: string, count: number}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectNames = database.getSubjects();
        const subjectsWithCounts = subjectNames.map(subject => ({
          name: subject,
          count: database.getMCQsBySubject(subject).length
        }));
        setSubjects(subjectsWithCounts);
      } catch (error) {
        console.error('Failed to load subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <button 
            className="btn btn-secondary"
            onClick={onBack}
            style={{ marginBottom: '24px' }}
          >
            ← Back to Dashboard
          </button>
          
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--on-surface)' }}>
            Select a Subject
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '18px' }}>
            Choose the subject you want to take a test on
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '48px', marginBottom: '24px' }}>📚</div>
            <h3 style={{ marginBottom: '16px', color: 'var(--on-surface)' }}>
              No Subjects Available
            </h3>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>
              There are no questions available yet. Please contact an admin to add questions to the database.
            </p>
            <button className="btn btn-primary" onClick={onBack}>
              Go Back
            </button>
          </div>
        ) : (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="subject-card"
                onClick={() => onSubjectSelect(subject.name)}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {getSubjectIcon(subject.name)}
                </div>
                <div className="subject-name">{subject.name}</div>
                <div className="subject-count">
                  {subject.count} question{subject.count !== 1 ? 's' : ''} available
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function getSubjectIcon(subject: string): string {
  const icons: Record<string, string> = {
    'Mathematics': '🔢',
    'Physics': '⚛️',
    'Chemistry': '🧪',
    'Biology': '🧬',
    'History': '📜',
    'Geography': '🌍',
    'Literature': '📖',
    'Computer Science': '💻',
    'English': '🔤',
    'Science': '🔬'
  };
  
  return icons[subject] || '📚';
}