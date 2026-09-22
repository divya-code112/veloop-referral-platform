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
  UsersRound,
  CircleCheck,
  CircleDollarSign,
  Gift,
} from 'lucide-react';

import API from '../../utils/api';

import EmptyState from '../common/EmptyState';

import styles from './StatsSection.module.css';


const ICONS = {
  total: UsersRound,
  active: CircleCheck,
  earnings: CircleDollarSign,
  rewards: Gift,
};


const ACCENTS = {
  total: 'purple',
  active: 'blue',
  earnings: 'gold',
  rewards: 'green',
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
   Individual Statistic
======================================== */

function StatCard({ stat, index }) {

  const Icon = ICONS[stat.id];
  const accent = ACCENTS[stat.id];


  if (!Icon) return null;


  return (

    <motion.div
      className={`${styles.statItem} ${styles[accent]}`}

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
        duration: 0.45,
        delay: index * 0.08,
        ease: 'easeOut',
      }}

      whileHover={{
        y: -3,
      }}
    >

      {/* Large Premium Icon */}

      <div className={styles.iconWrap}>

        <div className={styles.iconGlow} />

        <Icon
          size={42}
          strokeWidth={2.15}
        />

      </div>


      {/* Value */}

      <div className={styles.value}>

        <Counter value={stat.value} />

        {stat.unit && (

          <span className={styles.unit}>
            {stat.unit}
          </span>

        )}

      </div>


      {/* Label */}

      <div className={styles.label}>
        {stat.label}
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
          id: 'active',

          value:
            data.successfulReferrals || 0,

          label:
            'Active Referrals',
        },


        {
          id: 'earnings',

          value:
            data.totalRewardsEarned || 0,

          unit:
            data.earningsUnit || 'VE',

          label:
            'Total VEs Earned',
        },


        {
          id: 'rewards',

          value:
            data.rewardsEarned ||
            data.totalRewardsClaimed ||
            data.rewardCount ||
            0,

          label:
            'Rewards Earned',
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
     Empty State Check
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


      {/* Header */}

      <motion.div
        className={styles.header}

        initial={{
          opacity: 0,
          y: 15,
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
          Your Referral Statistics
        </h2>

        <p className={styles.subtitle}>
          Track your referral activity,
          earnings and rewards.
        </p>

      </motion.div>


      {/* Loading */}

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

        <div className={styles.statisticsBar}>

          {statistics.map(
            (stat, index) => (

              <StatCard
                key={stat.id}
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