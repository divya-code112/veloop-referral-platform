import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {
  Link2,
  UserPlus,
  PlayCircle,
  Gift,
  ChevronRight,
  X,
  Copy,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Trophy,
  Users,
} from 'lucide-react';

import styles from './ReferralJourney.module.css';


/* =========================================
   REFERRAL STEPS
========================================= */

const referralSteps = [
  {
    id: 1,
    title: 'Share your link',
    description: 'Share your unique referral link with friends and invite them to join.',
    shortDescription: 'Share your referral link with friends',
    icon: Link2,
    color: 'purple',
  },
  {
    id: 2,
    title: 'Friend joins',
    description: 'Your friend registers on Veloop using your referral link.',
    shortDescription: 'Your friend registers using your link',
    icon: UserPlus,
    color: 'blue',
  },
  {
    id: 3,
    title: 'Complete tasks',
    description: 'Your friend completes tasks and reaches activity milestones.',
    shortDescription: 'They complete tasks and milestones',
    icon: PlayCircle,
    color: 'orange',
  },
  {
    id: 4,
    title: 'Earn rewards',
    description: 'Unlock VeCoins, rewards and exciting bonuses as milestones are completed.',
    shortDescription: 'You earn VeCoins, rewards and more!',
    icon: Gift,
    color: 'green',
  },
];


/* =========================================
   REFERRAL JOURNEY MODAL
========================================= */

function ReferralJourneyModal({
  isOpen,
  onClose,
}) {

  const [copied, setCopied] =
    useState(false);


  const referralLink =
    'https://veloop.app/ref/your-code';


  const handleCopy = async () => {

    try {

      await navigator.clipboard.writeText(
        referralLink
      );


      setCopied(true);


      setTimeout(() => {

        setCopied(false);

      }, 2000);


    } catch (error) {

      console.error(
        'Failed to copy referral link:',
        error
      );

    }

  };


  return (

    <AnimatePresence>

      {isOpen && (

        <motion.div
          className={styles.modalOverlay}

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0,
          }}

          onClick={onClose}
        >


          <motion.div
            className={styles.modal}

            initial={{
              opacity: 0,
              scale: 0.92,
              y: 30,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}

            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}

            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* CLOSE BUTTON */}

            <button
              type="button"

              className={styles.closeButton}

              onClick={onClose}

              aria-label="Close referral journey"
            >

              <X size={20} />

            </button>


            {/* MODAL HEADER */}

            <div className={styles.modalHeader}>

              <motion.div
                className={styles.modalIcon}

                animate={{
                  y: [0, -5, 0],
                }}

                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >

                <Sparkles size={24} />

              </motion.div>


              <h2>
                How Refer & Earn Works
              </h2>


              <p>
                Invite friends, help them get started,
                and unlock exciting rewards together.
              </p>

            </div>


            {/* DETAILED JOURNEY */}

            <div className={styles.modalSteps}>

              {referralSteps.map(
                (step, index) => {

                  const Icon = step.icon;


                  return (

                    <motion.div
                      key={step.id}

                      className={styles.modalStep}

                      initial={{
                        opacity: 0,
                        x: -20,
                      }}

                      animate={{
                        opacity: 1,
                        x: 0,
                      }}

                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                      }}
                    >


                      {/* STEP NUMBER */}

                      <div
                        className={`${styles.modalStepNumber} ${
                          styles[
                            `number${step.color}`
                          ]
                        }`}
                      >

                        {step.id}

                      </div>


                      {/* ICON */}

                      <div
                        className={`${styles.modalStepIcon} ${
                          styles[
                            `icon${step.color}`
                          ]
                        }`}
                      >

                        <Icon size={24} />

                      </div>


                      {/* CONTENT */}

                      <div
                        className={
                          styles.modalStepContent
                        }
                      >

                        <h3>
                          {step.title}
                        </h3>


                        <p>
                          {step.description}
                        </p>

                      </div>


                      {/* CONNECTOR */}

                      {index <
                        referralSteps.length - 1 && (

                        <div
                          className={
                            styles.verticalConnector
                          }
                        />

                      )}

                    </motion.div>

                  );

                }
              )}

            </div>


            {/* REFERRAL LINK BOX */}

            <div className={styles.referralBox}>

              <div
                className={
                  styles.referralBoxHeader
                }
              >

                <div
                  className={
                    styles.referralBoxIcon
                  }
                >

                  <Share2 size={18} />

                </div>


                <div>

                  <h4>
                    Your Referral Link
                  </h4>

                  <p>
                    Share it and start earning rewards
                  </p>

                </div>

              </div>


              <div
                className={
                  styles.referralLinkRow
                }
              >

                <span>
                  {referralLink}
                </span>


                <button
                  type="button"

                  onClick={handleCopy}
                >

                  {copied ? (

                    <>

                      <CheckCircle2 size={17} />

                      Copied

                    </>

                  ) : (

                    <>

                      <Copy size={17} />

                      Copy

                    </>

                  )}

                </button>

              </div>

            </div>


            {/* REWARD INFO */}

            <div className={styles.rewardInfo}>

              <div
                className={styles.rewardInfoIcon}
              >

                <Trophy size={22} />

              </div>


              <div>

                <h4>
                  Unlock More Rewards
                </h4>

                <p>
                  The more your referrals complete
                  tasks, the closer you get to
                  exciting VeCoins and rewards.
                </p>

              </div>

            </div>


            {/* FOOTER */}

            <div className={styles.modalFooter}>

              <button
                type="button"

                className={styles.startButton}

                onClick={onClose}
              >

                <Users size={18} />

                Start Referring

                <ArrowRight size={17} />

              </button>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}


