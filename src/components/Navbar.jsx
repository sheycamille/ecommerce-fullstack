import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check login status whenever component renders
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-logo" data-testid="navbar-logo">
        <NavLink to="/" data-testid="logo-link">
          ShopEasy
        </NavLink>
      </div>
      
      <div className="navbar-links">
        <NavLink 
          to="/products" 
          className={({ isActive }) => isActive ? 'active' : ''}
          data-testid="products-link"
        >
          Products
        </NavLink>
        
        {isLoggedIn && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? 'active' : ''}
            data-testid="dashboard-link"
          >
            Dashboard
          </NavLink>
        )}
        
        {isLoggedIn ? (
          <>
            <NavLink 
              to="/checkout" 
              className={({ isActive }) => isActive ? 'active' : ''}
              data-testid="checkout-link"
            >
              Checkout
            </NavLink>
            <button 
              className="logout-button" 
              onClick={handleLogout}
              data-testid="logout-button"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink 
            to="/login" 
            className={({ isActive }) => isActive ? 'active' : ''}
            data-testid="login-link"
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


