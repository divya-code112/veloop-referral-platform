import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Megaphone,
  Sparkles,
} from 'lucide-react';

import API from '../../utils/api';

import styles from './ReferralProgress.module.css';
import CoinScatterBackground from '../common/CoinScatterBackground';

function ReferralProgress() {
  const [referrals, setReferrals] = useState([]);
  const [rewards, setRewards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        referralsResponse,
        rewardsResponse,
      ] = await Promise.all([
        API.get('/referrals'),
        API.get('/rewards'),
      ]);

      setReferrals(
        referralsResponse.data.referrals || []
      );

      setRewards(
        rewardsResponse.data.rewards || []
      );

    } catch (err) {
      console.error(
        'Failed to load referral progress:',
        err.response?.data || err.message
      );

      setError(
        'Failed to load referral progress'
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();

    const handleDataUpdate = () => {
      console.log(
        'Refreshing referral progress...'
      );

      fetchProgressData();
    };

    window.addEventListener(
      'veloopDataUpdated',
      handleDataUpdate
    );

    return () => {
      window.removeEventListener(
        'veloopDataUpdated',
        handleDataUpdate
      );
    };
  }, []);

  /*
   * Get referral with highest progress.
   */
  const currentReferral = referrals.reduce(
    (highest, referral) => {
      if (!highest) {
        return referral;
      }

      return Number(referral.taskCount) >
        Number(highest.taskCount)
        ? referral
        : highest;
    },
    null
  );

  const current =
    Number(currentReferral?.taskCount) || 0;

  /*
   * Milestone rewards only.
   */
  const taskRewards = rewards
    .filter(
      (reward) =>
        Number(reward.requiredTasks) > 0
    )
    .sort(
      (a, b) =>
        Number(a.requiredTasks) -
        Number(b.requiredTasks)
    );

  /*
   * Find next milestone.
   */
  const nextMilestone = taskRewards.find(
    (reward) =>
      Number(reward.requiredTasks) > current
  );

  let target = 0;
  let percent = 0;
  let remaining = 0;

  if (nextMilestone) {
    target = Number(
      nextMilestone.requiredTasks
    );

    percent = Math.min(
      100,
      Math.round(
        (current / target) * 100
      )
    );

    remaining = Math.max(
      0,
      target - current
    );

  } else if (taskRewards.length > 0) {
    target = Number(
      taskRewards[
        taskRewards.length - 1
      ].requiredTasks
    );

    percent = 100;
    remaining = 0;
  }

  if (loading) {
    return (
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CoinScatterBackground />

        <div className={styles.loadingShimmer} />

        <div className={styles.top}>
          <div className={styles.titleGroup}>

            <div className={styles.iconBadge}>
              <Target size={20} />
            </div>

            <div>
              <h3 className={styles.title}>
                Next Milestone
              </h3>

              <p className={styles.subtitle}>
                Loading referral progress...
              </p>
            </div>

          </div>
        </div>

        <div className={styles.barTrack}>
          <motion.div
            className={styles.loadingBar}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CoinScatterBackground />

        <div className={styles.top}>
          <div className={styles.titleGroup}>

            <div className={styles.iconBadge}>
              <Target size={20} />
            </div>

            <div>
              <h3 className={styles.title}>
                Next Milestone
              </h3>

              <p className={styles.subtitle}>
                {error}
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.panel}
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-60px',
      }}
      transition={{
        duration: 0.6,
      }}
    >
      <CoinScatterBackground />

      {/* Decorative glow */}
      <div className={styles.panelGlow} />

      {/* Animated megaphone */}
      <motion.div
        className={styles.megaphoneWrap}
        animate={{
          scale: [1, 1.12, 1],
          rotate: [0, -6, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      >
        <Megaphone size={21} />

        <motion.span
          className={styles.pulseRing}
          animate={{
            scale: [1, 1.8],
            opacity: [0.45, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'easeOut',
          }}
        />
      </motion.div>

      {/* Header */}
      <div className={styles.top}>

        <div className={styles.titleGroup}>

          <div className={styles.iconBadge}>
            <Target size={21} />
          </div>

          <div>
            <div className={styles.headingRow}>
              <h3 className={styles.title}>
                Next Milestone
              </h3>

              <Sparkles
                size={15}
                className={styles.sparkle}
              />
            </div>

            <p className={styles.subtitle}>
              {nextMilestone
                ? `${remaining} more tasks to unlock ${nextMilestone.title}`
                : 'Amazing! You have reached every milestone.'}
            </p>
          </div>

        </div>

        {nextMilestone && (
          <motion.div
            className={styles.rewardChip}
            whileHover={{
              scale: 1.04,
            }}
          >
            <Trophy size={16} />

            <span>
              {nextMilestone.title}
            </span>
          </motion.div>
        )}

      </div>

      {/* Progress Area */}
      <div className={styles.progressSection}>

        <div className={styles.progressInfo}>
          <span>Progress</span>

          <span className={styles.progressPercent}>
            {percent}%
          </span>
        </div>

        <div className={styles.barTrack}>

          <motion.div
            className={styles.barFill}
            initial={{
              width: 0,
            }}
            whileInView={{
              width: `${percent}%`,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.barShine} />
          </motion.div>

          {percent > 0 && (
            <motion.div
              className={styles.barGlowDot}
              initial={{
                left: '0%',
              }}
              whileInView={{
                left: `${percent}%`,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          )}

        </div>

      </div>

      {/* Bottom Statistics */}
      <div className={styles.bottom}>

        <div className={styles.taskCount}>
          <span className={styles.countNumber}>
            {current}
          </span>

          <span className={styles.countText}>
            of {target} tasks completed
          </span>
        </div>

        <div className={styles.percentBadge}>
          <Target size={14} />

          <span>{percent}% Complete</span>
        </div>

      </div>

    </motion.div>
  );
}

export default ReferralProgress;