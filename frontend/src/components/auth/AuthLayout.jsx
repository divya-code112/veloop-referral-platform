import { motion } from 'framer-motion';
import { Gift, Coins, Gem } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import styles from './AuthLayout.module.css';

function FloatingIcon({ children, className, delay, duration }) {
  return (
    <motion.div
      className={`${styles.floatIcon} ${className}`}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: [0, 0.3, 0.22],
        y: [0, -16, 0],
        rotate: [0, 8, -8, 0],
      }}
      transition={{
        opacity: {
          duration: 1,
          delay,
        },
        y: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
        rotate: {
          duration: duration + 1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function AuthLayout({ children, title, subtitle }) {
  return (
    <main className={styles.authPage}>
      {/* Background effects */}
      <div className={styles.backgroundGlow} />

      {/* Floating reward icons */}
      <div className={styles.iconLayer}>
        <FloatingIcon
          className={styles.iconOne}
          delay={0.2}
          duration={5}
        >
          <Coins size={48} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconTwo}
          delay={0.5}
          duration={6}
        >
          <Gem size={44} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconThree}
          delay={0.8}
          duration={5.5}
        >
          <Gift size={42} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconFour}
          delay={0.4}
          duration={6.5}
        >
          <Coins size={38} />
        </FloatingIcon>
      </div>

      <motion.div
        className={styles.authContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        {/* Logo */}
        <div className={styles.brand}>
          <div className={styles.logoBg}>
            <motion.img
              src={logo}
              alt="VELoop logo"
              className={styles.logo}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <span className={styles.brandName}>
            VELoop
          </span>
        </div>

        {/* Authentication Card */}
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {children}
        </div>
      </motion.div>
    </main>
  );
}

export default AuthLayout;