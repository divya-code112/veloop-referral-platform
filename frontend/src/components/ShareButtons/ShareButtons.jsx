import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTelegramPlane,
  FaTwitter,
} from 'react-icons/fa';

import {
  MoreHorizontal,
  Check,
  Share2,
} from 'lucide-react';

import API from '../../utils/api';
import { useWebShare } from '../../hooks/useWebShare';

import styles from './ShareButtons.module.css';

function ShareButtons() {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);

  const { share } = useWebShare();

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

  const whatsappMessage = `${shareText} ${shareUrl}`;

  const handleMoreShare = async () => {
    if (!shareUrl) return;

    try {
      const result = await share({
        title: 'VELoop Rewards',
        text: shareText,
        url: shareUrl,
      });

      if (result?.unsupported) {
        await navigator.clipboard.writeText(shareUrl);

        setShared(true);

        setTimeout(() => {
          setShared(false);
        }, 2000);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };

  if (loading || !referralCode) {
    return null;
  }

  const buttons = [
    {
      id: 'whatsapp',
      label: 'Share on WhatsApp',
      icon: <FaWhatsapp size={20} />,
      href:
        'https://wa.me/?text=' +
        encodeURIComponent(whatsappMessage),
      colorClass: styles.whatsapp,
    },

    {
      id: 'telegram',
      label: 'Share on Telegram',
      icon: <FaTelegramPlane size={19} />,
      href:
        'https://t.me/share/url?url=' +
        encodeURIComponent(shareUrl) +
        '&text=' +
        encodeURIComponent(shareText),
      colorClass: styles.telegram,
    },

    {
      id: 'instagram',
      label: 'Share on Instagram',
      icon: <FaInstagram size={20} />,
      href: 'https://www.instagram.com/',
      colorClass: styles.instagram,
    },

    {
      id: 'facebook',
      label: 'Share on Facebook',
      icon: <FaFacebookF size={19} />,
      href:
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(shareUrl),
      colorClass: styles.facebook,
    },

    {
      id: 'twitter',
      label: 'Share on X',
      icon: <FaTwitter size={19} />,
      href:
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(shareText) +
        '&url=' +
        encodeURIComponent(shareUrl),
      colorClass: styles.twitter,
    },
  ];

  return (
    <section className={styles.shareSection}>
      {/* =========================================
          SHARE EXPERIENCE
      ========================================= */}

      <div className={styles.shareTop}>
        {/* SHARE CONTENT */}

        <div className={styles.shareContent}>
          <div className={styles.shareHeading}>
            <div className={styles.shareIcon}>
              <Share2 size={18} />
            </div>

            <div className={styles.headingText}>
              <span className={styles.eyebrow}>
                SHARE & EARN
              </span>

              <h3>
                Share your referral
              </h3>

              <p>
                Invite friends through your favorite
                platform and start earning rewards
                together.
              </p>
            </div>
          </div>

          {/* SOCIAL BUTTONS */}

          <div className={styles.socialArea}>
            <span className={styles.socialLabel}>
              Share via
            </span>

            <div className={styles.socialButtons}>
              {buttons.map((btn, index) => (
                <motion.a
                  key={btn.id}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={btn.label}
                  title={btn.label}
                  className={`${styles.socialButton} ${btn.colorClass}`}
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
                    duration: 0.3,
                    delay: index * 0.06,
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                >
                  {btn.icon}
                </motion.a>
              ))}

              <motion.button
                type="button"
                className={`${styles.socialButton} ${styles.moreButton}`}
                onClick={handleMoreShare}
                aria-label="More sharing options"
                title="More sharing options"
                whileHover={{
                  y: -4,
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.94,
                }}
              >
                {shared ? (
                  <Check size={19} />
                ) : (
                  <MoreHorizontal size={21} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ILLUSTRATION */}

        <motion.div
          className={styles.illustrationWrapper}
          initial={{
            opacity: 0,
            x: 18,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.55,
            ease: 'easeOut',
          }}
        >
          <div
            className={styles.illustrationGlow}
            aria-hidden="true"
          />

          <img
            src="/illustrations/share-referral.avif"
            alt="Share your VELoop referral with friends"
            className={styles.illustration}
            width="175"
            height="165"
            decoding="async"
          />
        </motion.div>
      </div>

      {/* REFERRAL CODE */}

      <motion.div
        className={styles.referralHint}
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
      >
        <span>
          Your referral code
        </span>

        <strong>
          {referralCode}
        </strong>
      </motion.div>
    </section>
  );
}

export default ShareButtons;