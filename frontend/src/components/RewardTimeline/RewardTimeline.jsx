import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import {
  UserPlus,
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  Flag,
} from 'lucide-react';

import API from '../../utils/api';

import FloatingOrbs from '../common/FloatingOrbs';
import CoinScatterBackground from '../common/CoinScatterBackground';

import styles from './RewardTimeline.module.css';


function RewardTimeline() {

  const [referrals, setReferrals] =
    useState([]);

  const [rewards, setRewards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  /* ========================================
     Fetch Timeline Data
  ======================================== */

  const fetchTimelineData = async () => {

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
        'Failed to load reward timeline:',
        err.response?.data || err.message
      );


      setError(
        'Failed to load reward journey'
      );


    } finally {

      setLoading(false);

    }

  };


  /* ========================================
     Initial Fetch + Live Refresh
  ======================================== */

  useEffect(() => {

    fetchTimelineData();


    const handleDataUpdate = () => {

      fetchTimelineData();

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
     Current Highest Progress
  ======================================== */

  const current = referrals.reduce(
    (highest, referral) => {

      return Math.max(
        highest,
        Number(referral.taskCount) || 0
      );

    },
    0
  );


  /* ========================================
     Milestone Rewards
  ======================================== */

  const milestoneRewards = rewards
    .filter(
      (reward) =>
        Number(reward.requiredTasks) > 0
    )
    .sort(
      (a, b) =>
        Number(a.requiredTasks) -
        Number(b.requiredTasks)
    );


  /* ========================================
     Timeline Steps
  ======================================== */

  const steps = [

    {
      id: 'start',
      title: 'Registration',
      desc:
        'You joined the referral program and started your reward journey.',
      achieved: true,
      isStart: true,
      requiredTasks: 0,
    },


    ...milestoneRewards.map(
      (reward) => ({

        id:
          reward.id ||
          reward._id ||
          reward.title,

        title:
          reward.title,

        desc:
          reward.condition ||
          'Complete referral tasks to unlock this reward.',

        achieved:
          current >=
          Number(reward.requiredTasks),

        requiredTasks:
          Number(reward.requiredTasks),

      })
    ),

  ];


  const achievedSteps =
    steps.filter(
      (step) => step.achieved
    ).length;


  const progressPercent =
    steps.length > 1
      ? Math.min(
          100,
          Math.round(
            (
              (achievedSteps - 1) /
              (steps.length - 1)
            ) * 100
          )
        )
      : 0;


  /* ========================================
     Loading State
  ======================================== */

  if (loading) {

    return (

      <motion.section
        className={styles.panel}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >

        <CoinScatterBackground />
        <FloatingOrbs />


        <div className={styles.loadingShimmer} />


        <div className={styles.header}>

          <div className={styles.headerBadge}>
            <Trophy size={18} />
          </div>


          <h2 className={styles.title}>
            Your Reward Journey
          </h2>


          <p className={styles.subtitle}>
            Loading your reward milestones...
          </p>

        </div>


        <div className={styles.loadingTimeline}>

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className={styles.loadingItem}
            >

              <div
                className={styles.loadingNode}
              />

              <div
                className={styles.loadingContent}
              >

                <div
                  className={styles.loadingLineLarge}
                />

                <div
                  className={styles.loadingLineSmall}
                />

              </div>

            </div>

          ))}

        </div>

      </motion.section>

    );

  }


  /* ========================================
     Error State
  ======================================== */

  if (error) {

    return (

      <section className={styles.panel}>

        <CoinScatterBackground />
        <FloatingOrbs />


        <div className={styles.emptyState}>

          <div className={styles.emptyIcon}>
            <Trophy size={28} />
          </div>


          <h3>
            Unable to load journey
          </h3>


          <p>
            {error}
          </p>

        </div>

      </section>

    );

  }


  /* ========================================
     Main Render
  ======================================== */

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
      <FloatingOrbs />


      {/* Decorative Glow */}

      <div
        className={styles.topGlow}
      />


      <div
        className={styles.bottomGlow}
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

        <div className={styles.headerBadge}>

          <Trophy size={19} />

        </div>


        <div className={styles.headingRow}>

          <h2 className={styles.title}>
            Your Reward Journey
          </h2>

          <Sparkles
            size={17}
            className={styles.sparkle}
          />

        </div>


        <p className={styles.subtitle}>
          Every referral brings you closer to
          unlocking your next reward
        </p>


        <div className={styles.overallProgress}>

          <span>
            Journey Progress
          </span>


          <strong>
            {progressPercent}%
          </strong>

        </div>

      </motion.div>


      {/* Timeline */}

      <div className={styles.timeline}>


        {/* Background Track */}

        <div
          className={styles.trackBg}
        />


        {/* Active Track */}

        <motion.div
          className={styles.trackFill}
          initial={{
            scaleY: 0,
          }}
          whileInView={{
            scaleY:
              progressPercent / 100,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.4,
            ease:
              [0.22, 1, 0.36, 1],
          }}
          style={{
            transformOrigin:
              'top',
          }}
        />


        {/* Steps */}

        {steps.map(
          (step, index) => {

            const isAchieved =
              step.achieved;


            const isCurrent =
              !isAchieved &&
              index ===
                steps.findIndex(
                  (item) =>
                    !item.achieved
                );


            return (

              <motion.div
                key={step.id}
                className={`${styles.step} ${
                  isAchieved
                    ? styles.stepAchieved
                    : ''
                } ${
                  isCurrent
                    ? styles.stepCurrent
                    : ''
                }`}
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
                  delay:
                    index * 0.1,
                }}
              >


                {/* Node */}

                <motion.div
                  className={`${styles.node} ${
                    isAchieved
                      ? styles.nodeAchieved
                      : ''
                  } ${
                    isCurrent
                      ? styles.nodeCurrent
                      : ''
                  }`}
                  whileHover={{
                    scale: 1.08,
                  }}
                >

                  {isAchieved ? (

                    <CheckCircle2
                      size={19}
                    />

                  ) : step.isStart ? (

                    <UserPlus
                      size={18}
                    />

                  ) : (

                    <Lock
                      size={17}
                    />

                  )}


                  {isCurrent && (

                    <motion.span
                      className={
                        styles.nodePulse
                      }
                      animate={{
                        scale:
                          [1, 1.8],
                        opacity:
                          [0.6, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat:
                          Infinity,
                      }}
                    />

                  )}

                </motion.div>


                {/* Card */}

                <motion.div
                  className={`${styles.contentCard} ${
                    isAchieved
                      ? styles.contentAchieved
                      : ''
                  } ${
                    isCurrent
                      ? styles.contentCurrent
                      : ''
                  }`}
                  whileHover={{
                    y: -4,
                  }}
                >

                  <div
                    className={
                      styles.cardTop
                    }
                  >

                    <div>

                      <div
                        className={
                          styles.titleRow
                        }
                      >

                        <h4
                          className={
                            styles.stepTitle
                          }
                        >
                          {step.title}
                        </h4>


                        {isAchieved && (

                          <span
                            className={
                              styles.completedBadge
                            }
                          >
                            Completed
                          </span>

                        )}


                        {isCurrent && (

                          <span
                            className={
                              styles.currentBadge
                            }
                          >
                            Next Reward
                          </span>

                        )}

                      </div>


                      <p
                        className={
                          styles.stepDesc
                        }
                      >
                        {step.desc}
                      </p>

                    </div>


                    {!step.isStart && (

                      <div
                        className={
                          styles.rewardIcon
                        }
                      >

                        <Trophy
                          size={18}
                        />

                      </div>

                    )}

                  </div>


                  {!step.isStart && (

                    <div
                      className={
                        styles.requirement
                      }
                    >

                      <Flag size={14} />

                      <span>
                        {step.requiredTasks} tasks required
                      </span>

                    </div>

                  )}

                </motion.div>

              </motion.div>

            );

          }
        )}

      </div>


      {/* Footer Progress */}

      <div
        className={styles.journeyFooter}
      >

        <div>

          <span
            className={
              styles.footerLabel
            }
          >
            Current Progress
          </span>


          <strong>
            {current} tasks completed
          </strong>

        </div>


        <div
          className={
            styles.footerAchievement
          }
        >

          <Trophy size={15} />

          <span>
            {achievedSteps} / {steps.length}
            {' '} milestones
          </span>

        </div>

      </div>

    </motion.section>

  );

}


export default RewardTimeline;