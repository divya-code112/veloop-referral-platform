import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  MessageCircleQuestion,
} from 'lucide-react';

import { faqData } from '../../utils/dummyData';

import FloatingOrbs from '../common/FloatingOrbs';
import CoinScatterBackground from '../common/CoinScatterBackground';

import styles from './FAQ.module.css';


function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      className={`${styles.item} ${
        isOpen ? styles.itemOpen : ''
      }`}
      layout
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
        margin: '-40px',
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
      }}
      whileHover={{
        y: -2,
      }}
    >
      <button
        className={styles.question}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        <div className={styles.questionLeft}>
          <span className={styles.number}>
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className={styles.questionText}>
            {item.question}
          </span>
        </div>

        <motion.span
          className={styles.chevron}
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.08 : 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            className={styles.answerWrap}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.answerInner}>
              <div className={styles.answerIcon}>
                <MessageCircleQuestion size={16} />
              </div>

              <p className={styles.answer}>
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


function FAQ() {
  const [openId, setOpenId] = useState(
    faqData[0]?.id ?? null
  );

  const handleToggle = (id) => {
    setOpenId((prev) =>
      prev === id ? null : id
    );
  };

  return (
    <section className={styles.panel}>
      <CoinScatterBackground />
      <FloatingOrbs />

      {/* Decorative glow */}
      <div className={styles.topGlow} />
      <div className={styles.sideGlow} />

      {/* Floating decorative icons */}
      <motion.div
        className={styles.floatingSparkle}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Sparkles size={20} />
      </motion.div>

      {/* Header */}
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
          duration: 0.6,
        }}
      >
        <motion.div
          className={styles.headerIcon}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <HelpCircle size={25} />

          <span className={styles.iconPulse} />
        </motion.div>

        <div className={styles.headingRow}>
          <h2 className={styles.title}>
            Frequently Asked Questions
          </h2>

          <Sparkles
            size={17}
            className={styles.titleSparkle}
          />
        </div>

        <p className={styles.subtitle}>
          Everything you need to know about the
          referral program, rewards, and milestones.
        </p>
      </motion.div>

      {/* FAQ List */}
      <div className={styles.list}>
        {faqData.map((item, index) => (
          <FAQItem
            key={item.id}
            item={item}
            index={index}
            isOpen={openId === item.id}
            onToggle={() =>
              handleToggle(item.id)
            }
          />
        ))}
      </div>

      {/* Bottom help text */}
      <motion.div
        className={styles.footerNote}
        initial={{
          opacity: 0,
          y: 15,
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
          delay: 0.2,
        }}
      >
        <HelpCircle size={15} />

        <span>
          Still have questions? Explore the referral
          program and start earning rewards.
        </span>
      </motion.div>
    </section>
  );
}


export default FAQ;