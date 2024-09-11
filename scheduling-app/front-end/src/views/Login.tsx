import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { loginUser } from '../service/service';

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

  const { user, login } = useContext(AppContext) as {
    user: { id: string; username: string; email: string } | null;
    login: (user: { id: string; username: string; email: string }, token: string) => void;
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('User updated:', user);
      navigate('/chat'); // Redirect if user is already logged in
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password }) as LoginResponse;

      if (!data || !data.username || !data.token || !data.id) {
        console.log('LoginData:', data);
        throw new Error("Username, id, or token is missing in the response");
      }

      // Update context with user info, including id
      login({ id: data.id, username: data.username, email: data.email }, data.token);

      showFeedback('Login successful!', 'success');
      navigate('/chat');
    } catch (err) {
      // Handle `err` as an `Error` object
      const errorMessage = (err as Error).message || 'Failed to login. Please check your credentials and try again.';
      console.error('Login error:', errorMessage);
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
