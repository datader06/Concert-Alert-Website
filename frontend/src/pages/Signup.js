import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authService } from '../services/api';

const Signup = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    city: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.signup(
        formData.email,
        formData.password,
        formData.username,
        formData.city,
        formData.country
      );

      if (response.ok) {
        onSignupSuccess();
        navigate('/');
      } else {
        setError(response.data?.error || response.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">🎉 Create Account</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="musiclover123"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City (optional)</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country (optional)</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <a href="/login" className="link">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
