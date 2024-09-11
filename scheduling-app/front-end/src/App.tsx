// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, lazy, Suspense } from 'react';
// import './App.css';
// import { Authenticated } from './components/Authenticated';
// // import { NavBar } from './components/NavBar';
// // import Feedback from './components/Feedback';
// // import ErrorBoundary from './components/ErrorBoundary';

// // const Form = lazy(() => import('./components/Form'));
// const Register = lazy(() => import('./components/Register'));
// const Login = lazy(() => import('./components/Login'));
// // const UpdateUser = lazy(() => import('./components/UpdateUser'));

// interface FeedbackProps {
//   message: string;
//   type: string;
// }

// function App() {
//   const [feedback, setFeedback] = useState<FeedbackProps>({ message: '', type: '' });

//   const showFeedback = (message: string, type: string) => {
//     if (typeof message !== 'string') {
//       console.error('showFeedback: Expected a string for message prop');
//       return;
//     }
//     setFeedback({ message, type });
//     setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
//   };

//   return (
//     <BrowserRouter>
//       {/* <NavBar showFeedback={showFeedback} /> */}
//       {/* <Feedback message={feedback.message} type={feedback.type} /> */}
//       <Suspense fallback={<div>Loading...</div>}>
//         {/* <ErrorBoundary> */}
//           <Routes>
//             <Route path="/" element={<Navigate to="/register" replace />} />

//             <Route path="/register" element={<Register showFeedback={showFeedback} />} />
//             <Route path="/login" element={<Login showFeedback={showFeedback} />} />

//             {/* Protected routes */}
//             {/* <Route
//               path="/chat"
//               element={
//                 <Authenticated>
//                   <Form showFeedback={showFeedback} />
//                 </Authenticated>
//               }
//             /> */}
//             {/* <Route
//               path="/update/:userId"
//               element={
//                 <Authenticated>
//                   <UpdateUser showFeedback={showFeedback} />
//                 </Authenticated>
//               }
//             /> */}
//             <Route path="*" element={<div>404 - Page Not Found</div>} />
//           </Routes>
//         {/* </ErrorBoundary> */}
//       </Suspense>
//     </BrowserRouter>
//   );
// }

// export default App;
