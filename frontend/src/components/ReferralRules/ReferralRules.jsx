import { motion } from 'framer-motion';

import {
  Lock,
  GitBranch,
  CheckCircle,
  Ban,
  ShieldAlert,
  LineChart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

import { referralRules } from '../../utils/dummyData';

import FloatingOrbs from '../common/FloatingOrbs';
import CoinScatterBackground from '../common/CoinScatterBackground';

import styles from './ReferralRules.module.css';


/* ========================================
   RULE ICONS
======================================== */

const RULE_ICONS = [
  Lock,
  GitBranch,
  CheckCircle,
  Ban,
  ShieldAlert,
  LineChart,
];


/* ========================================
   RULE ACCENTS
======================================== */

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


      {/* ====================================
          BACKGROUND DECORATION
      ==================================== */}

      <CoinScatterBackground />

      <FloatingOrbs />

      <div className={styles.glowOne} />

      <div className={styles.glowTwo} />

      <div className={styles.gridPattern} />


      {/* ====================================
          HEADER
      ==================================== */}

      <motion.div
        className={styles.header}

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
          duration: 0.5,
        }}
      >


        {/* Badge */}

        <div className={styles.headerBadge}>

          <ShieldCheck size={15} />

          <span>
            Referral Guidelines
          </span>

        </div>


        {/* Title */}

        <div className={styles.titleRow}>

          <h2 className={styles.title}>
            Referral Rules
          </h2>

          <Sparkles
            size={20}
            className={styles.sparkle}
          />

        </div>


        {/* Subtitle */}

        <p className={styles.subtitle}>

          Simple guidelines designed to keep the
          VELoop referral program fair, transparent,
          and rewarding for everyone.

        </p>

      </motion.div>


      {/* ====================================
          RULES GRID
      ==================================== */}

      <div className={styles.grid}>

        {referralRules.map(
          (rule, index) => {

            const Icon =
              RULE_ICONS[
                index % RULE_ICONS.length
              ];


            const accent =
              RULE_ACCENTS[
                index % RULE_ACCENTS.length
              ];


            return (

              <motion.div

                key={index}

                className={`${styles.card} ${
                  styles[accent]
                }`}

                initial={{
                  opacity: 0,
                  y: 28,
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
                  delay: index * 0.08,
                }}

                whileHover={{
                  y: -6,
                }}

              >


                {/* Background Glow */}

                <div
                  className={
                    styles.cardGlow
                  }
                />


                {/* Rule Number */}

                <span
                  className={
                    styles.ruleNumber
                  }
                >

                  {String(index + 1)
                    .padStart(2, '0')}

                </span>


                {/* Top */}

                <div
                  className={
                    styles.cardTop
                  }
                >


                  {/* Icon */}

                  <div
                    className={
                      styles.iconWrap
                    }
                  >

                    <div
                      className={
                        styles.iconInner
                      }
                    >

                      <Icon
                        size={22}
                        strokeWidth={2}
                      />

                    </div>

                  </div>


                  {/* Arrow */}

                  <ArrowRight
                    size={17}
                    className={
                      styles.cardArrow
                    }
                  />

                </div>


                {/* Content */}

                <div
                  className={
                    styles.content
                  }
                >

                  <span
                    className={
                      styles.ruleLabel
                    }
                  >

                    Rule {index + 1}

                  </span>


                  <p
                    className={
                      styles.ruleText
                    }
                  >

                    {rule}

                  </p>

                </div>


                {/* Bottom Accent */}

                <div
                  className={
                    styles.accentLine
                  }
                />

              </motion.div>

            );

          }
        )}

      </div>


      {/* ====================================
          TRUST FOOTER
      ==================================== */}

      <motion.div

        className={
          styles.footerNote
        }

        initial={{
          opacity: 0,
          y: 10,
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
          delay: 0.3,
        }}

      >

        <div
          className={
            styles.footerIcon
          }
        >

          <BadgeCheck size={18} />

        </div>


        <div>

          <strong>
            Fair & Secure Referral Program
          </strong>

          <span>
            Follow these guidelines to enjoy a safe,
            transparent and rewarding experience.
          </span>

        </div>

      </motion.div>

    </section>

  );

}


export default ReferralRules;