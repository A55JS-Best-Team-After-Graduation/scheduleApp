import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserDetails, verifyToken } from '../service/service';

interface User {
  id: string;
  name: string;
  email: string;
  // Add more fields as needed, but do not include password
  // instead of password, we can use token: After a user logs in, use authentication tokens (like JWT) for managing user sessions. These tokens should be securely stored (e.g., in HTTP-only cookies) and used for authorization.
}

interface AppContextProps {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const defaultContextValue: AppContextProps = {
  user: null,
  login: () => {},
  logout: () => {},
};

export const AppContext = createContext<AppContextProps>(defaultContextValue);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    console.log('AppContextToken:', token);
    console.log('User from context:', user);
  }, [token, user]);

  // Restore user on app load
  useEffect(() => {
    const restoreUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const isValid = await verifyToken(storedToken);
          if (isValid) {
            const userData = await fetchUserDetails(storedToken);
            setUser(userData);
            setToken(storedToken);
          } else {
            console.error('Token is invalid or expired');
            logout();
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          logout();
        }
      }
    };

    restoreUser();
  }, []);

  // Function to login
  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider value={{ user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};
