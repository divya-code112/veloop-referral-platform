import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Zap,
  Flame,
  CheckCircle2,
  Target,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import styles from './ReferralPage.module.css';

import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import ReferralCard from '../components/ReferralCard/ReferralCard';
import ShareButtons from '../components/ShareButtons/ShareButtons';
import StatsSection from '../components/StatsSection/StatsSection';
import ReferralProgress from '../components/ReferralProgress/ReferralProgress';
import RewardsSection from '../components/RewardsSection/RewardsSection';
import RewardTimeline from '../components/RewardTimeline/RewardTimeline';
import ReferralRules from '../components/ReferralRules/ReferralRules';
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/Footer/Footer';

import API from '../utils/api';

function ReferralPage() {
  const navigate = useNavigate();

  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
  });

  const [completedTasks, setCompletedTasks] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    loadGamificationData();

    const handleDataUpdate = () => {
      loadGamificationData();
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

  const loadGamificationData = async () => {
    try {
      setLoadingProgress(true);

      const response = await API.get(
        '/tasks/my-completions'
      );

      const data = response.data;

      const completions =
        data.completions || [];

      const completedIds = [
        ...new Set(
          completions.map(
            (completion) => completion.taskId
          )
        ),
      ];

      setCompletedTasks(completedIds);

      if (data.userProgress) {
        setUserProgress((prev) => ({
          ...prev,
          ...data.userProgress,
          xp:
            data.userProgress.totalXp ??
            data.userProgress.xp ??
            0,
        }));
      }
    } catch (error) {
      console.error(
        'Failed to load gamification data:',
        error.response?.data || error.message
      );
    } finally {
      setLoadingProgress(false);
    }
  };

  /* =========================================
     XP CALCULATIONS
  ========================================= */

  const xpPerLevel = 100;

  const currentLevelXp =
    userProgress.xp % xpPerLevel;

  const xpProgress =
    (currentLevelXp / xpPerLevel) * 100;

  const xpRemaining =
    currentLevelXp === 0 &&
    userProgress.xp > 0
      ? xpPerLevel
      : xpPerLevel - currentLevelXp;

  return (
    <div className={styles.page}>
      <Header />

      {/* =====================================
          MAIN PREMIUM DARK EXPERIENCE
      ====================================== */}

      <main className={styles.main}>
        <div
          className={styles.backgroundGlow}
          aria-hidden="true"
        />

        <div
          className={styles.backgroundGrid}
          aria-hidden="true"
        />

        <div className={styles.container}>
          {/* =================================
              HERO
          ================================= */}

          <Hero />

          {/* =================================
              REFERRAL LINK CARD
          ================================= */}

          <section className={styles.referralArea}>
            <ReferralCard />
            <ShareButtons />
          </section>

          {/* =================================
              QUICK ACTIVITY DASHBOARD
          ================================= */}

          <motion.section
            className={styles.gamificationDashboard}
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className={styles.dashboardTop}>
              <div className={styles.dashboardHeading}>
                <div className={styles.dashboardEyebrow}>
                  <Sparkles size={14} />

                  <span>YOUR JOURNEY</span>
                </div>

                <h2>
                  Keep Growing Your
                  <span> VELoop Journey</span>
                </h2>

                <p>
                  Complete tasks, earn XP and
                  unlock exciting rewards as
                  you progress.
                </p>
              </div>

              <button
                className={styles.taskButton}
                onClick={() =>
                  navigate('/tasks')
                }
              >
                Complete Tasks

                <ArrowRight size={18} />
              </button>
            </div>

            {/* =================================
                MAIN PROGRESS CARDS
            ================================= */}

            <div className={styles.journeyGrid}>
              {/* LEVEL CARD */}

              <div className={styles.levelCard}>
                <div className={styles.levelGlow} />

                <div className={styles.levelHeader}>
                  <div className={styles.levelIcon}>
                    <Trophy size={28} />
                  </div>

                  <div>
                    <span className={styles.levelLabel}>
                      Current Level
                    </span>

                    <strong>
                      Level {userProgress.level}
                    </strong>
                  </div>

                  <div className={styles.totalXp}>
                    <Zap size={15} />

                    {loadingProgress
                      ? '...'
                      : `${userProgress.xp} XP`}
                  </div>
                </div>

                <div className={styles.xpSection}>
                  <div className={styles.xpProgressText}>
                    <span>
                      {currentLevelXp} / {xpPerLevel} XP
                    </span>

                    <span>
                      {Math.round(xpProgress)}%
                    </span>
                  </div>

                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${xpProgress}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        ease: 'easeOut',
                      }}
                    />
                  </div>

                  <div className={styles.nextLevel}>
                    <Target size={14} />

                    {xpRemaining} XP until Level{' '}
                    {userProgress.level + 1}
                  </div>
                </div>
              </div>

              {/* MOTIVATION CARD */}

              <div className={styles.motivationCard}>
                <div className={styles.motivationContent}>
                  <div className={styles.motivationBadge}>
                    <Activity size={15} />
                    ACTIVE JOURNEY
                  </div>

                  <h3>
                    Keep going!
                    <span> 🚀</span>
                  </h3>

                  <p>
                    Complete more tasks and
                    invite friends to unlock
                    bigger rewards.
                  </p>

                  <button
                    className={styles.motivationButton}
                    onClick={() =>
                      navigate('/tasks')
                    }
                  >
                    Explore Tasks
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div
                  className={styles.motivationVisual}
                  aria-hidden="true"
                >
                  <div className={styles.orbOne} />
                  <div className={styles.orbTwo} />

                  <motion.div
                    className={styles.floatingCoin}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 8, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    VE
                  </motion.div>

                  <div className={styles.rewardStack}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>

            {/* =================================
                ACTIVITY CARDS
            ================================= */}

            <div className={styles.activityStats}>
              <motion.div
                className={styles.activityCard}
                whileHover={{ y: -5 }}
              >
                <div
                  className={
                    styles.activityIconPurple
                  }
                >
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <span>Tasks Completed</span>

                  <strong>
                    {loadingProgress
                      ? '...'
                      : completedTasks.length}
                  </strong>
                </div>
              </motion.div>

              <motion.div
                className={styles.activityCard}
                whileHover={{ y: -5 }}
              >
                <div
                  className={
                    styles.activityIconOrange
                  }
                >
                  <Flame size={21} />
                </div>

                <div>
                  <span>Current Streak</span>

                  <strong>
                    {userProgress.currentStreak || 0}
                    <small> Days</small>
                  </strong>
                </div>
              </motion.div>

              <motion.div
                className={styles.activityCard}
                whileHover={{ y: -5 }}
              >
                <div
                  className={
                    styles.activityIconGold
                  }
                >
                  <Trophy size={21} />
                </div>

                <div>
                  <span>Longest Streak</span>

                  <strong>
                    {userProgress.longestStreak || 0}
                    <small> Days</small>
                  </strong>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* =================================
              STATS
          ================================= */}

          <StatsSection />

          {/* =================================
              REFERRAL PROGRESS
          ================================= */}

          <ReferralProgress />

          {/* =================================
              REWARDS MILESTONES
          ================================= */}

          <RewardsSection />

          {/* =================================
              HOW IT WORKS
          ================================= */}

          <RewardTimeline />

          {/* =================================
              REFERRAL RULES
          ================================= */}

          <ReferralRules />

          {/* =================================
              FAQ
          ================================= */}

          <FAQ />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ReferralPage;