/* =========================================
   MAIN REFERRAL JOURNEY COMPONENT
========================================= */

function ReferralJourney() {

  const [showModal, setShowModal] =
    useState(false);


  return (

    <>

      <motion.section
        className={styles.journeySection}

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
          margin: '-60px',
        }}

        transition={{
          duration: 0.5,
        }}
      >


        {/* HEADER */}

        <div className={styles.sectionHeader}>

          <div>

            <h2>
              How Refer & Earn Works
            </h2>

          </div>


          <motion.button
            type="button"

            className={styles.viewAllButton}

            onClick={() =>
              setShowModal(true)
            }

            whileHover={{
              x: 3,
            }}

            whileTap={{
              scale: 0.96,
            }}
          >

            View All

            <ChevronRight size={20} />

          </motion.button>

        </div>


        {/* STEPS */}

        <div className={styles.stepsContainer}>

          {referralSteps.map(
            (step, index) => {

              const Icon = step.icon;


              return (

                <div
                  key={step.id}
                  className={styles.stepWrapper}
                >


                  {/* STEP */}

                  <motion.div
                    className={styles.step}

                    initial={{
                      opacity: 0,
                      y: 18,
                    }}

                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}

                    viewport={{
                      once: true,
                    }}

                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                    }}

                    whileHover={{
                      y: -4,
                    }}
                  >


                    {/* NUMBER */}

                    <div
                      className={`${styles.stepNumber} ${
                        styles[
                          `number${step.color}`
                        ]
                      }`}
                    >

                      {step.id}

                    </div>


                    {/* ICON CARD */}

                    <div
                      className={`${styles.iconCard} ${
                        styles[
                          `card${step.color}`
                        ]
                      }`}
                    >

                      <Icon size={38} />

                    </div>


                    {/* TEXT */}

                    <h3>
                      {step.title}
                    </h3>


                    <p>
                      {step.shortDescription}
                    </p>

                  </motion.div>


                  {/* ARROW */}

                  {index <
                    referralSteps.length - 1 && (

                    <div
                      className={styles.arrow}
                    >

                      <div />

                      <ArrowRight size={24} />

                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>


        {/* MOBILE CTA */}

        <button
          type="button"

          className={styles.mobileViewButton}

          onClick={() =>
            setShowModal(true)
          }
        >

          View Referral Journey

          <ArrowRight size={18} />

        </button>

      </motion.section>


      {/* MODAL */}

      <ReferralJourneyModal
        isOpen={showModal}

        onClose={() =>
          setShowModal(false)
        }
      />

    </>

  );

}


export default ReferralJourney;