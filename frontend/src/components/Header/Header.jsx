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

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };


  return (
    <motion.header
      className={styles.header}
      initial={{
        y: -80,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={styles.headerGlow} />

      <div
        className={`container ${styles.inner}`}
      >

        {/* Logo */}
        <Link
          to="/"
          className={styles.logoSlot}
          aria-label="VELoop Home"
        >
          <motion.div
            className={styles.logoBg}
            whileHover={{
              rotate: 6,
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.96,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 16,
            }}
          >
            <span className={styles.logoRing} />

            <img
              src={logo}
              alt="VELoop logo"
              className={styles.logoImg}
            />
          </motion.div>
        </Link>


        {/* Brand */}
        <Link
          to="/"
          className={styles.brandName}
        >
          <span className={styles.brandVe}>
            VE
          </span>

          <span className={styles.brandLoop}>
            Loop
          </span>

          <Sparkles
            size={13}
            className={styles.brandSparkle}
          />
        </Link>


        {/* Right Actions */}
        <div className={styles.profileSlot}>

          {token && user ? (
            <>

              {/* Tasks */}
              <Link
                to="/tasks"
                className={styles.tasksBtn}
                title="Tasks"
              >
                <span className={styles.tasksIcon}>
                  <ListTodo size={17} />
                </span>

                <span className={styles.tasksText}>
                  Tasks
                </span>
              </Link>


              {/* Profile */}
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

                <span className={styles.statusDot} />
              </Link>


              {/* Logout */}
              <motion.button
                className={styles.logoutBtn}
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
                whileHover={{
                  scale: 1.08,
                  rotate: 6,
                }}
                whileTap={{
                  scale: 0.94,
                }}
              >
                <LogOut size={17} />
              </motion.button>

            </>
          ) : (

            /* Login */
            <Link
              to="/login"
              className={styles.loginBtn}
            >
              <LogIn size={17} />

              <span>
                Login
              </span>

              <Sparkles
                size={14}
                className={styles.loginSparkle}
              />
            </Link>

          )}

        </div>

      </div>

    </motion.header>
  );
}


export default Header;