import React, { useState, useEffect } from 'react';
import { TestSession, MCQ } from '../types';

interface TestInterfaceProps {
  testSession: TestSession;
  onAnswerSelect: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onCompleteTest: () => void;
}

export const TestInterface: React.FC<TestInterfaceProps> = ({
  testSession,
  onAnswerSelect,
  onNextQuestion,
  onPreviousQuestion,
  onCompleteTest
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentQuestion = testSession.questions[testSession.currentQuestion];
  const currentAnswer = testSession.answers[currentQuestion.id];
  const progress = ((testSession.currentQuestion + 1) / testSession.totalQuestions) * 100;
  const isLastQuestion = testSession.currentQuestion === testSession.totalQuestions - 1;
  const isFirstQuestion = testSession.currentQuestion === 0;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    onAnswerSelect(currentQuestion.id, answer);
  };

  const getAnsweredCount = (): number => {
    return Object.keys(testSession.answers).length;
  };

  return (
    <div className="page">
      <div className="container">
        {/* Progress Header */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: 'var(--on-surface)', marginBottom: '4px' }}>
                {testSession.subject}
              </h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>
                Question {testSession.currentQuestion + 1} of {testSession.totalQuestions}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
                {formatTime(timeElapsed)}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                {getAnsweredCount()}/{testSession.totalQuestions} answered
              </div>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-number">
            Question {testSession.currentQuestion + 1}
          </div>
          
          <div className="question-text">
            {currentQuestion.question}
          </div>

          <div className="options">
            {(['A', 'B', 'C', 'D'] as const).map((option) => (
              <div
                key={option}
                className={`option ${currentAnswer === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="option-label">{option}</div>
                <div className="option-text">
                  {currentQuestion[`option${option}` as keyof MCQ] as string}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={onPreviousQuestion}
              disabled={isFirstQuestion}
            >
              ← Previous
            </button>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {!isLastQuestion ? (
                <button
                  className="btn btn-primary"
                  onClick={onNextQuestion}
                >
                  Next →
                </button>
              ) : (
                <button
                  className="btn btn-success btn-large"
                  onClick={onCompleteTest}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Complete Test</span>
                  <span style={{ fontSize: '16px' }}>✓</span>
                </button>
              )}
            </div>
          </div>

          {isLastQuestion && getAnsweredCount() < testSession.totalQuestions && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: 'rgba(251, 188, 4, 0.1)', 
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>
                ⚠️ You have {testSession.totalQuestions - getAnsweredCount()} unanswered question{testSession.totalQuestions - getAnsweredCount() !== 1 ? 's' : ''}. 
                You can still complete the test, but unanswered questions will be marked as incorrect.
              </p>
            </div>
          )}
        </div>

        {/* Question Navigator */}
        <div className="card">
          <h4 style={{ marginBottom: '16px', color: 'var(--on-surface)' }}>
            Question Navigator
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', 
            gap: '8px' 
          }}>
            {testSession.questions.map((question, index) => (
              <button
                key={question.id}
                className={`btn btn-small ${
                  index === testSession.currentQuestion 
                    ? 'btn-primary' 
                    : testSession.answers[question.id] 
                      ? 'btn-success' 
                      : 'btn-secondary'
                }`}
                onClick={() => {
                  // This would need to be implemented in the parent component
                  // For now, we'll just show the current state
                }}
                style={{ 
                  minWidth: '40px',
                  padding: '8px 4px',
                  fontSize: '12px'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginTop: '12px', 
            fontSize: '12px',
            color: 'var(--on-surface-variant)',
            flexWrap: 'wrap'
          }}>
            <span>🔵 Current</span>
            <span>🟢 Answered</span>
            <span>⚪ Unanswered</span>
          </div>
        </div>
      </div>
    </div>
  );
};