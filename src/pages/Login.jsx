// Login.jsx
import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
}
