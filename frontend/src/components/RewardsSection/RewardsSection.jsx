import { useEffect, useState, useRef } from 'react';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

import {
  Lock,
  CheckCircle2,
  Sparkles,
  Gift,
  Loader2,
  PartyPopper,
} from 'lucide-react';

import API from '../../utils/api';

import FloatingOrbs from '../common/FloatingOrbs';
import CoinScatterBackground from '../common/CoinScatterBackground';

import styles from './RewardsSection.module.css';


/* =========================================
   TILT REWARD CARD
========================================= */

function TiltCard({
  reward,
  index,
  onClaim,
  claiming,
}) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = {
    stiffness: 150,
    damping: 18,
  };

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [10, -10]),
    springConfig
  );

  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-10, 10]),
    springConfig
  );


  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect =
      ref.current.getBoundingClientRect();

    const px =
      (e.clientX - rect.left) /
        rect.width -
      0.5;

    const py =
      (e.clientY - rect.top) /
        rect.height -
      0.5;

    x.set(px);
    y.set(py);
  };


  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };


  const unlocked = reward.unlocked;
  const claimed = reward.claimed;


  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${
        unlocked
          ? styles.unlocked
          : styles.locked
      } ${
        claimed
          ? styles.claimedCard
          : ''
      }`}

      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}

      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}

      initial={{
        opacity: 0,
        y: 40,
        scale: 0.92,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}

      viewport={{
        once: true,
        margin: '-60px',
      }}

      animate={
        unlocked && !claimed
          ? {
              y: [0, -6, 0],
            }
          : {}
      }

      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
    >

      {/* Animated Glow */}
      {unlocked && !claimed && (
        <motion.div
          className={styles.rewardGlow}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}


      <div
        className={styles.cardInner}
        style={{
          transform: 'translateZ(30px)',
        }}
      >

        {/* Status Icon */}

        <motion.div
          className={styles.statusIcon}
          animate={
            unlocked
              ? {
                  scale: [1, 1.15, 1],
                }
              : {}
          }
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
        >
          {claimed ? (
            <PartyPopper size={18} />
          ) : unlocked ? (
            <CheckCircle2 size={18} />
          ) : (
            <Lock size={16} />
          )}
        </motion.div>


        {/* Sparkle */}

        <motion.div
          className={styles.sparkleIcon}
          animate={
            unlocked
              ? {
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.15, 1],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Sparkles size={28} />
        </motion.div>


        <h3 className={styles.rewardTitle}>
          {reward.title}
        </h3>


        {reward.subtitle && (
          <p className={styles.rewardSubtitle}>
            {reward.subtitle}
          </p>
        )}


        <p className={styles.condition}>
          {reward.condition}
        </p>


        {/* CLAIMED */}

        {claimed && (
          <motion.div
            className={styles.claimedBadge}
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
          >
            <CheckCircle2 size={15} />

            Claimed
          </motion.div>
        )}


        {/* UNLOCKED + CLAIM BUTTON */}

        {unlocked && !claimed && (
          <motion.button
            className={styles.claimButton}

            onClick={() =>
              onClaim(reward.id)
            }

            whileHover={{
              scale: 1.04,
            }}

            whileTap={{
              scale: 0.95,
            }}

            disabled={claiming}
          >

            {claiming ? (
              <>
                <Loader2
                  size={16}
                  className={styles.spinner}
                />

                Claiming...
              </>
            ) : (
              <>
                <Gift size={16} />

                Claim Reward
              </>
            )}

          </motion.button>
        )}


        {/* LOCKED */}

        {!unlocked && (
          <div className={styles.lockedBadge}>
            <Lock size={14} />

            Locked
          </div>
        )}

      </div>


      {/* Shine */}

      <motion.div
        className={styles.shine}
        animate={
          unlocked
            ? {
                x: ['-120%', '120%'],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />

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


  useEffect(() => {
    fetchRewards();
  }, []);


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


        /*
          Refresh rewards after claim
        */

        await fetchRewards();


        /*
          Hide success message
        */

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


  return (

    <div className={styles.panel}>

      <CoinScatterBackground />

      <FloatingOrbs />


      {/* HEADER */}

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

        <motion.div
          className={styles.titleRow}

          animate={{
            y: [0, -3, 0],
          }}

          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >

          <Sparkles size={28} />

          <h2 className={styles.title}>
            Referral Rewards
          </h2>

          <Sparkles size={28} />

        </motion.div>


        <p className={styles.subtitle}>
          Unlock exciting rewards as your
          friends complete tasks
        </p>

      </motion.div>


      {/* SUCCESS MESSAGE */}

      <AnimatePresence>

        {successMessage && (

          <motion.div
            className={styles.successToast}

            initial={{
              opacity: 0,
              y: -20,
              scale: 0.9,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              y: -20,
            }}
          >

            <PartyPopper size={18} />

            {successMessage}

          </motion.div>

        )}

      </AnimatePresence>


      {/* CONTENT */}

      {loading ? (

        <div className={styles.grid}>

          <div className={styles.card}>

            <div className={styles.cardInner}>

              <h3 className={styles.rewardTitle}>
                Loading...
              </h3>

              <p className={styles.condition}>
                Loading referral rewards
              </p>

            </div>

          </div>

        </div>

      ) : error ? (

        <div className={styles.grid}>

          <div className={styles.card}>

            <div className={styles.cardInner}>

              <h3 className={styles.rewardTitle}>
                Unable to load
              </h3>

              <p className={styles.condition}>
                {error}
              </p>

            </div>

          </div>

        </div>

      ) : (

        <div className={styles.grid}>

          {rewards.map(
            (reward, index) => (

              <TiltCard
                key={reward.id}

                reward={reward}

                index={index}

                onClaim={
                  handleClaimReward
                }

                claiming={
                  claimingId === reward.id
                }
              />

            )
          )}

        </div>

      )}

    </div>

  );
}


export default RewardsSection;