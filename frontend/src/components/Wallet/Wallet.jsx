import { motion } from 'framer-motion';

import {
  WalletCards,
  TrendingUp,
  Clock3,
  ArrowDownToLine,
  Gift,
  Trophy,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Landmark,
} from 'lucide-react';

import {
  walletData,
  walletTransactions,
} from '../../utils/dummyData';

import FloatingOrbs from '../common/FloatingOrbs';
import CoinScatterBackground from '../common/CoinScatterBackground';

import styles from './Wallet.module.css';


const getTransactionIcon = (category) => {

  switch (category) {

    case 'referral':
      return Gift;

    case 'milestone':
      return Trophy;

    case 'task':
      return CheckCircle2;

    case 'withdrawal':
      return ArrowUpRight;

    default:
      return WalletCards;

  }

};


function Wallet() {

  const stats = [

    {
      label: 'Total Earned',
      value: walletData.totalEarned,
      icon: TrendingUp,
      className: 'earned',
    },

    {
      label: 'Pending Rewards',
      value: walletData.pendingRewards,
      icon: Clock3,
      className: 'pending',
    },

    {
      label: 'Total Withdrawn',
      value: walletData.totalWithdrawn,
      icon: ArrowDownToLine,
      className: 'withdrawn',
    },

  ];


  return (

    <section className={styles.panel}>

      {/* Decorative Background */}

      <CoinScatterBackground />

      <FloatingOrbs />

      <div className={styles.topGlow} />

      <div className={styles.sideGlow} />


      {/* =====================================
          HEADER
      ====================================== */}

      <motion.div
        className={styles.header}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <div className={styles.headerBadge}>

          <Sparkles size={15} />

          <span>Your Earnings Hub</span>

        </div>


        <h1 className={styles.title}>
          My Wallet
        </h1>


        <p className={styles.subtitle}>
          Track your earnings, rewards, and recent
          VELoop transactions in one place.
        </p>

      </motion.div>


      {/* =====================================
          BALANCE CARD
      ====================================== */}

      <motion.div
        className={styles.balanceCard}

        initial={{
          opacity: 0,
          y: 25,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.55,
          delay: 0.1,
        }}
      >

        <div className={styles.balanceGlow} />


        <div className={styles.balanceTop}>

          <div>

            <span className={styles.balanceLabel}>
              Available Balance
            </span>

            <div className={styles.balanceAmount}>

              <span className={styles.currency}>
                ₹
              </span>

              {walletData.availableBalance.toLocaleString(
                'en-IN'
              )}

            </div>

          </div>


          <motion.div
            className={styles.walletIcon}

            animate={{
              y: [0, -5, 0],
            }}

            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >

            <WalletCards size={34} />

          </motion.div>

        </div>


        <div className={styles.balanceBottom}>

          <div className={styles.secureInfo}>

            <Landmark size={15} />

            <span>
              Rewards & earnings securely tracked
            </span>

          </div>


          <button
            type="button"
            className={styles.withdrawButton}
          >

            Withdraw Funds

            <ArrowUpRight size={17} />

          </button>

        </div>

      </motion.div>


      {/* =====================================
          STATS
      ====================================== */}

      <div className={styles.statsGrid}>

        {stats.map((stat, index) => {

          const Icon = stat.icon;

          return (

            <motion.div
              key={stat.label}

              className={`${styles.statCard} ${
                styles[stat.className]
              }`}

              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.45,
                delay: 0.2 + index * 0.08,
              }}
            >

              <div className={styles.statIcon}>

                <Icon size={20} />

              </div>


              <div>

                <p className={styles.statLabel}>
                  {stat.label}
                </p>

                <h3 className={styles.statValue}>
                  ₹{stat.value.toLocaleString('en-IN')}
                </h3>

              </div>

            </motion.div>

          );

        })}

      </div>


      {/* =====================================
          TRANSACTION HISTORY
      ====================================== */}

      <motion.div
        className={styles.transactionsSection}

        initial={{
          opacity: 0,
          y: 25,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.55,
          delay: 0.45,
        }}
      >

        <div className={styles.sectionHeader}>

          <div>

            <span className={styles.sectionEyebrow}>
              ACTIVITY
            </span>

            <h2>
              Recent Transactions
            </h2>

          </div>


          <button
            type="button"
            className={styles.viewAll}
          >
            View All
          </button>

        </div>


        <div className={styles.transactionList}>

          {walletTransactions.map((transaction) => {

            const Icon =
              getTransactionIcon(
                transaction.category
              );


            const isDebit =
              transaction.type === 'debit';


            const isPending =
              transaction.type === 'pending';


            return (

              <motion.div
                key={transaction.id}

                className={styles.transaction}

                whileHover={{
                  x: 4,
                }}
              >

                <div
                  className={`${styles.transactionIcon} ${
                    isDebit
                      ? styles.debitIcon
                      : isPending
                        ? styles.pendingIcon
                        : styles.creditIcon
                  }`}
                >

                  <Icon size={19} />

                </div>


                <div className={styles.transactionInfo}>

                  <h4>
                    {transaction.title}
                  </h4>

                  <p>
                    {transaction.description}
                  </p>

                  <span className={styles.transactionDate}>
                    {transaction.date}
                  </span>

                </div>


                <div className={styles.transactionRight}>

                  <strong
                    className={
                      isDebit
                        ? styles.debitAmount
                        : isPending
                          ? styles.pendingAmount
                          : styles.creditAmount
                    }
                  >

                    {isDebit ? '-' : '+'}
                    ₹{transaction.amount.toLocaleString('en-IN')}

                  </strong>


                  <span
                    className={`${styles.status} ${
                      transaction.status === 'Completed'
                        ? styles.completedStatus
                        : styles.pendingStatus
                    }`}
                  >

                    {transaction.status}

                  </span>

                </div>

              </motion.div>

            );

          })}

        </div>

      </motion.div>


      {/* =====================================
          WALLET FOOTER NOTE
      ====================================== */}

      <motion.div
        className={styles.footerNote}

        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        transition={{
          delay: 0.7,
        }}
      >

        <CheckCircle2 size={16} />

        <span>
          Your wallet activity and rewards are
          securely organized in one place.
        </span>

      </motion.div>

    </section>

  );

}


export default Wallet;