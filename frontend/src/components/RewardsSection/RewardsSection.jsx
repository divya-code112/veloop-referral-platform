import { useEffect, useState } from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  LockKeyhole,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  PartyPopper,
  X,
  Trophy,
  Gift,
  Sparkles,
  CircleCheck,
} from 'lucide-react';

import API from '../../utils/api';

import styles from './RewardsSection.module.css';


/* =========================================
   REWARD MILESTONE
========================================= */

function RewardMilestone({
  reward,
  index,
  total,
  onClaim,
  claiming,
}) {

  const unlocked = Boolean(reward.unlocked);

  const claimed = Boolean(reward.claimed);

  const isActive =
    unlocked && !claimed;


  const getCoinValue = () => {

    if (reward.amount) {
      return reward.amount;
    }

    if (reward.points) {
      return reward.points;
    }

    if (reward.value) {
      return reward.value;
    }

    if (reward.coinValue) {
      return reward.coinValue;
    }

    return 'VE';

  };


  const getCondition = () => {

    if (reward.condition) {
      return reward.condition;
    }

    if (reward.requiredTasks) {
      return `Friend completes ${reward.requiredTasks} tasks`;
    }

    return `${(index + 1) * 5} Referrals`;

  };


  const getRewardLabel = () => {

    if (reward.subtitle) {
      return reward.subtitle;
    }

    if (reward.title) {
      return reward.title;
    }

    return 'Reward';

  };


  const handleRewardClick = () => {

    if (isActive && !claiming) {
      onClaim(reward.id || reward._id);
    }

  };


  return (

    <div className={styles.milestoneWrapper}>


      {/* CONNECTION LINE */}

      {index < total - 1 && (

        <div
          className={`${styles.connection} ${
            claimed
              ? styles.connectionCompleted
              : ''
          }`}
        >

          <div
            className={styles.connectionGlow}
          />

        </div>

      )}


      {/* MILESTONE */}

      <motion.div
        className={styles.milestone}

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
        }}

        transition={{
          duration: 0.45,
          delay: index * 0.1,
        }}
      >


        {/* COIN AREA */}

        <div
          className={`${styles.coinArea} ${
            claimed
              ? styles.coinCompleted
              : ''
          } ${
            isActive
              ? styles.coinActive
              : ''
          } ${
            !unlocked
              ? styles.coinLocked
              : ''
          }`}
        >


          {isActive && (

            <motion.div
              className={styles.activePulse}

              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.5, 0.15, 0.5],
              }}

              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

          )}


          {/* REWARD CIRCLE */}

          <motion.button
            type="button"

            className={styles.coin}

            onClick={handleRewardClick}

            disabled={
              !isActive || claiming
            }

            whileHover={
              isActive
                ? {
                    scale: 1.08,
                    rotate: 4,
                  }
                : {}
            }

            whileTap={
              isActive
                ? {
                    scale: 0.94,
                  }
                : {}
            }
          >

            {!unlocked ? (

              <LockKeyhole
                size={24}
                strokeWidth={2}
              />

            ) : claiming ? (

              <Loader2
                size={24}
                className={styles.spinner}
              />

            ) : (

              <span
                className={styles.coinText}
              >
                {getCoinValue()}
              </span>

            )}

          </motion.button>


          {/* COMPLETED CHECK */}

          {claimed && (

            <motion.div
              className={styles.completedCheck}

              initial={{
                scale: 0,
              }}

              animate={{
                scale: 1,
              }}

              transition={{
                type: 'spring',
                stiffness: 300,
              }}
            >

              <Check
                size={12}
                strokeWidth={3}
              />

            </motion.div>

          )}


          {/* ACTIVE DOT */}

          {isActive && (

            <span
              className={styles.activeIndicator}
            />

          )}

        </div>


        {/* CONDITION */}

        <p className={styles.referralCount}>
          {getCondition()}
        </p>


        {/* REWARD */}

        <p
          className={`${styles.rewardValue} ${
            claimed
              ? styles.completedText
              : isActive
                ? styles.activeText
                : styles.lockedText
          }`}
        >
          {getRewardLabel()}
        </p>


        {/* CLAIM */}

        {isActive && (

          <span className={styles.claimHint}>
            Click to claim
          </span>

        )}

      </motion.div>

    </div>

  );

}


/* =========================================
   REWARD DETAIL CARD FOR MODAL
========================================= */

