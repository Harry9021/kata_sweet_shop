import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ArrowRight, Star, LayoutDashboard } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="home-page">
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Sweet Dreams Are Made of These</h1>
            <p>Discover the finest handcrafted sweets, chocolates, and treats. Freshly made and delivered with love.</p>
            <div className="hero-actions">
              {isAuthenticated ? (
                isAdmin ? (
                  <Link to="/dashboard">
                    <Button size="lg">
                      Manage Inventory <LayoutDashboard size={20} style={{ marginLeft: 8 }} />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button size="lg">
                      Shop Now <ArrowRight size={20} />
                    </Button>
                  </Link>
                )
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button size="lg">
                      Shop Now <ArrowRight size={20} />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary" size="lg">
                      Join Us
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-sweet sweet-1">🍬</div>
            <div className="floating-sweet sweet-2">🍭</div>
            <div className="floating-sweet sweet-3">🍫</div>
          </div>
        </div>
      </header>

      <section className="features container">
        <div className="feature-card">
          <div className="icon-wrapper"><Star size={24} /></div>
          <h3>Premium Quality</h3>
          <p>We use only the finest ingredients sourced from around the world.</p>
        </div>
        <div className="feature-card">
          <div className="icon-wrapper"><Star size={24} /></div>
          <h3>Handcrafted</h3>
          <p>Every sweet is made by hand with attention to detail and passion.</p>
        </div>
        <div className="feature-card">
          <div className="icon-wrapper"><Star size={24} /></div>
          <h3>Fresh Daily</h3>
          <p>Our kitchen works around the clock to ensure maximum freshness.</p>
        </div>
      </section>

      <style>{`
        .home-page {
          padding-bottom: var(--spacing-2xl);
        }

        .hero {
          background: linear-gradient(135deg, #FFF0F0 0%, #E8F6F4 100%);
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }
        
        .hero .container {
          display: flex;
          align-items: center;
          gap: var(--spacing-xl);
        }
        
        .hero-content {
          flex: 1;
        }
        
        .hero h1 {
          font-size: 3.5rem;
          color: var(--color-text-main);
          margin-bottom: var(--spacing-md);
          line-height: 1.1;
        }
        
        .hero p {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-xl);
          max-width: 500px;
        }
        
        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
        }
        
        .hero-image {
          flex: 1;
          height: 400px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .floating-sweet {
          font-size: 8rem;
          position: absolute;
          animation: float 6s ease-in-out infinite;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }
        
        .sweet-1 { top: 20%; left: 10%; animation-delay: 0s; transform: rotate(-15deg); }
        .sweet-2 { top: 10%; right: 10%; animation-delay: 2s; transform: rotate(15deg); font-size: 6rem; }
        .sweet-3 { bottom: 20%; left: 40%; animation-delay: 4s; transform: rotate(5deg); font-size: 7rem; }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .features {
          padding: 80px var(--spacing-md);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-xl);
        }
        
        .feature-card {
          text-align: center;
          padding: var(--spacing-lg);
        }
        
        .icon-wrapper {
          width: 60px;
          height: 60px;
          background-color: var(--color-surface);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--spacing-md);
          color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }
        
        .feature-card h3 {
          margin-bottom: var(--spacing-sm);
          color: var(--color-text-main);
        }
        
        .feature-card p {
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .hero h1 { font-size: 2.5rem; }
          .hero .container { flex-direction: column; text-align: center; }
          .hero-actions { justify-content: center; }
          .hero-image { display: none; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
