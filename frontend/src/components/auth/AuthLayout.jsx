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
        scale: 0.6,
      }}
      animate={{
        opacity: [0, 0.45, 0.28],
        y: [0, -20, 0],
        rotate: [0, 8, -6, 0],
      }}
      transition={{
        opacity: {
          duration: 1.2,
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

      {/* Background Layers */}
      <div className={styles.gridBackground} />
      <div className={styles.noiseOverlay} />

      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />
      <div className={styles.glowThree} />

      {/* Floating Reward Icons */}
      <div
        className={styles.iconLayer}
        aria-hidden="true"
      >
        <FloatingIcon
          className={styles.iconOne}
          delay={0.2}
          duration={5}
        >
          <Coins size={54} />
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
          <CircleDollarSign size={44} />
        </FloatingIcon>

        <FloatingIcon
          className={styles.iconFive}
          delay={0.7}
          duration={5.8}
        >
          <Sparkles size={34} />
        </FloatingIcon>
      </div>

      {/* Main Authentication Container */}
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
            y: -16,
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
              scale: 1.07,
              rotate: 4,
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
            }}
          >
            <div className={styles.logoRing} />

            <img
              src={logo}
              alt="VELoop logo"
              className={styles.logo}
            />
          </motion.div>

          <div className={styles.brandText}>
            <span className={styles.brandName}>
              VE<span>Loop</span>
            </span>

            <span className={styles.brandTagline}>
              Rewards made rewarding
            </span>
          </div>
        </motion.div>

        {/* Authentication Card */}
        <div className={styles.authCard}>

          <div className={styles.cardBorderGlow} />
          <div className={styles.cardGlow} />

          <div className={styles.cardHeader}>

            <div className={styles.titleAccent}>
              <Sparkles size={14} />
              <span>VELoop Rewards</span>
            </div>

            <h1>{title}</h1>

            <p>{subtitle}</p>

          </div>

          <div className={styles.divider}>
            <span />
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