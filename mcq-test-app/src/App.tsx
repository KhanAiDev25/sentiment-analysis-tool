import React, { useState, useEffect } from 'react';
import './App.css';
import { database } from './database';
import { AppState, User, TestSession, TestResult } from './types';

// Import components
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AdminUpload } from './components/AdminUpload';
import { SubjectSelect } from './components/SubjectSelect';
import { QuestionCountSelect } from './components/QuestionCountSelect';
import { TestInterface } from './components/TestInterface';
import { ResultScreen } from './components/ResultScreen';

function App() {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    currentView: 'login',
    testSession: null,
    testResult: null
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isSignupMode, setIsSignupMode] = useState(false);

  // Initialize app and check for auto-login
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize database with sample data
      database.initializeSampleData();
      
      // Check for auto-login
      const lastUser = database.getLastUser();
      if (lastUser) {
        // Verify user still exists in database
        const currentUser = await database.getUserByCredentials(lastUser.username, lastUser.password);
        if (currentUser) {
          setAppState(prev => ({
            ...prev,
            user: lastUser,
            currentView: 'dashboard'
          }));
        } else {
          database.clearLastUser();
        }
      }
    };

    initializeApp();
  }, []);

  // Auth handlers
  const handleLogin = (user: User) => {
    setAppState(prev => ({
      ...prev,
      user,
      currentView: 'dashboard'
    }));
  };

  const handleSignup = (user: User) => {
    setAppState(prev => ({
      ...prev,
      user,
      currentView: 'dashboard'
    }));
  };

  const handleLogout = () => {
    database.clearLastUser();
    setAppState({
      user: null,
      currentView: 'login',
      testSession: null,
      testResult: null
    });
    setSelectedSubject('');
    setIsSignupMode(false);
  };

  // Navigation handlers
  const navigateTo = (view: AppState['currentView']) => {
    setAppState(prev => ({ ...prev, currentView: view }));
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    navigateTo('question-count');
  };

  const handleQuestionCountSelect = (count: number) => {
    if (!appState.user || !selectedSubject) return;

    // Get random questions for the test
    const questions = database.getRandomMCQsBySubject(selectedSubject, count);
    
    const testSession: TestSession = {
      id: Math.random().toString(36).substr(2, 9),
      userId: appState.user.id,
      subject: selectedSubject,
      totalQuestions: count,
      currentQuestion: 0,
      answers: {},
      questions,
      startedAt: new Date().toISOString()
    };

    setAppState(prev => ({
      ...prev,
      testSession,
      currentView: 'test'
    }));
  };

  // Test handlers
  const handleAnswerSelect = (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    if (!appState.testSession) return;

    const updatedSession = {
      ...appState.testSession,
      answers: {
        ...appState.testSession.answers,
        [questionId]: answer
      }
    };

    setAppState(prev => ({
      ...prev,
      testSession: updatedSession
    }));
  };

  const handleNextQuestion = () => {
    if (!appState.testSession) return;

    const nextQuestion = Math.min(
      appState.testSession.currentQuestion + 1,
      appState.testSession.totalQuestions - 1
    );

    setAppState(prev => ({
      ...prev,
      testSession: {
        ...prev.testSession!,
        currentQuestion: nextQuestion
      }
    }));
  };

  const handlePreviousQuestion = () => {
    if (!appState.testSession) return;

    const prevQuestion = Math.max(appState.testSession.currentQuestion - 1, 0);

    setAppState(prev => ({
      ...prev,
      testSession: {
        ...prev.testSession!,
        currentQuestion: prevQuestion
      }
    }));
  };

  const handleCompleteTest = async () => {
    if (!appState.testSession || !appState.user) return;

    // Calculate results
    let correctAnswers = 0;
    
    appState.testSession.questions.forEach(question => {
      const userAnswer = appState.testSession!.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / appState.testSession.totalQuestions) * 100);
    
    const result: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      userId: appState.user.id,
      subject: appState.testSession.subject,
      totalQuestions: appState.testSession.totalQuestions,
      correctAnswers,
      score,
      completedAt: new Date().toISOString()
    };

    // Save result to database
    await database.saveTestResult(result);

    setAppState(prev => ({
      ...prev,
      testResult: result,
      currentView: 'result',
      testSession: null
    }));
  };

  const handleTakeAnotherTest = () => {
    setAppState(prev => ({
      ...prev,
      testResult: null,
      currentView: 'subject-select'
    }));
    setSelectedSubject('');
  };

  // Render based on current view
  const renderCurrentView = () => {
    switch (appState.currentView) {
      case 'login':
        return (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsSignupMode(true)}
          />
        );

      case 'signup':
        return (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsSignupMode(false)}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            user={appState.user!}
            onNavigateToAdminUpload={() => navigateTo('admin-upload')}
            onNavigateToSubjectSelect={() => navigateTo('subject-select')}
          />
        );

      case 'admin-upload':
        return (
          <AdminUpload
            onBack={() => navigateTo('dashboard')}
          />
        );

      case 'subject-select':
        return (
          <SubjectSelect
            onSubjectSelect={handleSubjectSelect}
            onBack={() => navigateTo('dashboard')}
          />
        );

      case 'question-count':
        const maxQuestions = database.getMCQsBySubject(selectedSubject).length;
        return (
          <QuestionCountSelect
            subject={selectedSubject}
            maxQuestions={maxQuestions}
            onCountSelect={handleQuestionCountSelect}
            onBack={() => navigateTo('subject-select')}
          />
        );

      case 'test':
        return (
          <TestInterface
            testSession={appState.testSession!}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onCompleteTest={handleCompleteTest}
          />
        );

      case 'result':
        return (
          <ResultScreen
            result={appState.testResult!}
            onTakeAnotherTest={handleTakeAnotherTest}
            onBackToDashboard={() => navigateTo('dashboard')}
          />
        );

      default:
        return null;
    }
  };

  // Handle signup mode toggle
  useEffect(() => {
    if (isSignupMode) {
      setAppState(prev => ({ ...prev, currentView: 'signup' }));
    } else if (appState.currentView === 'signup') {
      setAppState(prev => ({ ...prev, currentView: 'login' }));
    }
  }, [isSignupMode, appState.currentView]);

  return (
    <div className="app">
      {appState.user && (
        <Header 
          user={appState.user} 
          onLogout={handleLogout} 
        />
      )}
      {renderCurrentView()}
    </div>
  );
}

export default App;
