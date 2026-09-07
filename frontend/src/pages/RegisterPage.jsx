import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Gift,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import AuthLayout from '../components/auth/AuthLayout';
import API from '../utils/api';

import styles from './RegisterPage.module.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const referralFromUrl = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: referralFromUrl,
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
      setError('Email and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode || undefined,
      });

      // Save authentication data
      localStorage.setItem('token', response.data.token);

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      // Redirect to referral dashboard
      navigate('/');
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join VELoop"
      subtitle="Create your account and start earning rewards"
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="name">
            Full Name
          </label>

          <div className={styles.inputWrapper}>
            <User
              size={19}
              className={styles.inputIcon}
            />

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
        </div>

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
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Referral Code */}
        <div className={styles.fieldGroup}>
          <label htmlFor="referralCode">
            Referral Code
            <span className={styles.optional}>
              Optional
            </span>
          </label>

          <div className={styles.inputWrapper}>
            <Gift
              size={19}
              className={styles.inputIcon}
            />

            <input
              type="text"
              id="referralCode"
              name="referralCode"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Register Button */}
        <motion.button
          type="submit"
          className={styles.registerButton}
          disabled={loading}
          whileHover={{
            scale: loading ? 1 : 1.02,
          }}
          whileTap={{
            scale: loading ? 1 : 0.98,
          }}
        >
          {loading ? (
            'Creating account...'
          ) : (
            <>
              <UserPlus size={19} />
              Create Account
            </>
          )}
        </motion.button>

        <p className={styles.switchText}>
          Already have an account?

          <Link
            to="/login"
            className={styles.switchLink}
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;