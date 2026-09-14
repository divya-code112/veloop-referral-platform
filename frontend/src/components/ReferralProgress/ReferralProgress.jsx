import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
} from 'framer-motion';

import {
  Star,
  Coins,
  Rocket,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import API from '../../utils/api';

import styles from './ReferralProgress.module.css';


function ReferralProgress() {

   const navigate = useNavigate();

  const [referrals, setReferrals] =
    useState([]);

  const [rewards, setRewards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  /* ========================================
     FETCH DATA
  ======================================== */

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


  /* ========================================
     INITIAL FETCH
  ======================================== */

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


  /* ========================================
     CALCULATE PROGRESS
  ======================================== */

  const currentReferral =
    referrals.reduce(
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


  const taskRewards =
    rewards
      .filter(
        (reward) =>
          Number(reward.requiredTasks) > 0
      )
      .sort(
        (a, b) =>
          Number(a.requiredTasks) -
          Number(b.requiredTasks)
      );


  const nextMilestone =
    taskRewards.find(
      (reward) =>
        Number(reward.requiredTasks) > current
    );


  let remaining = 0;


  if (nextMilestone) {

    remaining =
      Math.max(
        0,
        Number(nextMilestone.requiredTasks) -
        current
      );

  }


  /* ========================================
     LEVEL SYSTEM
  ======================================== */

  const level =
    Math.max(
      1,
      Math.floor(current / 5) + 1
    );


  const previousLevelXP =
    (level - 1) * 5;


  const nextLevelXP =
    level * 5;


  const levelProgress =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (
            (current - previousLevelXP) /
            (nextLevelXP - previousLevelXP)
          ) * 100
        )
      )
    );


  const xpRemaining =
    Math.max(
      0,
      nextLevelXP - current
    );


  /* ========================================
     NEXT REWARD VALUE
  ======================================== */

  const rewardAmount =
    nextMilestone?.rewardAmount ||
    nextMilestone?.amount ||
    nextMilestone?.reward ||
    500;


  const rewardUnit =
    nextMilestone?.rewardUnit ||
    nextMilestone?.currency ||
    'VEs';


  /* ========================================
     VIEW ALL TASKS
  ======================================== */

const handleViewAllTasks = () => {

  navigate('/tasks');

};


  /* ========================================
     LOADING STATE
  ======================================== */

  if (loading) {

    return (

      <section className={styles.panel}>

        <div className={styles.header}>

          <h3 className={styles.sectionTitle}>
            Your Referral Progress
          </h3>

        </div>


        <div className={styles.loadingGrid}>

          <div className={styles.skeletonCard} />

          <div className={styles.skeletonCard} />

        </div>

      </section>

    );

  }


  /* ========================================
     ERROR STATE
  ======================================== */

  if (error) {

    return (

      <section className={styles.panel}>

        <div className={styles.header}>

          <h3 className={styles.sectionTitle}>
            Your Referral Progress
          </h3>

        </div>


        <div className={styles.errorState}>

          {error}

        </div>

      </section>

    );

  }


  return (

    <motion.section
      className={styles.panel}

      initial={{
        opacity: 0,
        y: 20,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
        margin: '-50px',
      }}

      transition={{
        duration: 0.5,
      }}
    >


      {/* HEADER */}

      <div className={styles.header}>


        <div className={styles.headerText}>

          <h3 className={styles.sectionTitle}>
            Your Referral Progress
          </h3>

          <p className={styles.sectionSubtitle}>
            Keep referring and unlock bigger rewards.
          </p>

        </div>


        <div className={styles.headerActions}>


          <div className={styles.progressBadge}>

            <Sparkles size={15} />

            <span>
              Level {level}
            </span>

          </div>


          <motion.button
            type="button"

            className={styles.viewAllButton}

            onClick={handleViewAllTasks}

            whileHover={{
              y: -2,
            }}

            whileTap={{
              scale: 0.96,
            }}
          >

            <span>
              View All
            </span>

            <ArrowRight size={15} />

          </motion.button>


        </div>

      </div>


      {/* PROGRESS GRID */}

      <div className={styles.progressGrid}>


        {/* LEVEL CARD */}

        <motion.div
          className={styles.levelCard}

          whileHover={{
            y: -4,
          }}
        >

          <div className={styles.levelGlow} />


          <div className={styles.levelIcon}>

            <div className={styles.iconGlow} />

            <Star
              size={42}
              strokeWidth={2}
              fill="currentColor"
            />

          </div>


          <div className={styles.levelContent}>


            <div className={styles.levelTop}>


              <div>

                <span className={styles.levelLabel}>
                  CURRENT LEVEL
                </span>

                <h4 className={styles.levelTitle}>
                  Level {level}
                </h4>

              </div>


              <div className={styles.xpBadge}>

                <Rocket size={15} />

                XP

              </div>

            </div>


            <div className={styles.xpText}>

              <strong>
                {current}
              </strong>

              <span>
                {' '}
                / {nextLevelXP} XP
              </span>

            </div>


            <div className={styles.progressTrack}>

              <motion.div
                className={styles.progressFill}

                initial={{
                  width: 0,
                }}

                whileInView={{
                  width:
                    `${levelProgress}%`,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  duration: 1.1,
                  ease:
                    [0.22, 1, 0.36, 1],
                }}
              >

                <div
                  className={styles.progressShine}
                />

              </motion.div>

            </div>


            <div className={styles.nextLevel}>

              <span>
                Next Level
              </span>

              <strong>
                {xpRemaining} XP to Level {level + 1}
              </strong>

            </div>


          </div>

        </motion.div>


        {/* REWARD CARD */}

        <motion.div
          className={styles.rewardCard}

          whileHover={{
            y: -4,
          }}
        >

          <div className={styles.rewardGlow} />


          <div className={styles.rewardContent}>


            <div className={styles.rewardHeading}>

              <Sparkles size={18} />

              <h4>
                Keep going!
              </h4>

            </div>


            <p>
              Invite more friends and earn
              bigger rewards.
            </p>


            <div className={styles.rewardAmount}>

              <Coins size={18} />

              <span>
                +{rewardAmount} {rewardUnit}
              </span>

            </div>


            {remaining > 0 && (

              <div
                className={
                  styles.rewardProgressText
                }
              >

                {remaining} more referrals
                to unlock your next reward

              </div>

            )}

          </div>


          <div className={styles.coinStack}>


            <motion.div
              className={
                `${styles.coin} ${styles.coinBack}`
              }

              animate={{
                y: [0, -5, 0],
              }}

              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              VE
            </motion.div>


            <motion.div
              className={
                `${styles.coin} ${styles.coinMiddle}`
              }

              animate={{
                y: [0, -7, 0],
              }}

              transition={{
                duration: 3.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            >
              VE
            </motion.div>


            <motion.div
              className={
                `${styles.coin} ${styles.coinFront}`
              }

              animate={{
                y: [0, -5, 0],
              }}

              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
            >
              VE
            </motion.div>


          </div>

        </motion.div>


      </div>

    </motion.section>

  );

}


export default ReferralProgress;