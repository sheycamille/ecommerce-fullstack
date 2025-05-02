import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Use axios to submit the form
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container" data-testid="login-container">
      <h2 className="login-title" data-testid="login-title">Login to Your Account</h2>
      
      {error && <div className="login-error" data-testid="login-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form" data-testid="login-form">
        <div className="form-group" data-testid="email-form-group">
          <label htmlFor="email" data-testid="email-label">Email</label>
          <input
            id="email"
            data-testid="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group" data-testid="password-form-group">
          <label htmlFor="password" data-testid="password-label">Password</label>
          <input
            id="password"
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        <button 
          data-testid="login-button" 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="login-help">
        <p>Demo credentials:</p>
        <p>Email: test@example.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );
}

export default LoginForm;
