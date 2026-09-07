import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import {
  PlayCircle,
  ShieldCheck,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Lock,
  Trophy,
  Zap,
  Star,
  Flame,
  Target,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import Header from '../components/Header/Header';
import TaskModal from '../components/tasks/TaskModal';
import API from '../utils/api';

import styles from './TasksPage.module.css';


const taskIcons = {
  WATCH_AD: PlayCircle,
  CAPTCHA: ShieldCheck,
  QUIZ: BrainCircuit,
  DAILY_CHECKIN: CalendarCheck,
};


const difficultyLabels = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert',
};


function TasksPage() {

  const navigate = useNavigate();


  /* ================================
     STATE
  ================================= */

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [completedTasks, setCompletedTasks] =
    useState([]);

  const [userProgress, setUserProgress] =
    useState({
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: null,
    });


  /* ================================
     LOAD DATA
  ================================= */

  useEffect(() => {
    loadTaskData();
  }, []);


  const loadTaskData = async () => {

    try {

      setLoading(true);


      const [
        tasksResponse,
        completionsResponse,
      ] = await Promise.all([

        API.get('/tasks'),

        API.get(
          '/tasks/my-completions'
        ),

      ]);


      /* ================================
         TASKS
      ================================= */

      setTasks(
        tasksResponse.data.tasks || []
      );


      /* ================================
         COMPLETED TASKS
      ================================= */

      const completions =
        completionsResponse.data.completions ||
        [];


      const completedIds = [

        ...new Set(

          completions.map(
            (completion) =>
              completion.taskId
          )

        ),

      ];


      setCompletedTasks(
        completedIds
      );


      /* ================================
         USER PROGRESS
      ================================= */

      if (
        completionsResponse.data
          .userProgress
      ) {

        setUserProgress((prev) => ({

          ...prev,

          ...completionsResponse
            .data
            .userProgress,

        }));

      }


    } catch (error) {

      console.error(

        'Failed to load tasks:',

        error.response?.data ||
        error.message

      );

    } finally {

      setLoading(false);

    }

  };


  /* ================================
     TASK COMPLETION
  ================================= */

  const handleTaskComplete = (
    taskId,
    completionData
  ) => {


    const completedTask =
      tasks.find(
        (task) =>
          task.id === taskId
      );


    /*
     * Only permanently complete
     * non-repeatable tasks.
     */

    if (

      completedTask &&

      !completedTask.repeatable &&

      completedTask.type !==
        'DAILY_CHECKIN'

    ) {

      setCompletedTasks((prev) => [

        ...new Set([
          ...prev,
          taskId,
        ]),

      ]);

    }


    /* ================================
       UPDATE USER PROGRESS
    ================================= */

    if (
      completionData?.userProgress
    ) {

      setUserProgress((prev) => ({

        ...prev,

        xp:
          completionData
            .userProgress
            .totalXp ??
          prev.xp,

        level:
          completionData
            .userProgress
            .level ??
          prev.level,

        currentStreak:
          completionData
            .userProgress
            .currentStreak ??
          prev.currentStreak,

        longestStreak:
          completionData
            .userProgress
            .longestStreak ??
          prev.longestStreak,

        lastCheckIn:
          completionData
            .userProgress
            .lastCheckIn ??
          prev.lastCheckIn,

      }));

    }


    /* CLOSE MODAL */

    setSelectedTask(null);


    /*
     * Reload latest backend data.
     */

    setTimeout(() => {

      loadTaskData();

    }, 300);

  };


  /* ================================
     CHECK TASK STATUS
  ================================= */

  const isCompleted = (task) => {


    /*
     * Daily check-in is controlled
     * by backend.
     *
     * It should become available
     * again on the next day.
     */

    if (
      task.type ===
      'DAILY_CHECKIN'
    ) {

      return false;

    }


    return completedTasks.includes(
      task.id
    );

  };


  /* ================================
     DIFFICULTY CLASS
  ================================= */

  const getDifficultyClass = (
    difficulty
  ) => {

    if (!difficulty) return '';


    return (

      styles[

        `difficulty${difficulty
          .charAt(0)
          .toUpperCase()}${difficulty
          .slice(1)
          .toLowerCase()}`

      ] || ''

    );

  };


  /* ================================
     XP CALCULATIONS
  ================================= */

  const xpPerLevel = 100;


  const currentLevelXp =
    userProgress.xp %
    xpPerLevel;


  const xpProgress =
    (currentLevelXp / xpPerLevel) *
    100;


  const xpRemaining =
    currentLevelXp === 0 &&
    userProgress.xp > 0

      ? xpPerLevel

      : xpPerLevel -
        currentLevelXp;


  return (

    <div className={styles.page}>


      {/* HEADER */}

      <Header />


      <main className={styles.main}>


        <div className="container">


          {/* ================================
             BACK BUTTON
          ================================= */}

          <motion.button

            className={
              styles.backButton
            }

            onClick={() =>
              navigate('/')
            }

            whileHover={{
              x: -4,
            }}

            whileTap={{
              scale: 0.96,
            }}

          >

            <ArrowLeft size={18} />

            Back to Referral

          </motion.button>


          {/* ================================
             HERO
          ================================= */}

          <motion.div

            className={styles.hero}

            initial={{
              opacity: 0,
              y: 25,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.5,
            }}

          >

            <span
              className={
                styles.eyebrow
              }
            >

              VELoop Activities

            </span>


            <h1>

              Complete <span>Tasks</span>

            </h1>


            <p>

              Complete activities,
              earn XP, increase your
              level, maintain your
              streak, and progress
              toward exciting rewards.

            </p>

          </motion.div>


          {/* ================================
             GAMIFICATION DASHBOARD
          ================================= */}

          {!loading && (

            <motion.div

              className={
                styles.gamificationDashboard
              }

              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                delay: 0.1,
              }}

            >


              {/* ================================
                 LEVEL PROGRESS CARD
              ================================= */}

              <div
                className={
                  styles.levelProgressCard
                }
              >


                {/* LEVEL HEADER */}

                <div
                  className={
                    styles.levelHeader
                  }
                >


                  <div
                    className={
                      styles.levelIcon
                    }
                  >

                    <Trophy size={28} />

                  </div>


                  <div
                    className={
                      styles.levelInfo
                    }
                  >

                    <span>
                      Current Level
                    </span>

                    <strong>
                      Level {
                        userProgress.level
                      }
                    </strong>

                  </div>


                  {/* TOTAL XP */}

                  <div
                    className={
                      styles.xpTotal
                    }
                  >

                    <Zap size={16} />

                    {userProgress.xp} XP

                  </div>

                </div>


                {/* ================================
                   XP PROGRESS
                ================================= */}

                <div
                  className={
                    styles.xpProgressSection
                  }
                >


                  <div
                    className={
                      styles.xpProgressText
                    }
                  >

                    <span>

                      {currentLevelXp} / {
                        xpPerLevel
                      } XP

                    </span>


                    <span>

                      {Math.round(
                        xpProgress
                      )}% Complete

                    </span>

                  </div>


                  {/* PROGRESS BAR */}

                  <div
                    className={
                      styles.progressBar
                    }
                  >

                    <motion.div

                      className={
                        styles.progressFill
                      }

                      initial={{
                        width: 0,
                      }}

                      animate={{
                        width:
                          `${xpProgress}%`,
                      }}

                      transition={{
                        duration: 0.8,
                        ease: 'easeOut',
                      }}

                    />

                  </div>


                  {/* NEXT LEVEL */}

                  <div
                    className={
                      styles.nextLevelText
                    }
                  >

                    <Target size={14} />

                    {xpRemaining} XP to
                    reach Level {
                      userProgress.level + 1
                    }

                  </div>

                </div>

              </div>


              {/* ================================
                 STATS DASHBOARD
              ================================= */}

              <div
                className={
                  styles.statsDashboard
                }
              >


                {/* TASKS COMPLETED */}

                <div
                  className={
                    styles.progressCard
                  }
                >

                  <div
                    className={
                      styles.taskProgressIcon
                    }
                  >

                    <CheckCircle2
                      size={24}
                    />

                  </div>


                  <div>

                    <span
                      className={
                        styles.progressLabel
                      }
                    >

                      Tasks Completed

                    </span>


                    <strong>

                      {
                        completedTasks.length
                      }

                    </strong>

                  </div>

                </div>


                {/* CURRENT STREAK */}

                <div
                  className={
                    styles.progressCard
                  }
                >

                  <div
                    className={
                      styles.streakIcon
                    }
                  >

                    <Flame size={24} />

                  </div>


                  <div>

                    <span
                      className={
                        styles.progressLabel
                      }
                    >

                      Current Streak

                    </span>


                    <strong>

                      {
                        userProgress
                          .currentStreak || 0
                      } Days

                    </strong>

                  </div>

                </div>


                {/* LONGEST STREAK */}

                <div
                  className={
                    styles.progressCard
                  }
                >

                  <div
                    className={
                      styles.longestStreakIcon
                    }
                  >

                    <Trophy size={24} />

                  </div>


                  <div>

                    <span
                      className={
                        styles.progressLabel
                      }
                    >

                      Longest Streak

                    </span>


                    <strong>

                      {
                        userProgress
                          .longestStreak || 0
                      } Days

                    </strong>

                  </div>

                </div>

              </div>

            </motion.div>

          )}


          {/* ================================
             LOADING
          ================================= */}

          {loading ? (

            <div
              className={
                styles.loading
              }
            >

              <Loader2

                size={36}

                className={
                  styles.spinner
                }

              />


              <p>
                Loading tasks...
              </p>

            </div>


          ) : tasks.length === 0 ? (


            /* ================================
               EMPTY STATE
            ================================= */

            <div
              className={
                styles.empty
              }
            >

              <Lock size={36} />


              <h3>
                No tasks available
              </h3>


              <p>

                Please check back later
                for new activities.

              </p>

            </div>


          ) : (


            /* ================================
               TASK GRID
            ================================= */

            <div
              className={
                styles.tasksGrid
              }
            >


              {tasks.map(
                (task, index) => {


                  const Icon =

                    taskIcons[
                      task.type
                    ] ||

                    Star;


                  const completed =
                    isCompleted(task);


                  return (

                    <motion.div

                      key={task.id}

                      className={`${
                        styles.taskCard
                      } ${
                        completed
                          ? styles.completedCard
                          : ''
                      }`}


                      initial={{
                        opacity: 0,
                        y: 30,
                      }}


                      animate={{
                        opacity: 1,
                        y: 0,
                      }}


                      transition={{
                        duration: 0.45,
                        delay:
                          index * 0.08,
                      }}

                    >


                      {/* COMPLETED MARK */}

                      {completed && (

                        <div
                          className={
                            styles.completedMark
                          }
                        >

                          <CheckCircle2
                            size={20}
                          />

                        </div>

                      )}


                      {/* TASK ICON */}

                      <div
                        className={
                          styles.iconBox
                        }
                      >

                        <Icon size={28} />

                      </div>


                      {/* TAGS */}

                      <div
                        className={
                          styles.taskTags
                        }
                      >


                        <span
                          className={
                            styles.taskType
                          }
                        >

                          {task.type.replaceAll(
                            '_',
                            ' '
                          )}

                        </span>


                        {task.difficulty && (

                          <span

                            className={`${
                              styles.difficultyBadge
                            } ${
                              getDifficultyClass(
                                task.difficulty
                              )
                            }`}

                          >

                            {
                              difficultyLabels[
                                task.difficulty
                              ] ||
                              task.difficulty
                            }

                          </span>

                        )}

                      </div>


                      {/* TASK CONTENT */}

                      <h3>

                        {task.title}

                      </h3>


                      <p>

                        {task.description}

                      </p>


                      {/* XP REWARD */}

                      <div
                        className={
                          styles.xpReward
                        }
                      >

                        <Zap size={16} />


                        <span>

                          +{
                            task.xpReward || 0
                          } XP

                        </span>

                      </div>


                      {/* START BUTTON */}

                      <button

                        className={`${
                          styles.startButton
                        } ${
                          completed
                            ? styles.doneButton
                            : ''
                        }`}


                        onClick={() =>

                          !completed &&

                          setSelectedTask(
                            task
                          )

                        }


                        disabled={
                          completed
                        }

                      >


                        {completed ? (

                          <>

                            <CheckCircle2
                              size={17}
                            />

                            Completed

                          </>

                        ) : (

                          <>

                            Start Task

                            <PlayCircle
                              size={17}
                            />

                          </>

                        )}

                      </button>

                    </motion.div>

                  );

                }

              )}

            </div>

          )}

        </div>

      </main>


      {/* ================================
         TASK MODAL
      ================================= */}

      {selectedTask && (

        <TaskModal

          task={
            selectedTask
          }

          onClose={() =>
            setSelectedTask(null)
          }

          onComplete={
            handleTaskComplete
          }

        />

      )}

    </div>

  );

}


export default TasksPage;