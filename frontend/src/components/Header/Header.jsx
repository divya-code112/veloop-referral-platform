import { motion } from 'framer-motion';
import {
  UserCircle,
  LogIn,
  ListTodo,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>

        {/* Logo */}
        <div className={styles.logoSlot}>
          <div className={styles.logoBg}>
            <motion.img
              src={logo}
              alt="VELoop logo"
              className={styles.logoImg}
              animate={{ rotate: 360 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </div>

        {/* Brand Name */}
        <span className={styles.brandName}>
          VELoop
        </span>

        {/* Right Side */}
        <div className={styles.profileSlot}>

          {token && user ? (
            <>
              {/* Tasks Button */}
              <Link
                to="/tasks"
                className={styles.tasksBtn}
              >
                <ListTodo size={18} />
                <span>Tasks</span>
              </Link>

              {/* Profile Button */}
              <Link
                to="/profile"
                className={styles.profileBtn}
                title="My Profile"
              >
                <UserCircle size={22} />
                <span>{user.name || 'Profile'}</span>
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className={styles.loginBtn}
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}

export default Header;