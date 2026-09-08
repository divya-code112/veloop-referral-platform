import { motion } from 'framer-motion';

import {
  Home,
  ClipboardCheck,
  Users,
  Wallet,
  User,
} from 'lucide-react';

import styles from './BottomNavigation.module.css';


function BottomNavigation() {

  const navigationItems = [

    {
      label: 'Home',
      icon: Home,
      path: '/',
      active: false,
    },

    {
      label: 'Tasks',
      icon: ClipboardCheck,
      path: '/tasks',
      active: false,
    },

    {
      label: 'Refer',
      icon: Users,
      path: '/referral',
      active: true,
    },

    {
      label: 'Wallet',
      icon: Wallet,
      path: '/wallet',
      active: false,
    },

    {
      label: 'Profile',
      icon: User,
      path: '/profile',
      active: false,
    },

  ];


  const handleNavigation = (path) => {

    if (path === '/referral') {
      return;
    }

    window.location.href = path;

  };


  return (

    <nav
      className={styles.bottomNavigation}
      aria-label="Mobile navigation"
    >

      <div className={styles.navContainer}>

        {navigationItems.map((item) => {

          const Icon = item.icon;


          return (

            <motion.button
              key={item.label}

              type="button"

              className={`${styles.navItem} ${
                item.active
                  ? styles.active
                  : ''
              }`}

              onClick={() =>
                handleNavigation(item.path)
              }

              whileTap={{
                scale: 0.92,
              }}
            >


              {/* ACTIVE GLOW */}

              {item.active && (

                <span
                  className={styles.activeGlow}
                />

              )}


              {/* ICON */}

              <span
                className={styles.iconWrapper}
              >

                <Icon
                  size={27}
                  strokeWidth={
                    item.active ? 2.4 : 1.8
                  }
                />

              </span>


              {/* LABEL */}

              <span
                className={styles.label}
              >

                {item.label}

              </span>

            </motion.button>

          );

        })}

      </div>

    </nav>

  );

}


export default BottomNavigation;