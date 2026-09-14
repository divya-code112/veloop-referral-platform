import { motion } from 'framer-motion';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';

import Wallet from '../components/Wallet/Wallet';

import styles from './WalletPage.module.css';


function WalletPage() {

  return (

    <div className={styles.page}>

      <Header />


      <main className={styles.main}>

        {/* Background Effects */}

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


        <div className={styles.container}>

          <motion.div
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

            <Wallet />

          </motion.div>

        </div>

      </main>


      <BottomNavigation />

      <Footer />

    </div>

  );

}


export default WalletPage;