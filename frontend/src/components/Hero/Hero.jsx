import { motion } from 'framer-motion';

import {
  Share2,
  Play,
  Users,
  Coins,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import styles from './Hero.module.css';

function RewardVisual() {
  return (
    <div className={styles.visualWrapper}>
      {/* Background Effects */}
      <div className={styles.visualGlow} />
      <div className={styles.visualGlowSecondary} />

      {/* Decorative Glow Orbs */}
      <span className={styles.glowOrbOne} />
      <span className={styles.glowOrbTwo} />
      <span className={styles.glowOrbThree} />

      {/* Main Illustration */}
      <motion.div
        className={styles.illustrationWrapper}
        initial={{
          opacity: 0,
          scale: 0.88,
          y: 25,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
      >
        <motion.img
          src="/illustrations/refer-earn.avif"
          alt="Refer and earn rewards"
          className={styles.illustration}
          width="500"
          height="370"
          fetchPriority="high"
          decoding="async"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
}

function Hero() {
  const scrollToReferral = () => {
    document
      .getElementById('referral-section')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  const scrollToRules = () => {
    document
      .getElementById('how-it-works')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  return (
    <section className={styles.hero}>
      {/* Background */}
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />
      <div className={styles.gridPattern} />
      <div className={styles.noise} />

      {/* LEFT CONTENT */}
      <div className={styles.content}>
        <motion.div
          className={styles.badge}
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
          }}
        >
          <Sparkles size={15} />

          <span>Referral Rewards Program</span>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
        >
          Share the love.
          <span>Earn the rewards.</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
        >
          Invite your friends and grow together. Every successful
          referral unlocks exciting rewards and exclusive bonuses.
        </motion.p>

        {/* Reward Stats */}
        <motion.div
          className={styles.rewardStats}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
          }}
        >
          <div className={styles.rewardStat}>
            <div className={styles.statCoin}>
              <Coins size={22} />
            </div>

            <div>
              <strong>500 VE</strong>

              <span>
                Per successful referral
              </span>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.rewardStat}>
            <div className={styles.statUsers}>
              <Users size={22} />
            </div>

            <div>
              <strong>10%</strong>

              <span>
                Lifetime bonus rewards
              </span>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className={styles.actions}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.4,
          }}
        >
          <button
            className={styles.primaryButton}
            onClick={scrollToReferral}
          >
            <Share2 size={19} />

            <span>Share Your Link</span>

            <ArrowRight size={18} />
          </button>

          <button
            className={styles.secondaryButton}
            onClick={scrollToRules}
          >
            <Play
              size={16}
              fill="currentColor"
            />

            How it works
          </button>
        </motion.div>

        {/* Trust Text */}
        <motion.p
          className={styles.trustText}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.7,
          }}
        >
          <span className={styles.trustDot} />

          Simple. Transparent. Rewarding.
        </motion.p>
      </div>

      {/* RIGHT VISUAL */}
      <RewardVisual />
    </section>
  );
}

export default Hero;
