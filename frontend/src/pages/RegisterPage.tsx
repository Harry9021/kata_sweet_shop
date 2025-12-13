import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/common/Button';
import SuccessAnimation from '../components/common/SuccessAnimation';

import { encryptPassword } from '../utils/encryption';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const encryptedPassword = encryptPassword(password);
            const response = await api.post('/auth/register', { email, password: encryptedPassword, role });
            const { user, tokens } = response.data.data;

            setShowSuccess(true);
            setTimeout(() => {
                login(user, tokens);
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = err as any;
            setError(error.response?.data?.message || 'Failed to register');
            setIsLoading(false);
            console.error(error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card">
                {showSuccess ? (
                    <div className="text-center py-4">
                        <SuccessAnimation
                            message="Account Created!"
                            color="#9b59b6"
                            size={100}
                        />
                    </div>
                ) : (
                    <>
                        <h2 className="text-center mb-3">Create Account</h2>

                        {error && (
                            <div className="error-message mb-2">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-2">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Min 6 characters"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="role">Account Type</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                                >
                                    <option value="user">Customer</option>
                                    <option value="admin">Shop Manager (Admin)</option>
                                </select>
                            </div>

                            <Button type="submit" isLoading={isLoading} className="w-100" variant="primary">
                                Register
                            </Button>
                        </form>

                        <p className="text-center mt-3 text-muted">
                            Already have an account? <Link to="/login" style={{ color: 'var(--color-secondary-dark)' }}>Sign In</Link>
                        </p>
                    </>
                )}
            </div>

            <style>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-background);
          padding: var(--spacing-md);
        }
        
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: var(--spacing-xl);
          border-top: 5px solid var(--color-secondary);
        }
        
        .form-group label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
          color: var(--color-text-main);
        }
        
        .w-100 {
          width: 100%;
          justify-content: center;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          border-left: 4px solid #c62828;
        }
        
        .mt-3 { margin-top: var(--spacing-lg); }
        .text-muted { color: var(--color-text-muted); font-size: 0.9rem; }
      `}</style>
        </div>
    );
};

export default RegisterPage;
