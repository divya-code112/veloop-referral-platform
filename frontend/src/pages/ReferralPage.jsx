import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import {
  Trophy,
  Zap,
  Flame,
  CheckCircle2,
  Target,
  ArrowRight,
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


  /* ================================
     USER GAMIFICATION DATA
  ================================= */

  const [userProgress, setUserProgress] =
    useState({
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
    });


  const [completedTasks, setCompletedTasks] =
    useState([]);


  /* ================================
     LOAD USER PROGRESS
  ================================= */

  useEffect(() => {

    loadGamificationData();


    /*
     * Listen for updates from TaskModal.
     * When a task is completed, refresh
     * the gamification dashboard.
     */

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

      const response =
        await API.get(
          '/tasks/my-completions'
        );


      const data = response.data;


      const completions =
        data.completions || [];


      /*
       * Store unique completed task IDs.
       */

      const completedIds = [

        ...new Set(

          completions.map(
            (completion) =>
              completion.taskId
          )

        ),

      ];


      setCompletedTasks(
        completedIds
      );


      /*
       * Update user XP, level and streak data.
       */

      if (data.userProgress) {

        setUserProgress((prev) => ({

          ...prev,

          ...data.userProgress,


          /*
           * Backend may return totalXp
           * instead of xp.
           */

          xp:
            data.userProgress.totalXp ??
            data.userProgress.xp ??
            0,

        }));

      }

    } catch (error) {

      console.error(
        'Failed to load gamification data:',
        error.response?.data ||
        error.message
      );

    }

  };


  /* ================================
     XP CALCULATIONS
  ================================= */

  const xpPerLevel = 100;


  const currentLevelXp =
    userProgress.xp % xpPerLevel;


  const xpProgress =
    (currentLevelXp / xpPerLevel) * 100;


  const xpRemaining =
    currentLevelXp === 0 &&
    userProgress.xp > 0
      ? 100
      : xpPerLevel - currentLevelXp;


  return (

    <div className={styles.page}>


      {/* ================================
         HEADER
      ================================= */}

      <Header />


      {/* ================================
         DARK ZONE
      ================================= */}

      <section
        className={styles.darkZone}
      >

        <div
          className={styles.meshOverlay}
          aria-hidden="true"
        />


        <div className="container">


          {/* ================================
             HERO
          ================================= */}

          <Hero />


          {/* ================================
             REFERRAL SECTION

             Referral Code
             Referral Link
          ================================= */}

          <ReferralCard />


          {/* ================================
             SHARE BUTTONS
          ================================= */}

          <ShareButtons />


          {/* ================================
             GAMIFICATION DASHBOARD
          ================================= */}

          <motion.section

            className={
              styles.gamificationDashboard
            }

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.6,
              delay: 0.2,
            }}

          >


            {/* ================================
               DASHBOARD HEADER
            ================================= */}

            <div
              className={
                styles.gamificationHeader
              }
            >


              <div>

                <span
                  className={
                    styles.gamificationEyebrow
                  }
                >

                  YOUR ACTIVITY

                </span>


                <h2>

                  Keep Growing Your
                  <span> VELoop Journey</span>

                </h2>


                <p>

                  Complete tasks, earn XP,
                  maintain your streak and
                  unlock exciting rewards.

                </p>

              </div>


              <button

                className={
                  styles.taskButton
                }

                onClick={() =>
                  navigate('/tasks')
                }

              >

                Complete Tasks

                <ArrowRight size={18} />

              </button>

            </div>


            {/* ================================
               LEVEL PROGRESS CARD
            ================================= */}

            <div
              className={
                styles.levelCard
              }
            >


              {/* LEVEL TOP */}

              <div
                className={
                  styles.levelTop
                }
              >


                {/* LEVEL ICON */}

                <div
                  className={
                    styles.levelIcon
                  }
                >

                  <Trophy size={28} />

                </div>


                {/* LEVEL INFO */}

                <div>

                  <span>
                    Current Level
                  </span>


                  <strong>

                    Level {
                      userProgress.level
                    }

                  </strong>

                </div>


                {/* TOTAL XP */}

                <div
                  className={
                    styles.totalXp
                  }
                >

                  <Zap size={16} />

                  {userProgress.xp} XP

                </div>

              </div>


              {/* ================================
                 XP PROGRESS
              ================================= */}

              <div
                className={
                  styles.xpProgress
                }
              >


                <div
                  className={
                    styles.xpProgressText
                  }
                >

                  <span>

                    {currentLevelXp} /
                    {xpPerLevel} XP

                  </span>


                  <span>

                    {Math.round(
                      xpProgress
                    )}% Complete

                  </span>

                </div>


                {/* PROGRESS BAR */}

                <div
                  className={
                    styles.progressBar
                  }
                >

                  <motion.div

                    className={
                      styles.progressFill
                    }

                    initial={{
                      width: 0,
                    }}

                    animate={{
                      width:
                        `${xpProgress}%`,
                    }}

                    transition={{
                      duration: 1,
                    }}

                  />

                </div>


                {/* NEXT LEVEL */}

                <div
                  className={
                    styles.nextLevel
                  }
                >

                  <Target size={14} />

                  {xpRemaining} XP until
                  Level {
                    userProgress.level + 1
                  }

                </div>

              </div>

            </div>


            {/* ================================
               ACTIVITY STATS
            ================================= */}

            <div
              className={
                styles.activityStats
              }
            >


              {/* TASKS COMPLETED */}

              <div
                className={
                  styles.activityCard
                }
              >

                <div
                  className={
                    styles.activityIconPurple
                  }
                >

                  <CheckCircle2 size={22} />

                </div>


                <div>

                  <span>
                    Tasks Completed
                  </span>


                  <strong>

                    {
                      completedTasks.length
                    }

                  </strong>

                </div>

              </div>


              {/* CURRENT STREAK */}

              <div
                className={
                  styles.activityCard
                }
              >

                <div
                  className={
                    styles.activityIconOrange
                  }
                >

                  <Flame size={22} />

                </div>


                <div>

                  <span>
                    Current Streak
                  </span>


                  <strong>

                    {
                      userProgress
                        .currentStreak || 0
                    } Days

                  </strong>

                </div>

              </div>


              {/* LONGEST STREAK */}

              <div
                className={
                  styles.activityCard
                }
              >

                <div
                  className={
                    styles.activityIconGold
                  }
                >

                  <Trophy size={22} />

                </div>


                <div>

                  <span>
                    Longest Streak
                  </span>


                  <strong>

                    {
                      userProgress
                        .longestStreak || 0
                    } Days

                  </strong>

                </div>

              </div>

            </div>


          </motion.section>


        </div>

      </section>


      {/* ================================
         LOWER ZONE
      ================================= */}

      <section
        className={styles.lightZone}
      >

        <div className="container">


          <StatsSection />


          <ReferralProgress />


          <RewardsSection />


          <RewardTimeline />


          <ReferralRules />


          <FAQ />


        </div>

      </section>


      {/* ================================
         FOOTER
      ================================= */}

      <Footer />


    </div>

  );

}


export default ReferralPage;