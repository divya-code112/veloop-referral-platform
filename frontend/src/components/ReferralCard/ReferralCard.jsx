import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Ticket,
  Link as LinkIcon,
  Sparkles,
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

      const link = `${window.location.origin}/register?ref=${user.referralCode}`;

      setReferralLink(link);
    } catch (error) {
      console.error(
        'Failed to load referral information:',
        error.response?.data || error.message
      );

      setToast({
        show: true,
        message: 'Failed to load referral information',
      });

      setTimeout(() => {
        setToast({
          show: false,
          message: '',
        });
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, field, label) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      setCopiedField(field);
      setBurstId((id) => id + 1);

      setToast({
        show: true,
        message: `${label} copied successfully!`,
      });

      setTimeout(() => {
        setCopiedField(null);
      }, 2000);

      setTimeout(() => {
        setToast({
          show: false,
          message: '',
        });
      }, 2200);
    } catch (error) {
      console.error('Copy failed:', error);

      setToast({
        show: true,
        message: 'Failed to copy',
      });

      setTimeout(() => {
        setToast({
          show: false,
          message: '',
        });
      }, 2200);
    }
  };

  return (
    <>
      <motion.section
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
          delay: 0.3,
        }}
      >
        {/* Decorative Glow */}
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />

        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <Sparkles size={20} />
          </div>

          <div>
            <span className={styles.eyebrow}>
              SHARE & EARN
            </span>

            <h2>Your Referral Details</h2>

            <p>
              Invite your friends and earn exciting
              rewards together.
            </p>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className={styles.referralBlock}>
          <div className={styles.blockTop}>
            <div className={styles.labelGroup}>
              <div className={styles.iconBox}>
                <Ticket size={20} />
              </div>

              <div>
                <span className={styles.label}>
                  YOUR REFERRAL CODE
                </span>

                <p>
                  Share this code with your friends
                </p>
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
                className={styles.copyIconButton}
                onClick={() =>
                  handleCopy(
                    referralCode,
                    'code',
                    'Referral code'
                  )
                }
                disabled={!referralCode}
                aria-label="Copy referral code"
              >
                {copiedField === 'code' ? (
                  <Check size={19} />
                ) : (
                  <Copy size={19} />
                )}
              </button>
            </div>
          </div>

          <div className={styles.codeDisplay}>
            {loading
              ? 'LOADING...'
              : referralCode || 'N/A'}
          </div>
        </div>

        {/* Divider */}
        <div className={styles.mainDivider}>
          <span>OR SHARE YOUR LINK</span>
        </div>

        {/* Referral Link */}
        <div className={styles.linkBlock}>
          <div className={styles.linkIcon}>
            <LinkIcon size={20} />
          </div>

          <div className={styles.linkContent}>
            <span className={styles.label}>
              PERSONAL REFERRAL LINK
            </span>

            <div className={styles.linkValue}>
              {loading
                ? 'Loading your referral link...'
                : referralLink || 'N/A'}
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
              className={styles.copyLinkButton}
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
                  Copy Link
                </>
              )}
            </button>
          </div>
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