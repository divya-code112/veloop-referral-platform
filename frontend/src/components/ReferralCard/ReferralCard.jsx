import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
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

      // Create referral link using current frontend URL
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
    try {
      await navigator.clipboard.writeText(text);

      setCopiedField(field);
      setBurstId((id) => id + 1);

      setToast({
        show: true,
        message: `${label} copied!`,
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

  if (loading) {
    return (
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Your Referral Code</span>
            <span className={styles.value}>Loading...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Referral Code */}
      <div className={styles.row}>
        <div className={styles.field}>
          <span className={styles.label}>Your Referral Code</span>

          <span className={styles.value}>
            {referralCode || 'N/A'}
          </span>
        </div>

        <div className={styles.copyBtnWrap}>
          <ConfettiBurst
            burstId={copiedField === 'code' ? burstId : 0}
          />

          <button
            className={styles.copyBtn}
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
              <Check size={18} />
            ) : (
              <Copy size={18} />
            )}

            {copiedField === 'code' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Referral Link */}
      <div className={styles.row}>
        <div className={styles.field}>
          <span className={styles.label}>Referral Link</span>

          <span className={styles.valueSmall}>
            {referralLink || 'N/A'}
          </span>
        </div>

        <div className={styles.copyBtnWrap}>
          <ConfettiBurst
            burstId={copiedField === 'link' ? burstId : 0}
          />

          <button
            className={styles.copyBtn}
            onClick={() =>
              handleCopy(
                referralLink,
                'link',
                'Referral link'
              )
            }
            disabled={!referralLink}
            aria-label="Copy referral link"
          >
            {copiedField === 'link' ? (
              <Check size={18} />
            ) : (
              <Copy size={18} />
            )}

            {copiedField === 'link' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
      />
    </motion.div>
  );
}

export default ReferralCard;