import { useEffect, useState } from 'react';

import styles from './ReferralPage.module.css';

import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import ReferralCard from '../components/ReferralCard/ReferralCard';
import ShareButtons from '../components/ShareButtons/ShareButtons';
import StatsSection from '../components/StatsSection/StatsSection';
import ReferralProgress from '../components/ReferralProgress/ReferralProgress';
import RewardsSection from '../components/RewardsSection/RewardsSection';

import ReferralJourney from '../components/referral/ReferralJourney';

import ReferralRules from '../components/ReferralRules/ReferralRules';
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/Footer/Footer';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';

import API from '../utils/api';


function ReferralPage() {

  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
  });

  const [completedTasks, setCompletedTasks] = useState([]);

  const [loadingProgress, setLoadingProgress] =
    useState(true);


  /* ========================================
     LOAD GAMIFICATION DATA
  ======================================== */

  const loadGamificationData = async () => {

    try {

      setLoadingProgress(true);


      const response =
        await API.get(
          '/tasks/my-completions'
        );


      const data =
        response.data;


      const completions =
        data.completions || [];


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


      if (data.userProgress) {

        setUserProgress(
          (prev) => ({

            ...prev,

            ...data.userProgress,

            xp:
              data.userProgress.totalXp ??
              data.userProgress.xp ??
              0,

          })
        );

      }

    } catch (error) {

      console.error(
        'Failed to load gamification data:',
        error.response?.data ||
        error.message
      );

    } finally {

      setLoadingProgress(false);

    }

  };


  /* ========================================
     INITIAL LOAD + LIVE UPDATE
  ======================================== */

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


  return (

    <div className={styles.page}>


      {/* HEADER */}

      <Header />


      {/* ======================================
         MAIN CONTENT
      ====================================== */}

      <main className={styles.main}>


        {/* ====================================
           PREMIUM BACKGROUND EFFECTS
        ==================================== */}

        <div
          className={styles.backgroundGlow}
          aria-hidden="true"
        />

        <div
          className={styles.backgroundGlowSecondary}
          aria-hidden="true"
        />

        <div
          className={styles.backgroundGrid}
          aria-hidden="true"
        />

        <div
          className={styles.noiseOverlay}
          aria-hidden="true"
        />


        {/* ====================================
           MAIN CONTAINER
        ==================================== */}

        <div className={styles.container}>


          {/* HERO */}

          <section className={styles.heroSection}>

            <Hero />

          </section>


          {/* REFERRAL LINK + SHARE */}

          <section className={styles.referralSection}>

            <ReferralCard />

            <ShareButtons />

          </section>


          {/* REFERRAL STATISTICS */}

          <section className={styles.statsWrapper}>

            <StatsSection />

          </section>


          {/* REFERRAL PROGRESS */}

          <section className={styles.progressWrapper}>

            <ReferralProgress />

          </section>


          {/* REFERRAL JOURNEY */}

          <section className={styles.journeyWrapper}>

            <ReferralJourney />

          </section>


          {/* REWARDS */}

          <section className={styles.rewardsWrapper}>

            <RewardsSection />

          </section>


          {/* REFERRAL RULES */}

          <section className={styles.rulesWrapper}>

            <ReferralRules />

          </section>


          {/* FAQ */}

          <section className={styles.faqWrapper}>

            <FAQ />

          </section>


        </div>

      </main>


      {/* ======================================
         FIXED BOTTOM NAVIGATION
      ====================================== */}

      <BottomNavigation />


      {/* FOOTER */}

      <Footer />


    </div>

  );

}


export default ReferralPage;