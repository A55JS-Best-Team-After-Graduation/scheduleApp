import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

interface LoginProps {
  showFeedback: (message: string, type: 'success' | 'error') => void;
}

interface LoginResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}

const Login: React.FC<LoginProps> = ({ showFeedback }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useContext(AppContext) as {
    user: { id: string; username: string; email: string } | null;
    login: (user: { id: string; username: string; email: string }, token: string) => void;
  };

  const navigate = useNavigate();

  // Auto-login using token if it exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      autoLogin(token);
    }
  }, []);

  const autoLogin = async (token: string) => {
    try {
      const response = await fetch('/api/users/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send token in headers for verification
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data: LoginResponse = await response.json();

      if (!data || !data.id || !data.username || !data.email) {
        throw new Error('Invalid token data');
      }

      login({ id: data.id, username: data.username, email: data.email }, token);
      showFeedback('Logged in automatically!', 'success');
      navigate('/teams');
    } catch (error) {
      console.error('Auto login failed:', (error as Error).message);
      // Allow manual login
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data: LoginResponse = await response.json();

      if (!data || !data.id || !data.username || !data.token) {
        throw new Error('Invalid login response');
      }

      // Store token and user info in local storage and context
      login({ id: data.id, username: data.username, email: data.email }, data.token);

      showFeedback('Login successful!', 'success');
      navigate('/teams');
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to login. Please check your credentials and try again.';
      showFeedback(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
