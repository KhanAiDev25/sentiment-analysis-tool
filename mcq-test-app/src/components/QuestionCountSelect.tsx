import React, { useState } from 'react';

interface QuestionCountSelectProps {
  subject: string;
  maxQuestions: number;
  onCountSelect: (count: number) => void;
  onBack: () => void;
}

export const QuestionCountSelect: React.FC<QuestionCountSelectProps> = ({
  subject,
  maxQuestions,
  onCountSelect,
  onBack
}) => {
  const [selectedCount, setSelectedCount] = useState<number | null>(null);

  const getQuestionCountOptions = (max: number): number[] => {
    const options: number[] = [];
    const baseOptions = [5, 10, 15, 20, 25, 30];
    
    for (const option of baseOptions) {
      if (option <= max) {
        options.push(option);
      }
    }
    
    if (max > 30 && !options.includes(max)) {
      options.push(max);
    }
    
    return options.length > 0 ? options : [max];
  };

  const questionOptions = getQuestionCountOptions(maxQuestions);

  const handleStartTest = () => {
    if (selectedCount) {
      onCountSelect(selectedCount);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <button 
              className="btn btn-secondary"
              onClick={onBack}
              style={{ marginRight: '16px' }}
            >
              ← Back
            </button>
            <h1 style={{ fontSize: '24px', color: 'var(--on-surface)' }}>
              Select Number of Questions
            </h1>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--on-surface)' }}>
              {subject}
            </h2>
            <p style={{ color: 'var(--on-surface-variant)' }}>
              {maxQuestions} question{maxQuestions !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="question-count-selector">
            {questionOptions.map((count) => (
              <div
                key={count}
                className={`count-option ${selectedCount === count ? 'selected' : ''}`}
                onClick={() => setSelectedCount(count)}
              >
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {count} Question{count !== 1 ? 's' : ''}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                    Estimated time: {Math.ceil(count * 1.5)} minutes
                  </div>
                </div>
                <div style={{ fontSize: '20px' }}>
                  {selectedCount === count ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px' }}>
            <button
              className="btn btn-primary btn-full-width btn-large"
              onClick={handleStartTest}
              disabled={!selectedCount}
            >
              Start Test
            </button>
          </div>

          {maxQuestions < 5 && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              backgroundColor: 'rgba(251, 188, 4, 0.1)', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                ⚠️ Limited questions available for this subject. Consider asking an admin to add more questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};