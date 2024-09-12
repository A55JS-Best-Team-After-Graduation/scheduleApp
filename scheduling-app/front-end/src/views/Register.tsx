import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateForm } from '../service/service';
import { AppContext } from '../context/AppContext';

interface RegisterProps {
  showFeedback: (message: string, type: 'success' | 'error') => void;
}

const Register: React.FC<RegisterProps> = ({ showFeedback }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useContext(AppContext) as { login: (user: any, token: string) => void };
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm({ username, email, password });
    if (validationError) {
      showFeedback(validationError, 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      login(data.user, data.token); // Persist user and token
      showFeedback('Registration successful! Redirecting...', 'success');
      navigate('/login'); // 

    } catch (error) {
      // Handle `err` as an `Error` object
      const errorMessage = (error as Error).message || 'Failed to register. Please try again later.';
      showFeedback(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
