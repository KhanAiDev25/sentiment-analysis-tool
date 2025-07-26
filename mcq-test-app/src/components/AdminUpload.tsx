import React, { useState } from 'react';
import { database } from '../database';

interface AdminUploadProps {
  onBack: () => void;
}

interface MCQForm {
  subject: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export const AdminUpload: React.FC<AdminUploadProps> = ({ onBack }) => {
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<MCQForm[]>([{
    subject: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A'
  }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const addQuestion = () => {
    setQuestions([...questions, {
      subject: subject,
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof MCQForm, value: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!subject.trim()) {
        throw new Error('Please select or enter a subject');
      }

      const validQuestions = questions.filter(q => 
        q.question.trim() && 
        q.optionA.trim() && 
        q.optionB.trim() && 
        q.optionC.trim() && 
        q.optionD.trim()
      );

      if (validQuestions.length === 0) {
        throw new Error('Please add at least one complete question');
      }

      const promises = validQuestions.map(q => 
        database.createMCQ({
          subject: subject.trim(),
          question: q.question.trim(),
          optionA: q.optionA.trim(),
          optionB: q.optionB.trim(),
          optionC: q.optionC.trim(),
          optionD: q.optionD.trim(),
          correctAnswer: q.correctAnswer
        })
      );

      await Promise.all(promises);

      setMessage(`Successfully uploaded ${validQuestions.length} question(s) to ${subject}`);
      setMessageType('success');
      
      // Reset form
      setSubject('');
      setQuestions([{
        subject: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A'
      }]);

    } catch (err: any) {
      setMessage(err.message || 'Failed to upload questions');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const existingSubjects = database.getSubjects();

  return (
    <div className="page">
      <div className="container">
        <div className="card card-large">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <button 
              className="btn btn-secondary"
              onClick={onBack}
              style={{ marginRight: '16px' }}
            >
              ← Back
            </button>
            <h1 style={{ fontSize: '24px', color: 'var(--on-surface)' }}>
              Upload MCQ Questions
            </h1>
          </div>

          {message && (
            <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-upload-form">
            <div className="form-group">
              <label className="form-label" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                className="form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject name (e.g., Mathematics, Physics, Chemistry)"
                list="existing-subjects"
                required
                disabled={loading}
              />
              <datalist id="existing-subjects">
                {existingSubjects.map(sub => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>

            {questions.map((question, index) => (
              <div key={index} className="question-input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>Question {index + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => removeQuestion(index)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Question</label>
                  <textarea
                    className="form-input form-textarea"
                    value={question.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    placeholder="Enter the question"
                    disabled={loading}
                  />
                </div>

                <div className="options-grid">
                  <div className="form-group">
                    <label className="form-label">Option A</label>
                    <input
                      type="text"
                      className="form-input"
                      value={question.optionA}
                      onChange={(e) => updateQuestion(index, 'optionA', e.target.value)}
                      placeholder="Option A"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Option B</label>
                    <input
                      type="text"
                      className="form-input"
                      value={question.optionB}
                      onChange={(e) => updateQuestion(index, 'optionB', e.target.value)}
                      placeholder="Option B"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Option C</label>
                    <input
                      type="text"
                      className="form-input"
                      value={question.optionC}
                      onChange={(e) => updateQuestion(index, 'optionC', e.target.value)}
                      placeholder="Option C"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Option D</label>
                    <input
                      type="text"
                      className="form-input"
                      value={question.optionD}
                      onChange={(e) => updateQuestion(index, 'optionD', e.target.value)}
                      placeholder="Option D"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Correct Answer</label>
                  <select
                    className="form-select"
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value as 'A' | 'B' | 'C' | 'D')}
                    disabled={loading}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addQuestion}
                disabled={loading}
              >
                Add Another Question
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                    Uploading...
                  </>
                ) : (
                  `Upload ${questions.length} Question${questions.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};