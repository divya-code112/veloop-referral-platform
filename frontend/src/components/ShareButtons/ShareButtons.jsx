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
  Send,
} from 'lucide-react';

import API from '../../utils/api';
import { useWebShare } from '../../hooks/useWebShare';

import styles from './ShareButtons.module.css';


function ShareButtons() {

  const [referralCode, setReferralCode] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [linkCopied, setLinkCopied] =
    useState(false);


  const {
    share,
    isSupported,
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


  const handleCopyLink = async () => {

    if (!shareUrl) return;


    try {

      await navigator.clipboard.writeText(
        shareUrl
      );


      setLinkCopied(true);


      setTimeout(() => {

        setLinkCopied(false);

      }, 2000);

    } catch (error) {

      console.error(
        'Copy failed:',
        error
      );

    }

  };


  const handleNativeShare = async () => {

    if (!shareUrl) return;


    const result =
      await share({

        title:
          'VELoop Rewards',

        text:
          shareText,

        url:
          shareUrl,

      });


    if (result.unsupported) {

      handleCopyLink();

    }

  };


  if (loading) {

    return (

      <motion.section

        className={
          styles.shareSection
        }

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

      >

        <div
          className={
            styles.loadingState
          }
        >

          Loading sharing options...

        </div>

      </motion.section>

    );

  }


  if (!referralCode) {

    return null;

  }


  const buttons = [

    {
      id: 'whatsapp',

      label: 'WhatsApp',

      description:
        'Share instantly',

      icon:
        <FaWhatsapp size={21} />,

      href:
        'https://wa.me/?text=' +
        encodeURIComponent(
          whatsappMessage
        ),

      colorClass:
        styles.whatsapp,
    },


    {
      id: 'instagram',

      label: 'Instagram',

      description:
        'Tell your followers',

      icon:
        <FaInstagram size={21} />,

      href:
        'https://instagram.com',

      colorClass:
        styles.instagram,
    },


    {
      id: 'facebook',

      label: 'Facebook',

      description:
        'Share with friends',

      icon:
        <FaFacebookF size={20} />,

      href:
        'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(
          shareUrl
        ),

      colorClass:
        styles.facebook,
    },

  ];


  return (

    <motion.section

      className={
        styles.shareSection
      }

      initial={{
        opacity: 0,
        y: 25,
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


      {/* Background Glow */}

      <div
        className={
          styles.glowLeft
        }
      />


      <div
        className={
          styles.glowRight
        }
      />


      {/* Header */}

      <div
        className={
          styles.shareHeader
        }
      >

        <div
          className={
            styles.headerIcon
          }
        >

          <Send size={19} />

        </div>


        <div>

          <span
            className={
              styles.eyebrow
            }
          >

            SPREAD THE WORD

          </span>


          <h3>

            Share & Grow Together

          </h3>


          <p>

            Invite your friends using your
            favorite social platform.

          </p>

        </div>

      </div>


      {/* Social Buttons */}

      <div
        className={
          styles.socialGrid
        }
      >

        {

          buttons.map((btn) => (

            <motion.a

              key={btn.id}

              href={btn.href}

              target="_blank"

              rel="noopener noreferrer"

              className={
                `${styles.socialCard}
                ${btn.colorClass}`
              }

              whileHover={{
                y: -5,
              }}

              whileTap={{
                scale: 0.97,
              }}

            >

              <div
                className={
                  styles.socialIcon
                }
              >

                {btn.icon}

              </div>


              <div
                className={
                  styles.socialText
                }
              >

                <strong>

                  {btn.label}

                </strong>


                <span>

                  {btn.description}

                </span>

              </div>


              <div
                className={
                  styles.arrow
                }
              >

                →

              </div>

            </motion.a>

          ))

        }

      </div>


      {/* Bottom Actions */}

      <div
        className={
          styles.actionDivider
        }
      >

        <span>

          MORE OPTIONS

        </span>

      </div>


      <div
        className={
          styles.utilityActions
        }
      >


        {/* Copy Link */}

        <button

          className={
            styles.utilityButton
          }

          onClick={
            handleCopyLink
          }

        >

          <div
            className={
              styles.utilityIcon
            }
          >

            {

              linkCopied

                ? <Check size={19} />

                : <Link2 size={19} />

            }

          </div>


          <span>

            {

              linkCopied

                ? 'Link Copied!'
                : 'Copy Referral Link'

            }

          </span>

        </button>


        {/* Native Share */}

        {

          isSupported && (

            <button

              className={
                `${styles.utilityButton}
                ${styles.primaryAction}`
              }

              onClick={
                handleNativeShare
              }

            >

              <div
                className={
                  styles.utilityIcon
                }
              >

                <Share2 size={19} />

              </div>


              <span>

                More Share Options

              </span>

            </button>

          )

        }

      </div>


    </motion.section>

  );

}


export default ShareButtons;