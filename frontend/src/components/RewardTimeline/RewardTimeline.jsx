import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trophy } from 'lucide-react';

import API from '../../utils/api';

import FloatingOrbs from '../common/FloatingOrbs';
import CoinScatterBackground from '../common/CoinScatterBackground';
import styles from './RewardTimeline.module.css';

function RewardTimeline() {
  const [referrals, setReferrals] = useState([]);
  const [rewards, setRewards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      setError('');

      const [referralsResponse, rewardsResponse] =
        await Promise.all([
          API.get('/referrals'),
          API.get('/rewards'),
        ]);

      setReferrals(
        referralsResponse.data.referrals || []
      );

      setRewards(
        rewardsResponse.data.rewards || []
      );
    } catch (error) {
      console.error(
        'Failed to load reward timeline:',
        error.response?.data || error.message
      );

      setError('Failed to load reward journey');
    } finally {
      setLoading(false);
    }
  };

  /*
   * Find the highest Ad Watch task count
   * among the user's referrals.
   */
  const current = referrals.reduce(
    (highest, referral) => {
      return Math.max(
        highest,
        referral.taskCount || 0
      );
    },
    0
  );

  /*
   * Only rewards with a task requirement
   * appear in the timeline.
   */
  const milestoneRewards = rewards
    .filter((reward) => reward.requiredTasks > 0)
    .sort(
      (a, b) =>
        a.requiredTasks - b.requiredTasks
    );

  const steps = [
    {
      id: 'start',
      title: 'Registration',
      desc: 'You joined the referral program',
      achieved: true,
      isStart: true,
    },

    ...milestoneRewards.map((reward) => ({
      id: reward.id,
      title: reward.title,
      desc: reward.condition,
      achieved:
        current >= reward.requiredTasks,
    })),
  ];

  if (loading) {
    return (
      <div className={styles.panel}>
        <CoinScatterBackground />
        <FloatingOrbs />

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={styles.title}>
            Your Reward Journey
          </h2>

          <p className={styles.subtitle}>
            Loading your reward journey...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <CoinScatterBackground />
        <FloatingOrbs />

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={styles.title}>
            Your Reward Journey
          </h2>

          <p className={styles.subtitle}>
            {error}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <CoinScatterBackground />
      <FloatingOrbs />

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>
          Your Reward Journey
        </h2>

        <p className={styles.subtitle}>
          Every referral brings you closer to the
          next reward
        </p>
      </motion.div>

      <div className={styles.timeline}>
        <div className={styles.trackBg} />

        <motion.div
          className={styles.trackFill}
          initial={{ scaleY: 0 }}
          whileInView={{
            scaleY:
              steps.length > 0
                ? steps.filter(
                    (step) => step.achieved
                  ).length / steps.length
                : 0,
          }}
          viewport={{
            once: true,
            margin: '-100px',
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
          }}
          style={{
            transformOrigin: 'top',
          }}
        />

        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            className={styles.step}
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: '-60px',
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.12,
            }}
          >
            <div
              className={`${styles.node} ${
                step.achieved
                  ? styles.nodeAchieved
                  : ''
              }`}
            >
              {step.isStart ? (
                <UserPlus size={16} />
              ) : (
                <Trophy size={16} />
              )}
            </div>

            <div className={styles.content}>
              <h4 className={styles.stepTitle}>
                {step.title}
              </h4>

              <p className={styles.stepDesc}>
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RewardTimeline;