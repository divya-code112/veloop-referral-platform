import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/auth/AuthLayout';
import API from '../utils/api';

import styles from './LoginPage.module.css';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Save JWT token
      localStorage.setItem('token', response.data.token);

      // Save user information
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      // Redirect to main referral page
      navigate('/');
    } catch (error) {
      console.error(
        'Login failed:',
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Continue your referral journey and rewards"
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {/* Error Message */}

        {error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Email */}

        <div className={styles.fieldGroup}>
          <label htmlFor="email">
            Email Address
          </label>

          <div className={styles.inputWrapper}>
            <Mail
              size={19}
              className={styles.inputIcon}
            />

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}

        <div className={styles.fieldGroup}>
          <label htmlFor="password">
            Password
          </label>

          <div className={styles.inputWrapper}>
            <Lock
              size={19}
              className={styles.inputIcon}
            />

            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}

        <motion.button
          type="submit"
          className={styles.loginButton}
          disabled={loading}
          whileHover={{
            scale: loading ? 1 : 1.02,
          }}
          whileTap={{
            scale: loading ? 1 : 0.98,
          }}
        >
          {loading ? (
            <span className={styles.loadingText}>
              Logging in...
            </span>
          ) : (
            <>
              <LogIn size={19} />
              Login
            </>
          )}
        </motion.button>

        {/* Register Link */}

        <p className={styles.switchText}>
          Don't have an account?

          <Link
            to="/register"
            className={styles.switchLink}
          >
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;