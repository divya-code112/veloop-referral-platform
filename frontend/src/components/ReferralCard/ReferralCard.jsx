import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import {
  Copy,
  Check,
  Ticket,
  Link as LinkIcon,
  Sparkles,
  Share2,
} from 'lucide-react';

import ConfettiBurst from '../common/ConfettiBurst';
import Toast from '../common/Toast';
import API from '../../utils/api';

import styles from './ReferralCard.module.css';


function ReferralCard() {
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');

  const [copiedField, setCopiedField] = useState(null);
  const [burstId, setBurstId] = useState(0);

  const [toast, setToast] = useState({
    show: false,
    message: '',
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchReferralData();
  }, []);


  const fetchReferralData = async () => {
    try {
      const response = await API.get('/user/profile');

      const user = response.data.user;

      setReferralCode(user.referralCode);

      const link =
        `${window.location.origin}/register?ref=${user.referralCode}`;

      setReferralLink(link);

    } catch (error) {

      console.error(
        'Failed to load referral information:',
        error.response?.data || error.message
      );

      showToast('Failed to load referral information');

    } finally {
      setLoading(false);
    }
  };


  const showToast = (message) => {
    setToast({
      show: true,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
      });
    }, 2200);
  };


  const handleCopy = async (text, field, label) => {

    if (!text) return;

    try {

      await navigator.clipboard.writeText(text);

      setCopiedField(field);
      setBurstId((id) => id + 1);

      showToast(`${label} copied successfully!`);

      setTimeout(() => {
        setCopiedField(null);
      }, 2000);

    } catch (error) {

      console.error('Copy failed:', error);

      showToast('Failed to copy');
    }
  };


  const handleShare = async () => {

    if (!referralLink) return;

    try {

      if (navigator.share) {

        await navigator.share({
          title: 'Join using my referral link',
          text: 'Join and earn rewards using my referral link!',
          url: referralLink,
        });

      } else {

        await navigator.clipboard.writeText(referralLink);

        showToast('Referral link copied! Share it with your friends.');
      }

    } catch (error) {

      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };


  return (
    <>
      <motion.section
        id="referral-section"
        className={styles.referralSection}
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

        {/* Background Effects */}
        <div className={styles.backgroundGlowOne} />
        <div className={styles.backgroundGlowTwo} />


        {/* Header */}

        <div className={styles.cardHeader}>

          <div className={styles.headerBadge}>
            <Sparkles size={14} />
            REFER & EARN
          </div>

          <h2>
            Invite Friends.
            <span> Earn Together.</span>
          </h2>

          <p>
            Share your referral code or personal link with friends
            and unlock exciting rewards together.
          </p>

        </div>


        {/* Referral Details */}

        <div className={styles.referralDetails}>


          {/* Referral Code */}

          <div className={styles.detailRow}>

            <div className={styles.detailIcon}>
              <Ticket size={20} />
            </div>


            <div className={styles.detailContent}>

              <span className={styles.detailLabel}>
                YOUR REFERRAL CODE
              </span>

              <div className={styles.referralCodeValue}>
                {loading
                  ? 'LOADING...'
                  : referralCode || 'N/A'
                }
              </div>

            </div>


            <div className={styles.copyBtnWrap}>

              <ConfettiBurst
                burstId={
                  copiedField === 'code'
                    ? burstId
                    : 0
                }
              />

              <button
                className={styles.copyButton}
                onClick={() =>
                  handleCopy(
                    referralCode,
                    'code',
                    'Referral code'
                  )
                }
                disabled={!referralCode}
              >

                {copiedField === 'code' ? (
                  <>
                    <Check size={17} />
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


          {/* Divider */}

          <div className={styles.rowDivider} />


          {/* Referral Link */}

          <div className={styles.detailRow}>

            <div className={`${styles.detailIcon} ${styles.linkDetailIcon}`}>
              <LinkIcon size={20} />
            </div>


            <div className={styles.detailContent}>

              <span className={styles.detailLabel}>
                YOUR REFERRAL LINK
              </span>

              <div className={styles.referralLinkValue}>
                {loading
                  ? 'Loading your referral link...'
                  : referralLink || 'N/A'
                }
              </div>

            </div>


            <div className={styles.copyBtnWrap}>

              <ConfettiBurst
                burstId={
                  copiedField === 'link'
                    ? burstId
                    : 0
                }
              />

              <button
                className={styles.copyButton}
                onClick={() =>
                  handleCopy(
                    referralLink,
                    'link',
                    'Referral link'
                  )
                }
                disabled={!referralLink}
              >

                {copiedField === 'link' ? (
                  <>
                    <Check size={17} />
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

        </div>


        {/* Share CTA */}

        <motion.button
          className={styles.shareButton}
          onClick={handleShare}
          disabled={!referralLink}
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >

          <Share2 size={19} />

          Share Your Link

          <span className={styles.arrow}>→</span>

        </motion.button>


        {/* Bottom Hint */}

        <div className={styles.bottomInfo}>
          <Sparkles size={14} />

          <span>
            Every successful referral brings you closer to more rewards.
          </span>
        </div>

      </motion.section>


      <Toast
        show={toast.show}
        message={toast.message}
      />

    </>
  );
}


export default ReferralCard;