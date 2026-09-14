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
} from 'lucide-react';

import API from '../../utils/api';
import { useWebShare } from '../../hooks/useWebShare';

import styles from './ShareButtons.module.css';


function ShareButtons() {

  const [referralCode, setReferralCode] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [shared, setShared] =
    useState(false);


  const {
    share,
  } = useWebShare();


  useEffect(() => {

    fetchReferralCode();

  }, []);


  const fetchReferralCode = async () => {

    try {

      setLoading(true);

      const response =
        await API.get('/user/profile');


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


  const handleMoreShare = async () => {

    if (!shareUrl) return;


    try {

      const result = await share({

        title:
          'VELoop Rewards',

        text:
          shareText,

        url:
          shareUrl,

      });


      if (result?.unsupported) {

        await navigator.clipboard.writeText(
          shareUrl
        );

        setShared(true);

        setTimeout(() => {

          setShared(false);

        }, 2000);

      }

    } catch (error) {

      if (error.name !== 'AbortError') {

        console.error(
          'Share failed:',
          error
        );

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

      icon:
        <FaWhatsapp size={20} />,

      href:
        'https://wa.me/?text=' +
        encodeURIComponent(
          whatsappMessage
        ),

      colorClass:
        styles.whatsapp,
    },


    {
      id: 'telegram',

      label: 'Share on Telegram',

      icon:
        <FaTelegramPlane size={19} />,

      href:
        'https://t.me/share/url?url=' +
        encodeURIComponent(shareUrl) +
        '&text=' +
        encodeURIComponent(shareText),

      colorClass:
        styles.telegram,
    },


    {
      id: 'instagram',

      label: 'Share on Instagram',

      icon:
        <FaInstagram size={20} />,

      href:
        'https://www.instagram.com/',

      colorClass:
        styles.instagram,
    },


    {
      id: 'facebook',

      label: 'Share on Facebook',

      icon:
        <FaFacebookF size={19} />,

      href:
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(shareUrl),

      colorClass:
        styles.facebook,
    },


    {
      id: 'twitter',

      label: 'Share on Twitter',

      icon:
        <FaTwitter size={19} />,

      href:
        'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(shareText) +
        '&url=' +
        encodeURIComponent(shareUrl),

      colorClass:
        styles.twitter,
    },

  ];


  return (

    <section
      className={styles.shareSection}
    >

      <div
        className={styles.shareContainer}
      >

        <span
          className={styles.shareLabel}
        >
          Share via
        </span>


        <div
          className={styles.socialButtons}
        >

          {

            buttons.map((btn, index) => (

              <motion.a

                key={btn.id}

                href={btn.href}

                target="_blank"

                rel="noopener noreferrer"

                aria-label={btn.label}

                className={
                  `${styles.socialButton}
                  ${btn.colorClass}`
                }

                initial={{
                  opacity: 0,
                  y: 10,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  duration: 0.3,
                  delay: index * 0.06,
                }}

                whileHover={{
                  y: -3,
                  scale: 1.05,
                }}

                whileTap={{
                  scale: 0.95,
                }}

              >

                {btn.icon}

              </motion.a>

            ))

          }


          {/* More Share Options */}

          <motion.button

            type="button"

            className={
              `${styles.socialButton}
              ${styles.moreButton}`
            }

            onClick={handleMoreShare}

            aria-label="More sharing options"

            whileHover={{
              y: -3,
              scale: 1.04,
            }}

            whileTap={{
              scale: 0.95,
            }}

          >

            {

              shared

                ? <Check size={19} />

                : <MoreHorizontal size={22} />

            }

            <span>
              {shared ? 'Copied' : 'More'}
            </span>

          </motion.button>

        </div>

      </div>

    </section>

  );

}


export default ShareButtons;