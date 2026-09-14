import { useEffect, useState } from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Link,
  UserPlus,
  Play,
  Gift,
  CheckCircle2,
  Lock,
  ChevronRight,
  X,
  CircleCheck,
  Users,
  Trophy,
  Sparkles,
} from 'lucide-react';

import API from '../../utils/api';

import styles from './RewardTimeline.module.css';


/* ========================================
   REWARD TIMELINE
======================================== */

function RewardTimeline() {

  const [referrals, setReferrals] =
    useState([]);

  const [rewards, setRewards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [showJourney, setShowJourney] =
    useState(false);


  /* ========================================
     FETCH DATA
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
        'Failed to load reward journey:',
        err.response?.data ||
        err.message
      );


      setError(
        'Unable to load your referral journey'
      );


    } finally {

      setLoading(false);

    }

  };


  /* ========================================
     INITIAL FETCH
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
     REFERRAL PROGRESS
  ======================================== */

  const currentTasks =
    referrals.reduce(
      (highest, referral) => {

        return Math.max(
          highest,
          Number(referral.taskCount) || 0
        );

      },
      0
    );


  /* ========================================
     DYNAMIC MILESTONE REWARDS
  ======================================== */

  const milestoneRewards =
    rewards
      .filter(
        (reward) =>
          Number(
            reward.requiredTasks
          ) > 0
      )
      .sort(
        (a, b) =>
          Number(a.requiredTasks) -
          Number(b.requiredTasks)
      );


  /* ========================================
     JOURNEY STEPS
  ======================================== */

  const steps = [

    {
      id: 'share',
      step: 1,

      title:
        'Share your link',

      description:
        'Share your referral link with friends',

      detail:
        'Copy your unique referral link and share it with your friends through WhatsApp, social media, or any platform you prefer.',

      Icon:
        Link,

      achieved: true,

      colorClass:
        'purple',
    },


    {
      id: 'join',
      step: 2,

      title:
        'Friend joins',

      description:
        'Your friend registers using your link',

      detail:
        'When your friend signs up successfully using your referral link, your referral journey moves to the next stage.',

      Icon:
        UserPlus,

      achieved:
        referrals.length > 0,

      colorClass:
        'blue',
    },


    {
      id: 'complete',
      step: 3,

      title:
        'They complete tasks',

      description:
        'Friends complete referral milestones',

      detail:
        'Your referred friends complete activities, tasks, or ad-watch milestones to help unlock referral progress.',

      Icon:
        Play,

      achieved:
        currentTasks > 0,

      colorClass:
        'orange',
    },


    {
      id: 'reward',
      step: 4,

      title:
        'You earn rewards',

      description:
        'Unlock exciting rewards and bonuses',

      detail:
        'As referral milestones are completed, you unlock rewards, bonuses, VE tokens, SVEs, and other platform benefits.',

      Icon:
        Gift,

      achieved:
        milestoneRewards.some(
          (reward) =>
            currentTasks >=
            Number(
              reward.requiredTasks
            )
        ),

      colorClass:
        'green',
    },

  ];


  /* ========================================
     OPEN JOURNEY MODAL
  ======================================== */

  const handleViewAll = () => {

    setShowJourney(true);

  };


  /* ========================================
     CLOSE JOURNEY MODAL
  ======================================== */

  const closeJourney = () => {

    setShowJourney(false);

  };


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (

      <section
        className={styles.panel}
      >

        <div
          className={styles.loadingGrid}
        >

          {[1, 2, 3, 4].map(
            (item) => (

              <div
                key={item}
                className={
                  styles.loadingStep
                }
              >

                <div
                  className={
                    styles.loadingNumber
                  }
                />

                <div
                  className={
                    styles.loadingIcon
                  }
                />

                <div
                  className={
                    styles.loadingTitle
                  }
                />

                <div
                  className={
                    styles.loadingText
                  }
                />

              </div>

            )
          )}

        </div>

      </section>

    );

  }


  /* ========================================
     ERROR
  ======================================== */

  if (error) {

    return (

      <section
        className={styles.panel}
      >

        <div
          className={
            styles.errorState
          }
        >

          <Lock size={26} />

          <div>

            <h3>
              Unable to load journey
            </h3>

            <p>
              {error}
            </p>

          </div>


          <button
            type="button"
            onClick={
              fetchTimelineData
            }
          >

            Try Again

          </button>

        </div>

      </section>

    );

  }


  /* ========================================
     MAIN UI
  ======================================== */

  return (

    <>

      <motion.section

        className={
          styles.panel
        }

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
          margin: '-60px',
        }}

        transition={{
          duration: 0.5,
        }}

      >


        {/* HEADER */}

        <div
          className={
            styles.header
          }
        >

          <div>

            <h2
              className={
                styles.title
              }
            >

              How Refer & Earn Works

            </h2>

          </div>


          <motion.button

            type="button"

            className={
              styles.viewAllButton
            }

            onClick={
              handleViewAll
            }

            whileHover={{
              x: 3,
            }}

            whileTap={{
              scale: 0.96,
            }}

          >

            View All

            <ChevronRight
              size={19}
            />

          </motion.button>

        </div>


        {/* JOURNEY STEPS */}

        <div
          className={
            styles.journeyContainer
          }
        >

          {steps.map(
            (
              step,
              index
            ) => {

              const Icon =
                step.Icon;


              return (

                <div
                  key={step.id}
                  className={
                    styles.stepWrapper
                  }
                >


                  <motion.div

                    className={
                      styles.step
                    }

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
                      duration: 0.45,
                      delay:
                        index * 0.1,
                    }}

                  >


                    <div
                      className={
                        styles.visualRow
                      }
                    >


                      <div
                        className={`${styles.stepNumber} ${
                          styles[
                            step.colorClass
                          ]
                        }`}
                      >

                        {step.step}

                      </div>


                      <motion.div

                        className={`${styles.iconCard} ${
                          styles[
                            `${step.colorClass}Card`
                          ]
                        } ${
                          step.achieved
                            ? styles.achieved
                            : ''
                        }`}

                        whileHover={{
                          y: -4,
                          scale: 1.03,
                        }}

                      >

                        <Icon
                          size={42}
                          strokeWidth={2.2}
                        />


                        {step.achieved && (

                          <div
                            className={
                              styles.completedDot
                            }
                          >

                            <CheckCircle2
                              size={13}
                            />

                          </div>

                        )}

                      </motion.div>

                    </div>


                    <div
                      className={
                        styles.stepContent
                      }
                    >

                      <h3>

                        {step.title}

                      </h3>


                      <p>

                        {step.description}

                      </p>

                    </div>


                  </motion.div>


                  {index <
                    steps.length - 1 && (

                    <div
                      className={
                        styles.connector
                      }
                    >

                      <div
                        className={
                          styles.connectorLine
                        }
                      />

                      <ChevronRight
                        size={24}
                      />

                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>


        {/* PROGRESS FOOTER */}

        <AnimatePresence>

          {currentTasks > 0 && (

            <motion.div

              className={
                styles.progressFooter
              }

              initial={{
                opacity: 0,
                y: 10,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

            >

              <CheckCircle2
                size={17}
              />


              <span>

                {currentTasks} tasks completed

              </span>


              <strong>

                Keep referring!

              </strong>

            </motion.div>

          )}

        </AnimatePresence>

      </motion.section>


      {/* ====================================
          REFERRAL JOURNEY MODAL
      ==================================== */}

      <AnimatePresence>

        {showJourney && (

          <motion.div

            className={
              styles.modalOverlay
            }

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            onClick={
              closeJourney
            }

          >

            <motion.div

              className={
                styles.journeyModal
              }

              initial={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}

              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
              }}

              onClick={(event) =>
                event.stopPropagation()
              }

            >


              {/* MODAL HEADER */}

              <div
                className={
                  styles.modalHeader
                }
              >

                <div
                  className={
                    styles.modalHeading
                  }
                >

                  <div
                    className={
                      styles.modalTitleIcon
                    }
                  >

                    <Sparkles size={20} />

                  </div>


                  <div>

                    <h2>
                      Your Referral Journey
                    </h2>

                    <p>
                      Complete each step and unlock exciting rewards
                    </p>

                  </div>

                </div>


                <button

                  type="button"

                  className={
                    styles.closeButton
                  }

                  onClick={
                    closeJourney
                  }

                >

                  <X size={20} />

                </button>

              </div>


              {/* JOURNEY PROGRESS */}

              <div
                className={
                  styles.modalProgress
                }
              >

                <div>

                  <span>
                    Current Progress
                  </span>

                  <strong>
                    {currentTasks} tasks completed
                  </strong>

                </div>


                <div
                  className={
                    styles.progressBadge
                  }
                >

                  <Trophy size={16} />

                  {steps.filter(
                    (step) =>
                      step.achieved
                  ).length}
                  /4 Completed

                </div>

              </div>


              {/* DETAILED STEPS */}

              <div
                className={
                  styles.modalSteps
                }
              >

                {steps.map(
                  (
                    step,
                    index
                  ) => {

                    const Icon =
                      step.Icon;


                    return (

                      <div

                        key={step.id}

                        className={`${styles.modalStep} ${
                          step.achieved
                            ? styles.modalStepCompleted
                            : ''
                        }`}

                      >


                        <div
                          className={
                            styles.modalStepLeft
                          }
                        >

                          <div
                            className={`${styles.modalStepIcon} ${
                              styles[
                                `${step.colorClass}Card`
                              ]
                            }`}
                          >

                            <Icon size={24} />

                          </div>


                          {index <
                            steps.length - 1 && (

                            <div
                              className={
                                styles.modalLine
                              }
                            />

                          )}

                        </div>


                        <div
                          className={
                            styles.modalStepContent
                          }
                        >

                          <div
                            className={
                              styles.modalStepTop
                            }
                          >

                            <span
                              className={
                                styles.stepLabel
                              }
                            >

                              STEP {step.step}

                            </span>


                            {step.achieved && (

                              <span
                                className={
                                  styles.completedBadge
                                }
                              >

                                <CircleCheck
                                  size={14}
                                />

                                Completed

                              </span>

                            )}

                          </div>


                          <h3>
                            {step.title}
                          </h3>


                          <p>
                            {step.detail}
                          </p>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>


              {/* REWARD INFORMATION */}

              <div
                className={
                  styles.modalRewardInfo
                }
              >

                <div
                  className={
                    styles.rewardInfoIcon
                  }
                >

                  <Gift size={22} />

                </div>


                <div>

                  <h4>
                    Refer more, earn more!
                  </h4>

                  <p>
                    Complete referral milestones to unlock VE tokens,
                    SVEs, bonuses and exclusive rewards.
                  </p>

                </div>

              </div>


              {/* CLOSE */}

              <button

                type="button"

                className={
                  styles.modalDoneButton
                }

                onClick={
                  closeJourney
                }

              >

                Got It

              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </>

  );

}


export default RewardTimeline;