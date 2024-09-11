import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import './App.css';
import { Authentacation } from './hoc/Authentacation';
import { NavBar } from './components/Header/NavBar';
import Feedback from './components/Feedback';
import TeamsLayout from './components/TeamsLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading components
const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const UpdateUser = lazy(() => import('./components/UpdateUser'));
// const Calendar = lazy(() => import('./components/Calendar'));
// const Tasks = lazy(() => import('./components/Tasks'));  // Assuming Tasks is a component
// const ApplyToTeam = lazy(() => import('./components/ApplyToTeam'));  // Assuming ApplyToTeam is a component

interface FeedbackProps {
  message: string;
  type: string;
}

function App() {
  const [feedback, setFeedback] = useState<FeedbackProps>({ message: '', type: '' });

  const showFeedback = (message: string, type: string) => {
    if (typeof message !== 'string') {
      console.error('showFeedback: Expected a string for message prop');
      return;
    }
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  return (
    <BrowserRouter>
      <NavBar showFeedback={showFeedback} />
      <Feedback message={feedback.message} type={feedback.type} />
      <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary>
        <Routes>
          {/* Redirect from root to /register */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Public routes */}
          <Route path="/register" element={<Register showFeedback={showFeedback} />} />
          <Route path="/login" element={<Login showFeedback={showFeedback} />} />

          {/* Protected routes */}
          <Route element={<Authentacation />}>
            {/* Nested routing for teams */}
            <Route path="/teams" element={<TeamsLayout />}>
              {/* Default view when no team is selected */}
              <Route index element={<ApplyToTeam />} /> 
              
              {/* Nested routes for specific teams */}
              <Route path=":teamId/calendar" element={<Calendar />} />
              <Route path=":teamId/tasks" element={<Tasks />} />
            </Route>

            {/* Update user route protected */}
            <Route path="/update/:userId" element={<UpdateUser showFeedback={showFeedback} />} />
          </Route>

          {/* Fallback route for undefined paths */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
