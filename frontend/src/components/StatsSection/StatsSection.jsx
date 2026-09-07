import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';

import {
  Users,
  CheckCircle2,
  Clock,
  Coins,
  Zap,
  Gem,
  Eye,
  EyeOff,
} from 'lucide-react';

import API from '../../utils/api';

import FloatingOrbs from '../common/FloatingOrbs';
import FloatingRewardIcons from '../common/FloatingRewardIcons';
import EmptyState from '../common/EmptyState';
import CoinScatterBackground from '../common/CoinScatterBackground';

import styles from './StatsSection.module.css';

const ICONS = {
  total: Users,
  success: CheckCircle2,
  pending: Clock,
  earnings: Coins,
  xp: Zap,
  gems: Gem,
};

const ACCENTS = {
  total: 'indigo',
  success: 'emerald',
  pending: 'amber',
  earnings: 'gold',
  xp: 'teal',
  gems: 'rose',
};

function Counter({ value }) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: '-40px',
  });

  const motionVal = useMotionValue(0);

  const rounded = useTransform(
    motionVal,
    (latest) =>
      Math.round(latest).toLocaleString(
        'en-IN'
      )
  );

  const [display, setDisplay] =
    useState('0');

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(
      motionVal,
      Number(value) || 0,
      {
        duration: 1.2,
        ease: 'easeOut',
      }
    );

    const unsubscribe = rounded.on(
      'change',
      (v) => {
        setDisplay(v);
      }
    );

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [
    isInView,
    value,
    motionVal,
    rounded,
  ]);

  return (
    <span ref={ref}>
      {display}
    </span>
  );
}

function StatBar({ stat, index }) {
  const Icon = ICONS[stat.id];

  const accent =
    ACCENTS[stat.id];

  if (!Icon) return null;

  return (
    <motion.div
      className={`${styles.card} ${styles[accent]}`}
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-40px',
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
      }}
    >
      <div className={styles.iconWrap}>
        <Icon size={20} />
      </div>

      <div className={styles.textCol}>

        <div className={styles.value}>
          <Counter value={stat.value} />

          {stat.unit && (
            <span className={styles.unit}>
              {' '}
              {stat.unit}
            </span>
          )}
        </div>

        <div className={styles.label}>
          {stat.label}
        </div>

      </div>

    </motion.div>
  );
}

function StatsSection() {
  const [showEmpty, setShowEmpty] =
    useState(false);

  const [statistics, setStatistics] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get(
        '/referrals/stats'
      );

      console.log(
        'Referral statistics:',
        response.data
      );

      const data =
        response.data.statistics || {};

      const formattedStatistics = [

        {
          id: 'total',
          value:
            data.totalReferrals || 0,
          label:
            'Total Referrals',
        },

        {
          id: 'success',
          value:
            data.successfulReferrals || 0,
          label:
            'Successful Referrals',
        },

        {
          id: 'pending',
          value:
            data.pendingReferrals || 0,
          label:
            'Pending Referrals',
        },

        {
          id: 'earnings',
          value:
            data.totalRewardsEarned || 0,
          unit:
            data.earningsUnit || 'SVE',
          label:
            'SVE Earned',
        },

        {
          id: 'xp',
          value:
            data.totalXPEarned || 0,
          unit:
            'XP',
          label:
            'Total XP',
        },

        {
          id: 'gems',
          value:
            data.totalGemsEarned || 0,
          unit:
            'Gems',
          label:
            'Gems Earned',
        },

      ];

      setStatistics(
        formattedStatistics
      );

    } catch (err) {
      console.error(
        'Failed to load referral statistics:',
        err.response?.data ||
        err.message
      );

      setError(
        'Failed to load referral statistics'
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();

    /*
     * IMPORTANT:
     * Listen to the same global event
     * dispatched by TaskModal.
     */
    const handleDataUpdate = () => {
      console.log(
        'Refreshing referral statistics...'
      );

      fetchStatistics();
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

  return (
    <div className={styles.panel}>

      <CoinScatterBackground />

      <FloatingOrbs />

      <FloatingRewardIcons
        items={[
          {
            type: 'coin',
            top: '5%',
            left: '6%',
            size: 44,
            delay: 0.2,
            duration: 4.5,
          },
          {
            type: 'diamond',
            top: '12%',
            left: '90%',
            size: 40,
            delay: 0.5,
            duration: 5,
          },
          {
            type: 'bitcoin',
            top: '70%',
            left: '4%',
            size: 38,
            delay: 0.4,
            duration: 4.8,
          },
          {
            type: 'coin',
            top: '80%',
            left: '92%',
            size: 36,
            delay: 0.7,
            duration: 5.2,
          },
        ]}
      />

      <motion.div
        className={styles.header}
        initial={{
          opacity: 0,
          y: 16,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <h2 className={styles.title}>
          Your Referral Stats
        </h2>

        <p className={styles.subtitle}>
          Track every milestone of your referral journey
        </p>

        <button
          className={styles.demoToggle}
          onClick={() =>
            setShowEmpty(
              (value) => !value
            )
          }
        >
          {showEmpty ? (
            <Eye size={14} />
          ) : (
            <EyeOff size={14} />
          )}

          {showEmpty
            ? 'Show live data'
            : 'Preview empty state'}
        </button>

      </motion.div>

      {showEmpty ? (

        <EmptyState
          title="No referrals yet"
          description="Share your referral link with friends to start tracking your stats here."
          actionLabel="Copy Referral Link"
        />

      ) : loading ? (

        <div className={styles.bar}>
          <div className={styles.card}>
            <div className={styles.textCol}>

              <div className={styles.value}>
                Loading...
              </div>

              <div className={styles.label}>
                Loading referral statistics
              </div>

            </div>
          </div>
        </div>

      ) : error ? (

        <div className={styles.bar}>
          <div className={styles.card}>
            <div className={styles.textCol}>

              <div className={styles.value}>
                Unable to load
              </div>

              <div className={styles.label}>
                {error}
              </div>

            </div>
          </div>
        </div>

      ) : (

        <div className={styles.bar}>

          {statistics.map(
            (stat, index) => (
              <StatBar
                key={`${stat.id}-${stat.value}`}
                stat={stat}
                index={index}
              />
            )
          )}

        </div>

      )}

    </div>
  );
}

export default StatsSection;