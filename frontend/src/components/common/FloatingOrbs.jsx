import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './FloatingOrbs.module.css';

const ORBS = [
  {
    size: 320,
    top: '-8%',
    left: '-8%',
    color: '#6C5CE7',
    speed: 0.25,
    opacity: 0.28,
  },
  {
    size: 260,
    top: '35%',
    left: '82%',
    color: '#00D9B5',
    speed: -0.18,
    opacity: 0.2,
  },
  {
    size: 240,
    top: '78%',
    left: '8%',
    color: '#FFB020',
    speed: 0.15,
    opacity: 0.16,
  },
  {
    size: 220,
    top: '5%',
    left: '70%',
    color: '#6C5CE7',
    speed: -0.2,
    opacity: 0.18,
  },
];

function Orb({ orb }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100 * orb.speed]
  );

  return (
    <motion.div
      ref={ref}
      className={styles.orb}
      style={{
        width: orb.size,
        height: orb.size,
        top: orb.top,
        left: orb.left,
        opacity: orb.opacity,
        y,
        background: `
          radial-gradient(
            circle at 35% 30%,
            ${orb.color},
            transparent 70%
          )
        `,
      }}
    />
  );
}

function FloatingOrbs() {
  return (
    <div
      className={styles.orbLayer}
      aria-hidden="true"
    >
      {ORBS.map((orb, index) => (
        <Orb
          key={index}
          orb={orb}
        />
      ))}
    </div>
  );
}

export default FloatingOrbs;