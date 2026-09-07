import { motion } from 'framer-motion';
import {
  UserCircle,
  LogIn,
  ListTodo,
  LogOut,
  Sparkles,
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
    <motion.header
      className={styles.header}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <div className={`container ${styles.inner}`}>

        {/* Logo */}
        <Link to="/" className={styles.logoSlot}>
          <motion.div
            className={styles.logoBg}
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
            }}
          >
            <img
              src={logo}
              alt="VELoop logo"
              className={styles.logoImg}
            />
          </motion.div>
        </Link>

        {/* Brand */}
        <Link to="/" className={styles.brandName}>
          VE<span>Loop</span>
        </Link>

        {/* Right Side */}
        <div className={styles.profileSlot}>
          {token && user ? (
            <>
              <Link
                to="/tasks"
                className={styles.tasksBtn}
              >
                <ListTodo size={18} />
                <span>Tasks</span>
              </Link>

              <Link
                to="/profile"
                className={styles.profileBtn}
                title="My Profile"
              >
                <div className={styles.avatar}>
                  <UserCircle size={20} />
                </div>

                <span className={styles.userName}>
                  {user.name || 'Profile'}
                </span>
              </Link>

              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={styles.loginBtn}
            >
              <LogIn size={18} />
              <span>Login</span>
              <Sparkles size={15} />
            </Link>
          )}
        </div>

      </div>
    </motion.header>
  );
}

export default Header;