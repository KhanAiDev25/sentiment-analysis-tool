export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface MCQ {
  id: string;
  subject: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  createdAt: string;
}

export interface TestSession {
  id: string;
  userId: string;
  subject: string;
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  questions: MCQ[];
  startedAt: string;
  completedAt?: string;
}

export interface TestResult {
  id: string;
  userId: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  completedAt: string;
}

export interface AppState {
  user: User | null;
  currentView: 'login' | 'signup' | 'dashboard' | 'admin-upload' | 'subject-select' | 'question-count' | 'test' | 'result';
  testSession: TestSession | null;
  testResult: TestResult | null;
}