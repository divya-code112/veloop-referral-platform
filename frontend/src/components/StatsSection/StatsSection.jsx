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
      Math.round(latest).toLocaleString(
        'en-IN'
      )
  );

  const [display, setDisplay] =
    useState('0');


  useEffect(() => {
    if (!isInView) return;

    const controls = animate(
      motionValue,
      Number(value) || 0,
      {
        duration: 1.2,
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


  /* ========================================
     Initial Fetch + Live Refresh
  ======================================== */

  useEffect(() => {

    fetchStatistics();


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


  /* ========================================
     Check Real Empty State
  ======================================== */

  const totalReferrals =
    statistics.find(
      (stat) => stat.id === 'total'
    )?.value || 0;


  const hasNoReferrals =
    !loading &&
    !error &&
    Number(totalReferrals) === 0;


  /* ========================================
     Render
  ======================================== */

  return (

    <section className={styles.panel}>

      {/* Background Decoration */}
      <CoinScatterBackground />


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


      {/* Header */}

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

      </motion.div>


      {/* Loading State */}

      {loading ? (

        <div className={styles.stateCard}>

          <div className={styles.stateValue}>
            Loading...
          </div>


          <div className={styles.stateLabel}>
            Loading referral statistics
          </div>

        </div>


      ) : error ? (

        /* Error State */

        <div className={styles.stateCard}>

          <div className={styles.stateValue}>
            Unable to load
          </div>


          <div className={styles.stateLabel}>
            {error}
          </div>

        </div>


      ) : hasNoReferrals ? (

        /* Empty State */

        <EmptyState
          title="No referrals yet"
          description="Share your referral link with friends to start tracking your stats here."
          actionLabel="Copy Referral Link"
        />


      ) : (

        /* Statistics */

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