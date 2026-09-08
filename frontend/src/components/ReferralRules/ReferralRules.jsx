import { motion } from 'framer-motion';
import {
  Lock,
  GitBranch,
  Ban,
  ShieldAlert,
  LineChart,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

import { referralRules } from '../../utils/dummyData';

import FloatingOrbs from '../common/FloatingOrbs';
import CoinScatterBackground from '../common/CoinScatterBackground';

import styles from './ReferralRules.module.css';


const RULE_ICONS = [
  Lock,
  GitBranch,
  CheckCircle,
  Ban,
  ShieldAlert,
  LineChart,
];


const RULE_ACCENTS = [
  'indigo',
  'teal',
  'emerald',
  'rose',
  'amber',
  'violet',
];


function ReferralRules() {
  return (
    <section className={styles.panel}>
      {/* Background decorations */}
      <CoinScatterBackground />
      <FloatingOrbs />

      {/* Decorative glow */}
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerBadge}>
          <ShieldCheck size={16} />
          <span>Referral Guidelines</span>
        </div>

        <h2 className={styles.title}>
          Referral Rules
        </h2>

        <p className={styles.subtitle}>
          Simple guidelines designed to keep the VELoop referral
          program fair, transparent, and rewarding for everyone.
        </p>
      </motion.div>


      {/* Rules */}
      <div className={styles.grid}>
        {referralRules.map((rule, index) => {
          const Icon =
            RULE_ICONS[index % RULE_ICONS.length];

          const accent =
            RULE_ACCENTS[index % RULE_ACCENTS.length];

          return (
            <motion.div
              key={index}
              className={`${styles.card} ${styles[accent]}`}
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
                margin: '-50px',
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.07,
              }}
              whileHover={{
                y: -5,
              }}
            >
              {/* Rule Number */}
              <span className={styles.ruleNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className={styles.iconWrap}>
                <Icon size={20} strokeWidth={2} />
              </div>

              <div className={styles.content}>
                <span className={styles.ruleLabel}>
                  Rule {index + 1}
                </span>

                <p className={styles.ruleText}>
                  {rule}
                </p>
              </div>

              {/* Hover accent line */}
              <div className={styles.accentLine} />
            </motion.div>
          );
        })}
      </div>


      {/* Bottom note */}
      <motion.div
        className={styles.footerNote}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.3,
        }}
      >
        <CheckCircle size={16} />

        <span>
          Following these guidelines helps ensure a safe and fair
          rewards experience for everyone.
        </span>
      </motion.div>
    </section>
  );
}


export default ReferralRules;