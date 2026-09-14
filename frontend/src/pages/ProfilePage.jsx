import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  User,
  Mail,
  Gift,
  Users,
  Clock,
  ArrowLeft,
  LogOut,
  Gem,
  Coins,
  Trophy,
  Sparkles,
} from 'lucide-react';

import Header from '../components/Header/Header';
import API from '../utils/api';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/user/profile');

      setUser(response.data.user);
    } catch (error) {
      console.error(
        'Failed to load profile:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <Header />

        <div className={styles.loading}>
          Loading profile...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />

        <div className={styles.loading}>
          Unable to load profile.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <motion.div
          className={styles.profileCard}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* =========================
              TOP ACTIONS
          ========================= */}
          <div className={styles.topActions}>
            <button
              className={styles.backButton}
              onClick={handleBack}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>


          {/* =========================
              PROFILE AVATAR
          ========================= */}
          <div className={styles.avatar}>
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : 'U'}
          </div>

          <h1 className={styles.name}>
            {user.name || 'User'}
          </h1>

          <p className={styles.email}>
            {user.email}
          </p>


          {/* =========================
              WALLET / GAME STATS
          ========================= */}
          <div className={styles.statsGrid}>

            {/* SVE */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Coins size={22} />
              </div>

              <div>
                <span>SVE Balance</span>
                <strong>{user.sve || 0}</strong>
              </div>
            </div>


            {/* GEMS */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Gem size={22} />
              </div>

              <div>
                <span>Gems</span>
                <strong>{user.gems || 0}</strong>
              </div>
            </div>


            {/* TOKENS */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Trophy size={22} />
              </div>

              <div>
                <span>Tokens</span>
                <strong>{user.tokens || 0}</strong>
              </div>
            </div>


            {/* LUCKY SPINS */}
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Sparkles size={22} />
              </div>

              <div>
                <span>Lucky Spins</span>
                <strong>{user.luckySpins || 0}</strong>
              </div>
            </div>

          </div>


          {/* =========================
              PROFILE DETAILS
          ========================= */}
          <div className={styles.details}>

            {/* NAME */}
            <div className={styles.detailItem}>
              <div className={styles.icon}>
                <User size={20} />
              </div>

              <div>
                <span>Name</span>
                <strong>
                  {user.name || 'Not provided'}
                </strong>
              </div>
            </div>


            {/* EMAIL */}
            <div className={styles.detailItem}>
              <div className={styles.icon}>
                <Mail size={20} />
              </div>

              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
            </div>


            {/* LEVEL */}
            <div className={styles.detailItem}>
              <div className={styles.icon}>
                <Trophy size={20} />
              </div>

              <div>
                <span>Level</span>
                <strong>
                  Level {user.level || 1}
                </strong>
              </div>
            </div>


            {/* TOTAL XP */}
            <div className={styles.detailItem}>
              <div className={styles.icon}>
                <Sparkles size={20} />
              </div>

              <div>
                <span>Total XP</span>
                <strong>
                  {user.xp || 0} XP
                </strong>
              </div>
            </div>


            {/* REFERRAL CODE */}
            <div className={styles.detailItem}>
              <div className={styles.icon}>
                <Gift size={20} />
              </div>

              <div>
                <span>Referral Code</span>
                <strong>
                  {user.referralCode}
                </strong>
              </div>
            </div>


            {/* TOTAL REFERRALS */}
            <div className={styles.detailItem}>
              <div className={styles.icon}>
                <Users size={20} />
              </div>

              <div>
                <span>Total Referrals</span>
                <strong>
                  {user.sentReferrals?.length || 0}
                </strong>
              </div>
            </div>


            {/* JOINED DATE */}
            <div className={styles.detailItem}>
              <div className={styles.icon}>
                <Clock size={20} />
              </div>

              <div>
                <span>Joined On</span>

                <strong>
                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : 'N/A'}
                </strong>
              </div>
            </div>

          </div>
        </motion.div>
      </main>
    </>
  );
}

export default ProfilePage;