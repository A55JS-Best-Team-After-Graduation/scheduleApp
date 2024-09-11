import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import React from 'react';

interface AuthenticationProps {
  children: React.ReactNode;
}

export const Authentication: React.FC<AuthenticationProps> = ({ children }) => {
  const context = useContext(AppContext);

  // Add a check to ensure context is not undefined
  if (!context) {
    throw new Error('AppContext must be used within an AppContextProvider');
  }

  const { user } = context;
  const location = useLocation();

  if (!user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  return <>{children}</>;
};
