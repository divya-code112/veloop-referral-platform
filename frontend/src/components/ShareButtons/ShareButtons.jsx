import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
} from 'react-icons/fa';
import {
  Link2,
  Share2,
  Check,
} from 'lucide-react';

import API from '../../utils/api';
import { useWebShare } from '../../hooks/useWebShare';

import styles from './ShareButtons.module.css';

function ShareButtons() {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);

  const { share, isSupported } = useWebShare();

  useEffect(() => {
    fetchReferralCode();
  }, []);

  const fetchReferralCode = async () => {
    try {
      setLoading(true);

      const response = await API.get('/user/profile');

      setReferralCode(
        response.data.user?.referralCode || ''
      );
    } catch (error) {
      console.error(
        'Failed to load referral code:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = referralCode
    ? `${window.location.origin}/register?ref=${referralCode}`
    : '';

  const shareText = referralCode
    ? `Join VELoop Rewards using my referral code ${referralCode} and start earning today!`
    : 'Join VELoop Rewards and start earning today!';

  const whatsappMessage =
    `${shareText} ${shareUrl}`;

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);

      setLinkCopied(true);

      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    const result = await share({
      title: 'VELoop Rewards',
      text: shareText,
      url: shareUrl,
    });

    if (result.unsupported) {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <motion.div
        className={styles.wrapper}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.4,
        }}
      >
        <span className={styles.label}>
          Share via
        </span>

        <div className={styles.buttonRow}>
          <span>Loading...</span>
        </div>
      </motion.div>
    );
  }

  if (!referralCode) {
    return null;
  }

  const buttons = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <FaWhatsapp size={20} />,
      href:
        'https://wa.me/?text=' +
        encodeURIComponent(whatsappMessage),
      colorClass: styles.whatsapp,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: <FaInstagram size={20} />,
      href: 'https://instagram.com',
      colorClass: styles.instagram,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: <FaFacebookF size={20} />,
      href:
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(shareUrl),
      colorClass: styles.facebook,
    },
  ];

  return (
    <motion.div
      className={styles.wrapper}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay: 0.4,
      }}
    >
      <span className={styles.label}>
        Share via
      </span>

      <div className={styles.buttonRow}>
        {buttons.map((btn) => (
          <a
            key={btn.id}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              styles.iconBtn +
              ' ' +
              btn.colorClass
            }
            aria-label={
              'Share via ' + btn.label
            }
          >
            {btn.icon}
          </a>
        ))}

        <button
          className={
            styles.iconBtn +
            ' ' +
            styles.copyLink
          }
          onClick={handleCopyLink}
          aria-label="Copy referral link"
        >
          {linkCopied ? (
            <Check size={20} />
          ) : (
            <Link2 size={20} />
          )}
        </button>

        {isSupported && (
          <button
            className={
              styles.iconBtn +
              ' ' +
              styles.nativeShare
            }
            onClick={handleNativeShare}
            aria-label="More share options"
          >
            <Share2 size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ShareButtons;