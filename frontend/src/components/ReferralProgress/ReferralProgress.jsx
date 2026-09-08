import { useEffect, useState } from 'react';

import {
  motion,
} from 'framer-motion';

import {
  Trophy,
  Target,
  Megaphone,
  Sparkles,
  ArrowUpRight,
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

  const currentReferral = referrals.reduce(
    (highest, referral) => {
      if (!highest) return referral;

      return Number(referral.taskCount) >
        Number(highest.taskCount)
        ? referral
        : highest;
    },
    null
  );

  const current =
    Number(currentReferral?.taskCount) || 0;

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
      <motion.section
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CoinScatterBackground />

        <div className={styles.loadingGlow} />

        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconBadge}>
              <Target size={22} />
            </div>

            <div>
              <span className={styles.eyebrow}>
                REFERRAL JOURNEY
              </span>

              <h3 className={styles.title}>
                Next Milestone
              </h3>

              <p className={styles.subtitle}>
                Loading your progress...
              </p>
            </div>
          </div>
        </div>

        <div className={styles.loadingContent}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonBar} />
          <div className={styles.skeletonBottom} />
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CoinScatterBackground />

        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconBadge}>
              <Target size={22} />
            </div>

            <div>
              <span className={styles.eyebrow}>
                REFERRAL JOURNEY
              </span>

              <h3 className={styles.title}>
                Next Milestone
              </h3>

              <p className={styles.subtitle}>
                {error}
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
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

      {/* Decorative elements */}
      <div className={styles.panelGlow} />
      <div className={styles.gridPattern} />

      {/* Floating Megaphone */}
      <motion.div
        className={styles.megaphoneWrap}
        animate={{
          y: [0, -4, 0],
          rotate: [0, -4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Megaphone size={21} />

        <motion.span
          className={styles.pulseRing}
          animate={{
            scale: [1, 1.6],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Header */}
      <div className={styles.header}>

        <div className={styles.titleGroup}>

          <div className={styles.iconBadge}>
            <Target size={22} />
          </div>

          <div>
            <span className={styles.eyebrow}>
              REFERRAL JOURNEY
            </span>

            <div className={styles.headingRow}>
              <h3 className={styles.title}>
                Next Milestone
              </h3>

              <Sparkles
                size={16}
                className={styles.sparkle}
              />
            </div>

            <p className={styles.subtitle}>
              {nextMilestone
                ? `${remaining} more tasks to unlock your next reward`
                : 'Amazing! You have completed every milestone.'}
            </p>
          </div>

        </div>

        {nextMilestone && (
          <motion.div
            className={styles.rewardChip}
            whileHover={{
              scale: 1.04,
              y: -2,
            }}
          >
            <div className={styles.trophyIcon}>
              <Trophy size={15} />
            </div>

            <div>
              <span className={styles.rewardLabel}>
                NEXT REWARD
              </span>

              <span className={styles.rewardTitle}>
                {nextMilestone.title}
              </span>
            </div>

            <ArrowUpRight size={15} />
          </motion.div>
        )}

      </div>

      {/* Main Progress Card */}
      <div className={styles.progressCard}>

        <div className={styles.progressTop}>

          <div>
            <span className={styles.progressLabel}>
              YOUR PROGRESS
            </span>

            <div className={styles.taskCount}>
              <span className={styles.countNumber}>
                {current}
              </span>

              <span className={styles.countText}>
                / {target} tasks completed
              </span>
            </div>
          </div>

          <div className={styles.percentCircle}>
            <span>{percent}%</span>
          </div>

        </div>

        <div className={styles.progressBarWrapper}>

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
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className={styles.barShine} />
            </motion.div>

          </div>

        </div>

        <div className={styles.progressFooter}>

          <div className={styles.footerItem}>
            <Target size={15} />

            <span>
              {remaining > 0
                ? `${remaining} tasks remaining`
                : 'Milestone completed'}
            </span>
          </div>

          <div className={styles.percentBadge}>
            <span className={styles.statusDot} />
            {percent}% Complete
          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default ReferralProgress;