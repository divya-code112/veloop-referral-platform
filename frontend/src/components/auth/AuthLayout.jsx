import { motion } from 'framer-motion';
import {
  Gift,
  Coins,
  Gem,
  Sparkles,
  CircleDollarSign,
} from 'lucide-react';

import logo from '../../assets/images/logo.png';
import styles from './AuthLayout.module.css';

function FloatingIcon({
  children,
  className,
  delay,
  duration,
}) {
  return (
    <motion.div
      className={`${styles.floatIcon} ${className}`}
      initial={{
        opacity: 0,
        scale: 0.7,
      }}
      animate={{
        opacity: [0, 0.35, 0.22],
        y: [0, -18, 0],
        rotate: [0, 6, -6, 0],
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

      {/* Animated background */}
      <div className={styles.meshBackground} />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowSecondary} />

      {/* Floating reward icons */}
      <div
        className={styles.iconLayer}
        aria-hidden="true"
      >
        <FloatingIcon
          className={styles.iconOne}
          delay={0.2}
          duration={5}
        >
          <Coins size={52} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconTwo}
          delay={0.5}
          duration={6}
        >
          <Gem size={48} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconThree}
          delay={0.8}
          duration={5.5}
        >
          <Gift size={46} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconFour}
          delay={0.4}
          duration={6.5}
        >
          <CircleDollarSign size={42} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconFive}
          delay={0.7}
          duration={5.8}
        >
          <Sparkles size={34} />
        </FloatingIcon>
      </div>

      <motion.div
        className={styles.authContainer}
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >

        {/* Brand */}
        <motion.div
          className={styles.brand}
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
        >
          <motion.div
            className={styles.logoBg}
            whileHover={{
              scale: 1.06,
              rotate: 5,
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
            }}
          >
            <img
              src={logo}
              alt="VELoop logo"
              className={styles.logo}
            />
          </motion.div>

          <span className={styles.brandName}>
            VE<span>Loop</span>
          </span>
        </motion.div>

        {/* Authentication Card */}
        <div className={styles.authCard}>

          {/* Decorative top glow */}
          <div className={styles.cardGlow} />

          <div className={styles.cardHeader}>
            <div className={styles.titleAccent}>
              <Sparkles size={15} />
              <span>VELoop Rewards</span>
            </div>

            <h1>{title}</h1>

            <p>{subtitle}</p>
          </div>

          <div className={styles.formContent}>
            {children}
          </div>

        </div>
      </motion.div>
    </main>
  );
}

export default AuthLayout;