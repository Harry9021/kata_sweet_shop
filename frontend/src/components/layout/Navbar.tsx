import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShoppingBag, User, TrendingUp, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="brand" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-logo">
            <ShoppingBag size={20} />
          </div>
          <span className="brand-text">SweetShop</span>
        </Link>

        <div className="mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive('/dashboard') ? 'primary' : 'ghost'}
                  className="nav-btn"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>
              </Link>

              <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive('/orders') ? 'primary' : 'ghost'}
                  className="nav-btn"
                >
                  {user?.role === 'admin' ? <TrendingUp size={18} /> : <ShoppingBag size={18} />}
                  {user?.role === 'admin' ? 'Sales' : 'My Orders'}
                </Button>
              </Link>

              <div className="user-profile">
                <div className="avatar">
                  <User size={16} color="var(--color-text-muted)" />
                </div>
                <span className="user-email">{user?.email.split('@')[0]}</span>
              </div>

              <Button variant="secondary" onClick={handleLogout} size="sm" className="logout-btn">
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive('/login') ? 'primary' : 'ghost'}
                  className="nav-btn"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive('/register') ? 'primary' : 'secondary'}
                  className="nav-btn"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background-color: var(--color-surface);
          height: 70px;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }

        .brand {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-logo {
          background-color: var(--color-primary);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-text-main);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 16px;
          padding-left: 16px; 
          border-left: 1px solid #eee;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background-color: #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-email {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .mobile-toggle {
          display: none;
          cursor: pointer;
          color: var(--color-text-main);
        }

        .nav-btn {
            width: 100%;
            justify-content: flex-start;
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }

          .nav-links {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background-color: var(--color-surface);
            flex-direction: column;
            align-items: stretch;
            padding: var(--spacing-lg);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            transform: translateY(-150%);
            transition: transform 0.3s ease-in-out;
            z-index: 99;
          }

          .nav-links.active {
            transform: translateY(0);
          }

          .user-profile {
            border-left: none;
            padding-left: 0;
            margin-right: 0;
            margin-bottom: var(--spacing-sm);
            border-top: 1px solid #eee;
            padding-top: var(--spacing-md);
            margin-top: var(--spacing-md);
          }
          
          .logout-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
