import { motion } from 'framer-motion';

import {
  Share2,
  Play,
  Users,
  Coins,
  Sparkles,
  Gift,
  ArrowRight,
} from 'lucide-react';

import styles from './Hero.module.css';


function VECoin({ small = false }) {
  return (
    <div className={small ? styles.smallCoin : styles.coin}>
      <div className={styles.coinInner}>
        VE
      </div>
    </div>
  );
}


function RewardVisual() {
  return (
    <div className={styles.visualWrapper}>

      {/* Background Effects */}
      <div className={styles.visualGlow} />
      <div className={styles.visualGlowSecondary} />

      {/* Decorative Rings */}
      <div className={styles.orbit} />
      <div className={styles.orbitSmall} />
      <div className={styles.orbitDotOne} />
      <div className={styles.orbitDotTwo} />


      {/* Floating Coins */}

      <motion.div
        className={styles.floatCoinOne}
        animate={{
          y: [0, -14, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <VECoin small />
      </motion.div>


      <motion.div
        className={styles.floatCoinTwo}
        animate={{
          y: [0, 14, 0],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <VECoin small />
      </motion.div>


      <motion.div
        className={styles.floatCoinThree}
        animate={{
          y: [0, -12, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <VECoin small />
      </motion.div>


      {/* Floating Reward Badge */}

      <motion.div
        className={styles.rewardFloatingCard}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className={styles.rewardFloatingIcon}>
          <Gift size={18} />
        </div>

        <div>
          <span>Referral Reward</span>
          <strong>+500 VE</strong>
        </div>
      </motion.div>


      {/* Confetti */}

      <span className={styles.confettiOne} />
      <span className={styles.confettiTwo} />
      <span className={styles.confettiThree} />
      <span className={styles.confettiFour} />
      <span className={styles.confettiFive} />
      <span className={styles.confettiSix} />
      <span className={styles.confettiSeven} />


      {/* Main Gift Scene */}

      <motion.div
        className={styles.giftScene}
        initial={{
          opacity: 0,
          scale: 0.85,
          y: 30,
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

        {/* Gift Shadow */}
        <div className={styles.giftShadow} />


        {/* Gift Box */}

        <div className={styles.giftBox}>

          <div className={styles.boxSide} />

          <div className={styles.boxFront}>

            <div className={styles.boxHighlight} />

          </div>

          <div className={styles.boxTop} />

          <div className={styles.ribbonVertical} />

          <div className={styles.ribbonHorizontal} />

          <div className={styles.ribbonBowLeft} />

          <div className={styles.ribbonBowRight} />

        </div>


        {/* Main Coin */}

        <motion.div
          className={styles.mainCoin}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className={styles.mainCoinInner}>
            <span>VE</span>
          </div>
        </motion.div>

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

            <Play size={16} fill="currentColor" />

            How it works

          </button>

        </motion.div>


        {/* Trust Text */}

        <motion.p
          className={styles.trustText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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