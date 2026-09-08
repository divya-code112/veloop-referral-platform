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
  BarChart3,
} from 'lucide-react';

import API from '../../utils/api';

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


/* ========================================
   Animated Number Counter
======================================== */

function Counter({ value }) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: '-40px',
  });

  const motionValue = useMotionValue(0);

  const rounded = useTransform(
    motionValue,
    (latest) =>
      Math.round(latest).toLocaleString('en-IN')
  );

  const [display, setDisplay] = useState('0');


  useEffect(() => {
    if (!isInView) return;

    const controls = animate(
      motionValue,
      Number(value) || 0,
      {
        duration: 1.3,
        ease: 'easeOut',
      }
    );

    const unsubscribe = rounded.on(
      'change',
      (latestValue) => {
        setDisplay(latestValue);
      }
    );

    return () => {
      controls.stop();
      unsubscribe();
    };

  }, [
    isInView,
    value,
    motionValue,
    rounded,
  ]);


  return (
    <span ref={ref}>
      {display}
    </span>
  );
}


/* ========================================
   Individual Stat Card
======================================== */

function StatCard({ stat, index }) {

  const Icon = ICONS[stat.id];
  const accent = ACCENTS[stat.id];

  if (!Icon) return null;


  return (
    <motion.div
      className={`${styles.card} ${styles[accent]}`}
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.96,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        margin: '-40px',
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -6,
      }}
    >

      {/* Decorative glow */}
      <div className={styles.cardGlow} />

      <div className={styles.cardTop}>

        <div className={styles.iconWrap}>
          <Icon size={21} strokeWidth={2.2} />
        </div>

        <div className={styles.iconDot} />

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


/* ========================================
   Main Stats Section
======================================== */

function StatsSection() {

  const [statistics, setStatistics] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  /* ========================================
     Fetch Statistics
  ======================================== */

  const fetchStatistics = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await API.get(
        '/referrals/stats'
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


  /* ========================================
     Initial Fetch + Live Refresh
  ======================================== */

  useEffect(() => {

    fetchStatistics();


    const handleDataUpdate = () => {

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


  /* ========================================
     Check Empty State
  ======================================== */

  const totalReferrals =
    statistics.find(
      (stat) => stat.id === 'total'
    )?.value || 0;


  const hasNoReferrals =
    !loading &&
    !error &&
    Number(totalReferrals) === 0;


  return (

    <section className={styles.panel}>

      {/* Decorative Background */}
      <CoinScatterBackground />


      <FloatingRewardIcons
        items={[
          {
            type: 'coin',
            top: '6%',
            left: '4%',
            size: 42,
            delay: 0.2,
            duration: 4.5,
          },

          {
            type: 'diamond',
            top: '10%',
            left: '92%',
            size: 40,
            delay: 0.5,
            duration: 5,
          },

          {
            type: 'bitcoin',
            top: '76%',
            left: '3%',
            size: 36,
            delay: 0.4,
            duration: 4.8,
          },

          {
            type: 'coin',
            top: '82%',
            left: '94%',
            size: 34,
            delay: 0.7,
            duration: 5.2,
          },
        ]}
      />


      {/* Header */}

      <motion.div
        className={styles.header}
        initial={{
          opacity: 0,
          y: 18,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.55,
        }}
      >

        <div className={styles.headerBadge}>
          <BarChart3 size={15} />
          <span>Performance Overview</span>
        </div>


        <h2 className={styles.title}>
          Your Referral
          <span> Statistics</span>
        </h2>


        <p className={styles.subtitle}>
          Keep track of your referral activity,
          rewards, and progress in one place.
        </p>

      </motion.div>


      {/* Loading State */}

      {loading ? (

        <div className={styles.stateCard}>

          <div className={styles.loader} />

          <div className={styles.stateValue}>
            Loading statistics
          </div>

          <div className={styles.stateLabel}>
            Fetching your latest referral activity...
          </div>

        </div>


      ) : error ? (

        <div className={styles.stateCard}>

          <div className={styles.stateValue}>
            Unable to load statistics
          </div>

          <div className={styles.stateLabel}>
            {error}
          </div>

        </div>


      ) : hasNoReferrals ? (

        <EmptyState
          title="No referrals yet"
          description="Share your referral link with friends to start tracking your stats here."
          actionLabel="Copy Referral Link"
        />


      ) : (

        <div className={styles.grid}>

          {statistics.map(
            (stat, index) => (

              <StatCard
                key={`${stat.id}-${stat.value}`}
                stat={stat}
                index={index}
              />

            )
          )}

        </div>

      )}

    </section>

  );

}


export default StatsSection;