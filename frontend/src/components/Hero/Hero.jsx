import { motion } from 'framer-motion';

import {
  Share2,
  Play,
  Users,
  Coins,
  Sparkles,
} from 'lucide-react';

import styles from './Hero.module.css';


function VECoin({ small = false }) {
  return (
    <div
      className={
        small
          ? styles.smallCoin
          : styles.coin
      }
    >
      <span>VE</span>
    </div>
  );
}


function RewardVisual() {
  return (
    <div className={styles.visualWrapper}>

      {/* Background glow */}
      <div className={styles.visualGlow} />

      {/* Orbit */}
      <div className={styles.orbit} />
      <div className={styles.orbitSmall} />


      {/* Floating Coins */}

      <motion.div
        className={styles.floatCoinOne}
        animate={{
          y: [0, -12, 0],
          rotate: [0, 8, 0],
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
          y: [0, 12, 0],
          rotate: [0, -10, 0],
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
          y: [0, -10, 0],
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


      {/* Confetti */}

      <span className={styles.confettiOne} />
      <span className={styles.confettiTwo} />
      <span className={styles.confettiThree} />
      <span className={styles.confettiFour} />
      <span className={styles.confettiFive} />


      {/* Gift Box */}

      <motion.div
        className={styles.giftScene}
        initial={{
          opacity: 0,
          scale: 0.8,
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

        {/* Bottom purple box */}

        <div className={styles.giftBox}>

          <div className={styles.boxFront} />

          <div className={styles.boxSide} />

          <div className={styles.boxTop} />

          <div className={styles.ribbonVertical} />

          <div className={styles.ribbonHorizontal} />

        </div>


        {/* Main Coin */}

        <motion.div
          className={styles.mainCoin}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className={styles.mainCoinInner}>
            VE
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

      {/* Background Effects */}

      <div className={styles.backgroundGlowOne} />

      <div className={styles.backgroundGlowTwo} />

      <div className={styles.gridPattern} />


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

          Referral Rewards Program

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

          Refer &

          <span>
            Earn
          </span>

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

          Invite friends, complete milestones and unlock
          exciting rewards together. The more your friends
          engage, the more you earn.

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

              <strong>
                500
              </strong>

              <span>
                Per Successful Referral
              </span>

            </div>

          </div>


          <div className={styles.statDivider} />


          <div className={styles.rewardStat}>

            <div className={styles.statUsers}>
              <Users size={22} />
            </div>

            <div>

              <strong>
                10%
              </strong>

              <span>
                Lifetime Bonus
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

            Share Your Link

            <span>→</span>

          </button>


          <button
            className={styles.secondaryButton}
            onClick={scrollToRules}
          >

            <Play size={17} />

            How it works?

            <span>→</span>

          </button>

        </motion.div>

      </div>


      {/* RIGHT VISUAL */}

      <RewardVisual />

    </section>

  );

}


export default Hero;