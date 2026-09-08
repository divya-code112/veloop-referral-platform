import { useState } from 'react';

import {
  X,
  Play,
  ShieldCheck,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  Zap,
  Trophy,
} from 'lucide-react';

import API from '../../utils/api';

import styles from './TaskModal.module.css';

function TaskModal({
  task,
  onClose,
  onComplete,
}) {
  const [loading, setLoading] = useState(false);

  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const [quizAnswer, setQuizAnswer] = useState('');

  const [message, setMessage] = useState('');

  const [successData, setSuccessData] = useState(null);

  /*
   * COMPLETE TASK
   */
  const completeTask = async () => {
    try {
      setLoading(true);
      setMessage('');
      setSuccessData(null);

      const response = await API.post(
        `/tasks/${task.id}/complete`
      );

      const data = response.data?.data;

      setSuccessData(data);

      const xpEarned =
        data?.userProgress?.xpEarned || 0;

      const totalXp =
        data?.userProgress?.totalXp || 0;

      const level =
        data?.userProgress?.level || 1;

      const leveledUp =
        data?.userProgress?.leveledUp;

      setMessage(
        leveledUp
          ? `🎉 Level Up! You are now Level ${level}! +${xpEarned} XP earned.`
          : `Task completed! +${xpEarned} XP earned. Total XP: ${totalXp}`
      );

      /*
       * IMPORTANT:
       * Notify all referral components
       * to refresh their latest backend data.
       */
      window.dispatchEvent(
        new Event('veloopDataUpdated')
      );

      /*
       * Wait before closing modal.
       */
      setTimeout(() => {
        onComplete(task.id, data);
      }, 1800);

    } catch (error) {
      console.error(
        error.response?.data ||
        error.message
      );

      setMessage(
        error.response?.data?.message ||
        'Failed to complete task'
      );

    } finally {
      setLoading(false);
    }
  };

  /*
   * WATCH AD
   */
  const renderWatchAd = () => (
    <div className={styles.taskContent}>

      <div className={styles.bigIcon}>
        <Play size={42} />
      </div>

      <h2>{task.title}</h2>

      <p>
        Watch the advertisement completely
        to earn XP and task progress.
      </p>

      <div className={styles.adBox}>
        <div className={styles.adPlaceholder}>
          Advertisement Preview
        </div>
      </div>

      <div className={styles.rewardPreview}>
        <Zap size={17} />
        Earn {task.xpReward || 0} XP
      </div>

      <button
        className={styles.primaryButton}
        onClick={completeTask}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className={styles.spinner}
            />
            Completing...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            Complete Advertisement
          </>
        )}
      </button>

    </div>
  );

  /*
   * CAPTCHA
   */
  const renderCaptcha = () => {
    const correctAnswer = 'VELOOP';

    const verifyCaptcha = () => {
      if (
        captchaAnswer
          .trim()
          .toUpperCase() !== correctAnswer
      ) {
        setMessage(
          'Incorrect CAPTCHA. Try again.'
        );

        return;
      }

      completeTask();
    };

    return (
      <div className={styles.taskContent}>

        <div className={styles.bigIcon}>
          <ShieldCheck size={42} />
        </div>

        <h2>{task.title}</h2>

        <p>
          Enter the verification code below.
        </p>

        <div className={styles.captchaBox}>
          VELOOP
        </div>

        <input
          className={styles.input}
          placeholder="Enter CAPTCHA"
          value={captchaAnswer}
          onChange={(e) =>
            setCaptchaAnswer(e.target.value)
          }
        />

        <div className={styles.rewardPreview}>
          <Zap size={17} />
          Earn {task.xpReward || 0} XP
        </div>

        <button
          className={styles.primaryButton}
          onClick={verifyCaptcha}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className={styles.spinner}
              />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              Verify CAPTCHA
            </>
          )}
        </button>

      </div>
    );
  };

  /*
   * QUIZ
   */
  const renderQuiz = () => {
    const quizData = {
      'Quick Quiz': {
        question:
          'Which language is commonly used for React development?',
        options: [
          'Python',
          'JavaScript',
          'Java',
          'C++',
        ],
        answer: 'JavaScript',
      },

      'Advanced Referral Quiz': {
        question:
          'What is the main purpose of a referral system?',
        options: [
          'Increase user acquisition',
          'Delete user accounts',
          'Reduce database storage',
          'Block registrations',
        ],
        answer:
          'Increase user acquisition',
      },

      'Human Verification Challenge': {
        question:
          'Which activity best proves that a user is human?',
        options: [
          'Completing a challenge',
          'Refreshing the page',
          'Closing the browser',
          'Changing the theme',
        ],
        answer:
          'Completing a challenge',
      },

      'VELoop Master Challenge': {
        question:
          'Which combination is most important for building a scalable web application?',
        options: [
          'Frontend only',
          'Backend only',
          'Database only',
          'Frontend, Backend, Database and Security',
        ],
        answer:
          'Frontend, Backend, Database and Security',
      },
    };

    const quiz =
      quizData[task.title] ||
      quizData['Quick Quiz'];

    const submitQuiz = () => {
      if (quizAnswer !== quiz.answer) {
        setMessage(
          'Incorrect answer. Try again.'
        );

        return;
      }

      completeTask();
    };

    return (
      <div className={styles.taskContent}>

        <div className={styles.bigIcon}>
          <BrainCircuit size={42} />
        </div>

        <h2>{task.title}</h2>

        <p className={styles.question}>
          {quiz.question}
        </p>

        <div className={styles.options}>
          {quiz.options.map((option) => (
            <button
              key={option}
              className={`${styles.option} ${
                quizAnswer === option
                  ? styles.selectedOption
                  : ''
              }`}
              onClick={() =>
                setQuizAnswer(option)
              }
            >
              {option}
            </button>
          ))}
        </div>

        <div className={styles.rewardPreview}>
          <Zap size={17} />
          Earn {task.xpReward || 0} XP
        </div>

        <button
          className={styles.primaryButton}
          onClick={submitQuiz}
          disabled={
            !quizAnswer ||
            loading
          }
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className={styles.spinner}
              />
              Checking...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              Submit Answer
            </>
          )}
        </button>

      </div>
    );
  };

  /*
   * DAILY CHECK-IN
   */
  const renderDailyCheckin = () => (
    <div className={styles.taskContent}>

      <div className={styles.bigIcon}>
        <CalendarCheck size={42} />
      </div>

      <h2>{task.title}</h2>

      <p>
        Check in today to maintain your
        activity and earn XP.
      </p>

      <div className={styles.checkinDate}>
        Today is{' '}
        {new Date().toLocaleDateString(
          undefined,
          {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )}
      </div>

      <div className={styles.rewardPreview}>
        <Zap size={17} />
        Earn {task.xpReward || 0} XP
      </div>

      <button
        className={styles.primaryButton}
        onClick={completeTask}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className={styles.spinner}
            />
            Checking In...
          </>
        ) : (
          <>
            <CalendarCheck size={18} />
            Check In Today
          </>
        )}
      </button>

    </div>
  );

  /*
   * RENDER TASK
   */
  const renderTask = () => {
    switch (task.type) {
      case 'WATCH_AD':
        return renderWatchAd();

      case 'CAPTCHA':
        return renderCaptcha();

      case 'QUIZ':
        return renderQuiz();

      case 'DAILY_CHECKIN':
        return renderDailyCheckin();

      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <button
          className={styles.closeButton}
          onClick={onClose}
          disabled={loading}
        >
          <X size={20} />
        </button>

        {renderTask()}

        {successData?.userProgress && (
          <div
            className={styles.successProgress}
          >
            <Trophy size={20} />

            <div>
              <strong>
                Level {
                  successData
                    .userProgress
                    .level
                }
              </strong>

              <span>
                Total XP:{' '}
                {
                  successData
                    .userProgress
                    .totalXp
                }
              </span>
            </div>

          </div>
        )}

        {message && (
          <div className={styles.message}>
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default TaskModal;