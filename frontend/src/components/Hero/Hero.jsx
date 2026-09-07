import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import styles from './Hero.module.css';

function BitcoinIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient
          id="btcGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFE7A8" />
          <stop offset="50%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#E8850A" />
        </linearGradient>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="46"
        fill="url(#btcGrad)"
        stroke="#FFF1CC"
        strokeWidth="3"
      />

      <circle
        cx="50"
        cy="50"
        r="37"
        fill="none"
        stroke="#FFF3D6"
        strokeWidth="2"
        opacity="0.55"
      />

      <text
        x="50"
        y="65"
        fontSize="42"
        fontWeight="900"
        fill="#9B5A00"
        textAnchor="middle"
        fontFamily="Georgia, serif"
      >
        &#8383;
      </text>
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient
          id="diaTop"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#D9F2FF" />
          <stop offset="100%" stopColor="#5FA8E8" />
        </linearGradient>

        <linearGradient
          id="diaBody"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8FD2FF" />
          <stop offset="100%" stopColor="#2E6FB8" />
        </linearGradient>
      </defs>

      <polygon
        points="18,32 82,32 50,90"
        fill="url(#diaBody)"
        stroke="#1A4A80"
        strokeWidth="1.5"
      />

      <polygon
        points="18,32 50,10 82,32"
        fill="url(#diaTop)"
        stroke="#1A4A80"
        strokeWidth="1.5"
      />

      <polygon
        points="18,32 50,32 50,10"
        fill="#FFFFFF"
        opacity="0.4"
      />

      <line
        x1="18"
        y1="32"
        x2="82"
        y2="32"
        stroke="#1A4A80"
        strokeWidth="1"
        opacity="0.6"
      />

      <line
        x1="50"
        y1="32"
        x2="50"
        y2="90"
        stroke="#1A4A80"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient
          id="coinGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFF0B8" />
          <stop offset="55%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#C9820A" />
        </linearGradient>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#coinGrad)"
        stroke="#FFF6DC"
        strokeWidth="2.5"
      />

      <circle
        cx="50"
        cy="50"
        r="33"
        fill="none"
        stroke="#FFF3D6"
        strokeWidth="1.5"
        opacity="0.55"
      />

      <text
        x="50"
        y="61"
        fontSize="32"
        fontWeight="800"
        fill="#8A5A00"
        textAnchor="middle"
        fontFamily="Sora, sans-serif"
      >
        $
      </text>
    </svg>
  );
}

const ICON_MAP = {
  bitcoin: BitcoinIcon,
  diamond: DiamondIcon,
  coin: CoinIcon,
};

function FloatingIcon({
  type,
  top,
  left,
  size,
  delay,
  duration,
  rotate,
}) {
  const IconComp = ICON_MAP[type];

  return (
    <motion.div
      className={styles.floatIcon}
      style={{
        top,
        left,
        width: size,
        height: size,
      }}
      initial={{
        opacity: 0,
        scale: 0.7,
      }}
      animate={{
        opacity: [0, 0.28, 0.22],
        y: [0, -16, 0],
        rotate: [0, rotate, 0],
        scale: [1, 1.05, 1],
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
        scale: {
          duration: duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      }}
    >
      <IconComp />
    </motion.div>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      {/* Decorative Background */}
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />
      <div className={styles.grid} />

      {/* Floating Reward Icons */}
      <div
        className={styles.iconLayer}
        aria-hidden="true"
      >
        <FloatingIcon
          type="coin"
          top="4%"
          left="6%"
          size={52}
          delay={0.2}
          duration={4.5}
          rotate={8}
        />

        <FloatingIcon
          type="diamond"
          top="8%"
          left="84%"
          size={58}
          delay={0.5}
          duration={5}
          rotate={-10}
        />

        <FloatingIcon
          type="bitcoin"
          top="52%"
          left="1%"
          size={50}
          delay={0.3}
          duration={4.8}
          rotate={8}
        />

        <FloatingIcon
          type="coin"
          top="58%"
          left="91%"
          size={44}
          delay={0.8}
          duration={5.3}
          rotate={-6}
        />

        <FloatingIcon
          type="bitcoin"
          top="88%"
          left="18%"
          size={42}
          delay={0.6}
          duration={4.2}
          rotate={10}
        />

        <FloatingIcon
          type="diamond"
          top="86%"
          left="74%"
          size={46}
          delay={0.9}
          duration={4.6}
          rotate={-8}
        />
      </div>

      {/* Badge */}
      <motion.div
        className={styles.badge}
        initial={{
          opacity: 0,
          y: -12,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.55,
          ease: 'easeOut',
        }}
      >
        <span className={styles.badgeIcon}>
          <Gift size={15} />
        </span>

        <span>Referral Rewards Program</span>

        <Sparkles
          size={14}
          className={styles.sparkle}
        />
      </motion.div>

      {/* Heading */}
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
          ease: 'easeOut',
        }}
      >
        Invite Friends,
        <br />

        <span className={styles.titleGradient}>
          Earn Together
        </span>
      </motion.h1>

      {/* Subtitle */}
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
          ease: 'easeOut',
        }}
      >
        Share your referral code with friends and unlock
        exciting rewards as they complete tasks and reach
        new milestones.
      </motion.p>

      {/* Bottom decorative line */}
      <motion.div
        className={styles.heroLine}
        initial={{
          scaleX: 0,
          opacity: 0,
        }}
        animate={{
          scaleX: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 0.45,
        }}
      />
    </section>
  );
}

export default Hero;