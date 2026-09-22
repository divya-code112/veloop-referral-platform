import { motion } from 'framer-motion';
import { UserPlus, Sparkles } from 'lucide-react';

import styles from './EmptyState.module.css';

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <motion.div
      className={styles.wrap}
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      <div className={styles.backgroundGlow} />

      <motion.div
        className={styles.iconCircle}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <UserPlus size={27} />

        <div className={styles.iconSparkle}>
          <Sparkles size={12} />
        </div>
      </motion.div>

      <h3 className={styles.title}>
        {title}
      </h3>

      <p className={styles.desc}>
        {description}
      </p>

      {actionLabel && (
        <button
          className={styles.action}
          onClick={onAction}
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </motion.div>
  );
}

export default EmptyState;