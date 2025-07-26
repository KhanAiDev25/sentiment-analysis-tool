import { User, MCQ, TestResult } from './types';

// Since we're in a web environment, we'll use LocalStorage to simulate SQLite
// In a real Node.js environment, you would use actual SQLite

class Database {
  private getStorageKey(table: string): string {
    return `mcq_app_${table}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // User operations
  async createUser(username: string, password: string, isAdmin: boolean = false): Promise<User> {
    const users = this.getUsers();
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const user: User = {
      id: this.generateId(),
      username,
      password, // In a real app, this should be hashed
      isAdmin,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    localStorage.setItem(this.getStorageKey('users'), JSON.stringify(users));
    return user;
  }

  async getUserByCredentials(username: string, password: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(u => u.username === username && u.password === password) || null;
  }

  getUsers(): User[] {
    const data = localStorage.getItem(this.getStorageKey('users'));
    return data ? JSON.parse(data) : [];
  }

  // MCQ operations
  async createMCQ(mcq: Omit<MCQ, 'id' | 'createdAt'>): Promise<MCQ> {
    const mcqs = this.getMCQs();
    const newMCQ: MCQ = {
      ...mcq,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    mcqs.push(newMCQ);
    localStorage.setItem(this.getStorageKey('mcqs'), JSON.stringify(mcqs));
    return newMCQ;
  }

  getMCQs(): MCQ[] {
    const data = localStorage.getItem(this.getStorageKey('mcqs'));
    return data ? JSON.parse(data) : [];
  }

  getMCQsBySubject(subject: string): MCQ[] {
    return this.getMCQs().filter(mcq => mcq.subject === subject);
  }

  getSubjects(): string[] {
    const mcqs = this.getMCQs();
    const subjectSet = new Set(mcqs.map(mcq => mcq.subject));
    const subjects = Array.from(subjectSet);
    return subjects.sort();
  }

  getRandomMCQsBySubject(subject: string, count: number): MCQ[] {
    const subjectMCQs = this.getMCQsBySubject(subject);
    const shuffled = subjectMCQs.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Test Result operations
  async saveTestResult(result: Omit<TestResult, 'id'>): Promise<TestResult> {
    const results = this.getTestResults();
    const newResult: TestResult = {
      ...result,
      id: this.generateId()
    };

    results.push(newResult);
    localStorage.setItem(this.getStorageKey('results'), JSON.stringify(results));
    return newResult;
  }

  getTestResults(): TestResult[] {
    const data = localStorage.getItem(this.getStorageKey('results'));
    return data ? JSON.parse(data) : [];
  }

  getTestResultsByUser(userId: string): TestResult[] {
    return this.getTestResults().filter(result => result.userId === userId);
  }

  // Auto-login functionality
  setLastUser(user: User): void {
    localStorage.setItem(this.getStorageKey('lastUser'), JSON.stringify(user));
  }

  getLastUser(): User | null {
    const data = localStorage.getItem(this.getStorageKey('lastUser'));
    return data ? JSON.parse(data) : null;
  }

  clearLastUser(): void {
    localStorage.removeItem(this.getStorageKey('lastUser'));
  }

  // Initialize with some sample data
  initializeSampleData(): void {
    const users = this.getUsers();
    const mcqs = this.getMCQs();

    // Create admin user if not exists
    if (!users.find(u => u.username === 'admin')) {
      this.createUser('admin', 'admin123', true);
    }

    // Create sample MCQs if none exist
    if (mcqs.length === 0) {
      const sampleMCQs = [
        {
          subject: 'Mathematics',
          question: 'What is 2 + 2?',
          optionA: '3',
          optionB: '4',
          optionC: '5',
          optionD: '6',
          correctAnswer: 'B' as const
        },
        {
          subject: 'Mathematics',
          question: 'What is the square root of 16?',
          optionA: '2',
          optionB: '3',
          optionC: '4',
          optionD: '5',
          correctAnswer: 'C' as const
        },
        {
          subject: 'Physics',
          question: 'What is the speed of light?',
          optionA: '299,792,458 m/s',
          optionB: '300,000,000 m/s',
          optionC: '250,000,000 m/s',
          optionD: '350,000,000 m/s',
          correctAnswer: 'A' as const
        },
        {
          subject: 'Physics',
          question: 'What is the unit of force?',
          optionA: 'Joule',
          optionB: 'Watt',
          optionC: 'Newton',
          optionD: 'Pascal',
          correctAnswer: 'C' as const
        }
      ];

      sampleMCQs.forEach(mcq => this.createMCQ(mcq));
    }
  }
}

export const database = new Database();