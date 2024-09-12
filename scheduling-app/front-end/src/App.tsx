import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import './App.css';
import { Authentication } from './hoc/Authentication';
// import { NavBar } from './components/Header/NavBar';
import Feedback from './components/Feedback';
import TeamsLayout from './components/TeamsLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { Home } from './Home';

// Lazy loading components
const Register = lazy(() => import('./views/Register'));
const Login = lazy(() => import('./views/Login'));
const UpdateUser = lazy(() => import('./views/UpdateUser'));
// const Calendar = lazy(() => import('./views/Calendar'));
// const Tasks = lazy(() => import('./views/Tasks'));  // Assuming Tasks is a component
// const ApplyToTeam = lazy(() => import('./views/ApplyToTeam'));  // Assuming ApplyToTeam is a component

interface FeedbackProps {
  message: string;
  type: any;
}

function App() {
  const [feedback, setFeedback] = useState<FeedbackProps>({ message: '', type: '' });

  const showFeedback = (message: string, type: any) => {
    if (typeof message !== 'string') {
      console.error('showFeedback: Expected a string for message prop');
      return;
    }
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  return (
    <BrowserRouter>
      {/* <NavBar showFeedback={showFeedback} /> */}
      <Feedback message={feedback.message} type={feedback.type} />
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <Routes>
            {/* Redirect from root to /register */}
            <Route path="/" element={<Navigate to="/register" replace />} />

            {/* Public routes */}
            <Route path="/register" element={<Register showFeedback={showFeedback} />} />
            <Route path="/login" element={<Login showFeedback={showFeedback} />} />

            <Route path="/home" element={<Authentication ><Home/></Authentication>} />

            {/* Protected routes */}
            {/* <Route element={<Authentication />}>
              <Route path="/teams" element={<TeamsLayout />}>
                <Route index element={<ApplyToTeam />} />

                <Route path=":teamId/calendar" element={<Calendar />} />
                <Route path=":teamId/tasks" element={<Tasks />} />
              </Route>

              <Route path="/update/:userId" element={<UpdateUser showFeedback={showFeedback} />} />
            </Route> */}
              <Route path="/update/:userId" element={<UpdateUser showFeedback={showFeedback} />} />


            {/* Fallback route for undefined paths */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