function RewardDetailCard({
  reward,
  index,
  onClaim,
  claiming,
}) {

  const unlocked =
    Boolean(reward.unlocked);

  const claimed =
    Boolean(reward.claimed);

  const isActive =
    unlocked && !claimed;


  const getRewardValue = () => {

    if (reward.amount) {
      return reward.amount;
    }

    if (reward.points) {
      return reward.points;
    }

    if (reward.value) {
      return reward.value;
    }

    if (reward.coinValue) {
      return reward.coinValue;
    }

    return 'VE';

  };


  const getCondition = () => {

    if (reward.condition) {
      return reward.condition;
    }

    if (reward.requiredTasks) {
      return `Complete ${reward.requiredTasks} tasks`;
    }

    return `${(index + 1) * 5} referrals`;

  };


  const getTitle = () => {

    return (
      reward.title ||
      reward.subtitle ||
      `Reward ${index + 1}`
    );

  };


  const getStatus = () => {

    if (claimed) {
      return 'Claimed';
    }

    if (isActive) {
      return 'Ready to Claim';
    }

    return 'Locked';

  };


  const handleClick = () => {

    if (isActive && !claiming) {

      onClaim(
        reward.id || reward._id
      );

    }

  };


  return (

    <motion.div
      className={`${styles.rewardDetailCard} ${
        claimed
          ? styles.detailClaimed
          : ''
      } ${
        isActive
          ? styles.detailActive
          : ''
      }`}

      initial={{
        opacity: 0,
        y: 15,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        delay: index * 0.06,
      }}
    >


      {/* ICON */}

      <div
        className={`${styles.detailIcon} ${
          claimed
            ? styles.detailIconClaimed
            : isActive
              ? styles.detailIconActive
              : styles.detailIconLocked
        }`}
      >

        {claimed ? (

          <Check size={22} />

        ) : !unlocked ? (

          <LockKeyhole size={21} />

        ) : (

          <Gift size={21} />

        )}

      </div>


      {/* CONTENT */}

      <div className={styles.detailContent}>

        <div className={styles.detailTopRow}>

          <h3>
            {getTitle()}
          </h3>


          <span
            className={`${styles.statusBadge} ${
              claimed
                ? styles.statusClaimed
                : isActive
                  ? styles.statusActive
                  : styles.statusLocked
            }`}
          >

            {getStatus()}

          </span>

        </div>


        <p className={styles.detailCondition}>

          {getCondition()}

        </p>


        <div className={styles.detailRewardRow}>

          <span className={styles.detailRewardLabel}>
            Reward
          </span>

          <strong>
            {getRewardValue()}
          </strong>

        </div>

      </div>


      {/* ACTION */}

      {isActive && (

        <button
          type="button"

          className={styles.claimButton}

          onClick={handleClick}

          disabled={claiming}
        >

          {claiming ? (

            <Loader2
              size={16}
              className={styles.spinner}
            />

          ) : (

            <>
              Claim
              <ChevronRight size={16} />
            </>

          )}

        </button>

      )}

    </motion.div>

  );

}


/* =========================================
   REWARDS SECTION
========================================= */

