# MCQ Test App

A modern, Google-style Multiple Choice Question (MCQ) test application built with React and TypeScript. Features a clean, responsive design with comprehensive admin and user flows.

## 🚀 Features

### Core Features
- ✅ **Login/Signup Flow** - User authentication with automatic login for last user
- ✅ **Admin Upload Access** - Admin users can upload MCQ questions in batch
- ✅ **Subject Selection** - Dynamic subject selection based on available questions
- ✅ **Dynamic Question Count Selector** - Choose number of questions to attempt
- ✅ **MCQ Test Interface** - Modern, interactive test-taking experience
- ✅ **Result Screen** - Comprehensive results with performance analysis
- ✅ **Google-Style Modern Theme** - Clean, Material Design inspired UI

### Admin Features
- **Batch Question Upload** - Add multiple MCQs at once
- **Subject Management** - Create new subjects or add to existing ones
- **Question Management** - Full CRUD operations for MCQ questions
- **Auto-completion** - Subject suggestions based on existing data

### User Features
- **Subject Browse** - View all available subjects with question counts
- **Flexible Test Length** - Choose from 5, 10, 15, 20, 25, 30 questions or maximum available
- **Real-time Progress** - Live progress tracking with timer
- **Question Navigation** - Jump between questions, see answered/unanswered status
- **Detailed Results** - Score percentage, correct/incorrect counts, performance analysis

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Custom CSS with CSS Variables (Google Material Design inspired)
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: LocalStorage (simulating SQLite for web environment)
- **Icons**: Unicode Emojis for cross-platform compatibility
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or extract the project**
   ```bash
   cd mcq-test-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically open in your default browser

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 How to Use

### Getting Started

1. **First Time Setup**
   - The app automatically creates sample data on first run
   - Default admin account: `username: admin`, `password: admin123`

2. **Login**
   - Use the default admin credentials or create a new account
   - The app remembers your last login for convenience

### For Administrators

1. **Upload Questions**
   - Click "Upload Questions" from the dashboard
   - Select or create a subject
   - Add multiple questions with 4 options each
   - Specify the correct answer (A, B, C, or D)
   - Submit to save to the database

2. **Manage Content**
   - Add questions to existing subjects or create new ones
   - Use the autocomplete feature for subject selection
   - Add multiple questions in one session

### For Users

1. **Take a Test**
   - Click "Take Test" from the dashboard
   - Select a subject from available options
   - Choose the number of questions (5-30 or maximum available)
   - Start the test

2. **During the Test**
   - Read each question carefully
   - Select your answer by clicking on the options
   - Use "Next" and "Previous" to navigate
   - View progress and time elapsed at the top
   - Use the question navigator to jump between questions

3. **View Results**
   - See your score percentage
   - Review correct/incorrect answer counts
   - Read performance analysis
   - Choose to take another test or return to dashboard

## 🎨 Design System

### Color Palette
- **Primary**: #1a73e8 (Google Blue)
- **Secondary**: #ea4335 (Google Red)
- **Success**: #34a853 (Google Green)
- **Warning**: #fbbc04 (Google Yellow)
- **Surface**: #ffffff (White)
- **Background**: #f8f9fa (Light Gray)

### Typography
- **Font Stack**: Google Sans, Roboto, system fonts
- **Responsive**: Scales from mobile to desktop
- **Hierarchy**: Clear visual hierarchy with proper contrast

### Components
- **Cards**: Elevated surfaces with shadows
- **Buttons**: Multiple variants (primary, secondary, success, danger)
- **Forms**: Clean inputs with focus states
- **Navigation**: Breadcrumb-style navigation

## 🗄️ Data Structure

### User
```typescript
interface User {
  id: string;
  username: string;
  password: string; // In production, this should be hashed
  isAdmin: boolean;
  createdAt: string;
}
```

### MCQ Question
```typescript
interface MCQ {
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
```

### Test Session
```typescript
interface TestSession {
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
```

### Test Result
```typescript
interface TestResult {
  id: string;
  userId: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  completedAt: string;
}
```

## 🔧 Configuration

### Environment Variables
The app uses standard Create React App configuration. No additional environment variables are required for basic functionality.

### Customization
- **Subjects**: Modify `database.ts` to add default subjects
- **Question Counts**: Update `QuestionCountSelect.tsx` to change available options
- **Styling**: Modify CSS variables in `App.css` for theming
- **Sample Data**: Update `initializeSampleData()` in `database.ts`

## 🚀 Deployment

### Option 1: Static Hosting (Recommended)
```bash
npm run build
# Upload the 'build' folder to your static hosting service
```

### Option 2: Using Serve
```bash
npm install -g serve
npm run build
serve -s build
```

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json: `"homepage": "https://yourusername.github.io/mcq-test-app"`
3. Add deploy scripts to package.json:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy: `npm run deploy`

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Considerations

- **Data Storage**: Uses LocalStorage (client-side only)
- **Passwords**: Currently stored in plain text (for demo purposes)
- **Production**: Implement proper authentication and encryption
- **HTTPS**: Always use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions, issues, or feature requests:
1. Check the existing issues
2. Create a new issue with detailed description
3. Provide steps to reproduce (for bugs)

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete MCQ test system
- Admin and user flows
- Google-style design
- Responsive layout
- Auto-login functionality

## 🎉 Acknowledgments

- Google Material Design for inspiration
- React community for excellent documentation
- Create React App for the foundation
- TypeScript for type safety

---

**Built with ❤️ using React and TypeScript**
