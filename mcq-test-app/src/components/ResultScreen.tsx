import React from 'react';
import { TestResult } from '../types';

interface ResultScreenProps {
  result: TestResult;
  onTakeAnotherTest: () => void;
  onBackToDashboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onTakeAnotherTest,
  onBackToDashboard
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'var(--success-color)';
    if (score >= 60) return 'var(--warning-color)';
    return 'var(--secondary-color)';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Excellent! Outstanding performance! 🌟';
    if (score >= 80) return 'Great job! Well done! 🎉';
    if (score >= 70) return 'Good work! Keep it up! 👍';
    if (score >= 60) return 'Not bad! There\'s room for improvement. 📚';
    if (score >= 50) return 'You passed, but consider reviewing the material. 📖';
    return 'Don\'t worry! Practice makes perfect. 💪';
  };

  const getScoreEmoji = (score: number): string => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🥇';
    if (score >= 70) return '🥈';
    if (score >= 60) return '🥉';
    return '📚';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="result-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {getScoreEmoji(result.score)}
            </div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--on-surface)' }}>
              Test Completed!
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '18px' }}>
              {result.subject}
            </p>
          </div>

          {/* Score */}
          <div className="result-score" style={{ color: getScoreColor(result.score) }}>
            {result.score}%
          </div>

          <p style={{ 
            fontSize: '18px', 
            color: 'var(--on-surface-variant)', 
            marginBottom: '32px',
            fontWeight: '500'
          }}>
            {getScoreMessage(result.score)}
          </p>

          {/* Details */}
          <div className="result-details">
            <div className="result-detail">
              <div className="result-detail-number">{result.totalQuestions}</div>
              <div className="result-detail-label">Total Questions</div>
            </div>
            
            <div className="result-detail">
              <div className="result-detail-number" style={{ color: 'var(--success-color)' }}>
                {result.correctAnswers}
              </div>
              <div className="result-detail-label">Correct Answers</div>
            </div>
            
            <div className="result-detail">
              <div className="result-detail-number" style={{ color: 'var(--secondary-color)' }}>
                {result.totalQuestions - result.correctAnswers}
              </div>
              <div className="result-detail-label">Incorrect Answers</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            margin: '32px 0',
            padding: '24px',
            backgroundColor: 'var(--background-color)',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
                Accuracy Rate
              </div>
              <div style={{ fontSize: '16px', color: 'var(--on-surface-variant)' }}>
                {result.correctAnswers} out of {result.totalQuestions}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
                Completed On
              </div>
              <div style={{ fontSize: '16px', color: 'var(--on-surface-variant)' }}>
                {formatDate(result.completedAt)}
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div style={{ 
            padding: '20px',
            backgroundColor: getScoreColor(result.score) + '15',
            borderRadius: '8px',
            marginBottom: '32px'
          }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--on-surface)' }}>
              Performance Analysis
            </h3>
            {result.score >= 80 ? (
              <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.5' }}>
                Excellent work! Your strong performance indicates a solid understanding of the subject matter. 
                Keep up the great work and consider taking more advanced topics.
              </p>
            ) : result.score >= 60 ? (
              <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.5' }}>
                Good effort! You have a decent grasp of the material, but there's room for improvement. 
                Consider reviewing the topics where you had difficulty and practice more questions.
              </p>
            ) : (
              <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.5' }}>
                Don't be discouraged! Learning is a process, and this test helps identify areas for improvement. 
                Review the material thoroughly and take the test again when you feel more confident.
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-large"
              onClick={onTakeAnotherTest}
            >
              Take Another Test
            </button>
            
            <button
              className="btn btn-secondary btn-large"
              onClick={onBackToDashboard}
            >
              Back to Dashboard
            </button>
          </div>

          {/* Motivational Quote */}
          <div style={{ 
            marginTop: '32px',
            textAlign: 'center',
            fontStyle: 'italic',
            color: 'var(--on-surface-variant)',
            fontSize: '14px'
          }}>
            "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill
          </div>
        </div>
      </div>
    </div>
  );
};