function RewardsSection() {

  const [rewards, setRewards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [claimingId, setClaimingId] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [showAllRewards, setShowAllRewards] =
    useState(false);


  /* =========================================
     FETCH REWARDS
  ========================================= */

  const fetchRewards = async () => {

    try {

      setLoading(true);

      setError('');


      const response =
        await API.get('/rewards');


      setRewards(
        response.data.rewards || []
      );


    } catch (error) {

      console.error(
        'Failed to load rewards:',
        error.response?.data ||
        error.message
      );


      setError(
        'Failed to load referral rewards'
      );


    } finally {

      setLoading(false);

    }

  };


  /* =========================================
     INITIAL FETCH
  ========================================= */

  useEffect(() => {

    fetchRewards();


    const handleDataUpdate = () => {

      fetchRewards();

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


  /* =========================================
     CLAIM REWARD
  ========================================= */

  const handleClaimReward =
    async (rewardId) => {

      try {

        setClaimingId(rewardId);

        setError('');

        setSuccessMessage('');


        const response =
          await API.post(
            `/rewards/${rewardId}/claim`
          );


        setSuccessMessage(
          response.data.message ||
          'Reward claimed successfully!'
        );


        await fetchRewards();


        window.dispatchEvent(
          new Event('veloopDataUpdated')
        );


        setTimeout(() => {

          setSuccessMessage('');

        }, 4000);


      } catch (error) {

        console.error(
          'Failed to claim reward:',
          error.response?.data ||
          error.message
        );


        setError(
          error.response?.data?.message ||
          'Failed to claim reward'
        );


      } finally {

        setClaimingId(null);

      }

    };


  /* =========================================
     CLOSE MODAL ON ESCAPE
  ========================================= */

  useEffect(() => {

    const handleEscape = (event) => {

      if (event.key === 'Escape') {

        setShowAllRewards(false);

      }

    };


    window.addEventListener(
      'keydown',
      handleEscape
    );


    return () => {

      window.removeEventListener(
        'keydown',
        handleEscape
      );

    };

  }, []);


  return (

    <>

      <section
        id="rewards-section"
        className={styles.panel}
      >


        {/* =====================================
            HEADER
        ====================================== */}

        <div className={styles.topBar}>


          <div className={styles.heading}>

            <div className={styles.headingAccent} />

            <div>

              <h2>
                Rewards You Earn
              </h2>

              <p>
                Unlock bigger rewards as you refer more friends
              </p>

            </div>

          </div>


          <button
            type="button"
            className={styles.viewAllButton}

            onClick={() =>
              setShowAllRewards(true)
            }
          >

            View All

            <ChevronRight size={17} />

          </button>

        </div>


        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}

        <AnimatePresence>

          {successMessage && (

            <motion.div
              className={styles.successToast}

              initial={{
                opacity: 0,
                y: -10,
                scale: 0.96,
              }}

              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}

              exit={{
                opacity: 0,
                y: -10,
              }}
            >

              <PartyPopper size={17} />

              {successMessage}

            </motion.div>

          )}

        </AnimatePresence>


        {/* =====================================
            LOADING
        ====================================== */}

        {loading && (

          <div className={styles.loadingTimeline}>

            {[1, 2, 3, 4, 5].map((item) => (

              <div
                key={item}
                className={styles.loadingMilestone}
              >

                <div
                  className={styles.loadingCoin}
                />

                <div
                  className={styles.loadingText}
                />

                <div
                  className={styles.loadingValue}
                />

              </div>

            ))}

          </div>

        )}


        {/* =====================================
            ERROR
        ====================================== */}

        {!loading && error && (

          <div className={styles.errorState}>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchRewards}
            >
              Try Again
            </button>

          </div>

        )}


        {/* =====================================
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          rewards.length === 0 && (

          <div className={styles.emptyState}>

            No rewards available yet.

          </div>

        )}


        {/* =====================================
            REWARDS TIMELINE
        ====================================== */}

        {!loading &&
          !error &&
          rewards.length > 0 && (

          <div className={styles.timelineScroll}>

            <div className={styles.timeline}>

              {rewards.map(
                (reward, index) => (

                  <RewardMilestone
                    key={
                      reward.id ||
                      reward._id ||
                      index
                    }

                    reward={reward}

                    index={index}

                    total={rewards.length}

                    onClaim={
                      handleClaimReward
                    }

                    claiming={
                      claimingId ===
                      (reward.id || reward._id)
                    }
                  />

                )
              )}

            </div>

          </div>

        )}

      </section>


      {/* =====================================
          VIEW ALL REWARDS MODAL
      ====================================== */}

      <AnimatePresence>

        {showAllRewards && (

          <motion.div
            className={styles.modalOverlay}

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            onClick={() =>
              setShowAllRewards(false)
            }
          >

            <motion.div
              className={styles.rewardsModal}

              initial={{
                opacity: 0,
                scale: 0.94,
                y: 25,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
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


              {/* MODAL GLOW */}

              <div
                className={styles.modalGlowOne}
              />

              <div
                className={styles.modalGlowTwo}
              />


              {/* MODAL HEADER */}

              <div className={styles.modalHeader}>

                <div className={styles.modalHeading}>

                  <div className={styles.modalIcon}>

                    <Trophy size={22} />

                  </div>


                  <div>

                    <div
                      className={styles.modalTitleRow}
                    >

                      <h2>
                        Your Rewards Journey
                      </h2>

                      <Sparkles size={18} />

                    </div>


                    <p>
                      Complete milestones and unlock exciting rewards
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  className={styles.closeButton}

                  onClick={() =>
                    setShowAllRewards(false)
                  }

                  aria-label="Close rewards"
                >

                  <X size={21} />

                </button>

              </div>


              {/* MODAL PROGRESS */}

              <div className={styles.modalProgress}>

                <div>

                  <span>
                    Total Rewards
                  </span>

                  <strong>
                    {rewards.length}
                  </strong>

                </div>


                <div className={styles.progressDivider} />


                <div>

                  <span>
                    Claimed
                  </span>

                  <strong className={styles.claimedNumber}>

                    {
                      rewards.filter(
                        (reward) =>
                          reward.claimed
                      ).length
                    }

                  </strong>

                </div>


                <div className={styles.progressDivider} />


                <div>

                  <span>
                    Available
                  </span>

                  <strong className={styles.availableNumber}>

                    {
                      rewards.filter(
                        (reward) =>
                          reward.unlocked &&
                          !reward.claimed
                      ).length
                    }

                  </strong>

                </div>

              </div>


              {/* MODAL REWARD LIST */}

              <div className={styles.rewardDetailsList}>

                {rewards.map(
                  (reward, index) => (

                    <RewardDetailCard
                      key={
                        reward.id ||
                        reward._id ||
                        index
                      }

                      reward={reward}

                      index={index}

                      onClaim={
                        handleClaimReward
                      }

                      claiming={
                        claimingId ===
                        (reward.id || reward._id)
                      }
                    />

                  )
                )}

              </div>


              {/* MODAL FOOTER */}

              <div className={styles.modalFooter}>

                <CircleCheck size={17} />

                <span>
                  Keep referring friends to unlock more rewards!
                </span>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </>

  );

}


export default RewardsSection;