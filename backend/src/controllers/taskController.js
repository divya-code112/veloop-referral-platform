const prisma = require('../config/prisma');

/**
 * Calculate user level based on XP.
 *
 * Every 100 XP = 1 level.
 *
 * Level 1 = 0 XP
 * Level 2 = 100 XP
 * Level 3 = 200 XP
 */
function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Check whether two dates are consecutive calendar days.
 */
function isYesterday(lastCheckIn, now) {
  if (!lastCheckIn) {
    return false;
  }

  const lastDate = new Date(
    lastCheckIn.getFullYear(),
    lastCheckIn.getMonth(),
    lastCheckIn.getDate()
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const difference =
    today.getTime() - lastDate.getTime();

  return difference === 24 * 60 * 60 * 1000;
}

/**
 * Get all active tasks.
 */
async function getTasks(req, res, next) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        active: true,
      },
      orderBy: [
        {
          difficulty: 'asc',
        },
        {
          xpReward: 'asc',
        },
      ],
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user's completed tasks.
 */
async function getMyTaskCompletions(req, res, next) {
  try {
    const completions = await prisma.taskCompletion.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        task: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        xp: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastCheckIn: true,
      },
    });

    res.json({
      success: true,
      completions,

      userProgress: {
        xp: user?.xp || 0,
        level: user?.level || 1,

        currentStreak:
          user?.currentStreak || 0,

        longestStreak:
          user?.longestStreak || 0,

        lastCheckIn:
          user?.lastCheckIn || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Complete a task.
 *
 * Features:
 * - Prevent duplicate completion for one-time tasks
 * - Daily check-in only once per day
 * - Daily streak tracking
 * - Award XP
 * - Update user level
 * - Save XP earned in TaskCompletion
 * - Update referral task progress
 * - Unlock referral rewards
 */
async function completeTask(req, res, next) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    /**
     * Find task
     */
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task || !task.active) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or inactive',
      });
    }

    /**
     * Non-repeatable tasks can only be completed once.
     */
    if (
      !task.repeatable &&
      task.type !== 'DAILY_CHECKIN'
    ) {
      const existingCompletion =
        await prisma.taskCompletion.findFirst({
          where: {
            userId,
            taskId,
          },
        });

      if (existingCompletion) {
        return res.status(400).json({
          success: false,
          message:
            'You have already completed this task',
        });
      }
    }

    /**
     * DAILY_CHECKIN can only be completed once per day.
     */
    if (task.type === 'DAILY_CHECKIN') {
      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );

      const existingCompletion =
        await prisma.taskCompletion.findFirst({
          where: {
            userId,
            taskId,

            completedAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

      if (existingCompletion) {
        return res.status(400).json({
          success: false,
          message:
            'Daily check-in has already been completed today',
        });
      }
    }

    /**
     * Start database transaction
     */
    const result =
      await prisma.$transaction(async (tx) => {

        /**
         * 1. Get current user data
         */
        const currentUser =
          await tx.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              id: true,
              xp: true,
              level: true,

              currentStreak: true,
              longestStreak: true,
              lastCheckIn: true,
            },
          });

        if (!currentUser) {
          throw new Error('User not found');
        }

        /**
         * 2. Calculate XP and level
         */
        const xpEarned =
          task.xpReward || 0;

        const newXp =
          currentUser.xp + xpEarned;

        const newLevel =
          calculateLevel(newXp);


        /**
         * DAILY STREAK LOGIC
         */
        let newCurrentStreak =
          currentUser.currentStreak;

        let newLongestStreak =
          currentUser.longestStreak;

        let newLastCheckIn =
          currentUser.lastCheckIn;


        if (task.type === 'DAILY_CHECKIN') {

          const now = new Date();

          /**
           * First check-in ever.
           */
          if (!currentUser.lastCheckIn) {

            newCurrentStreak = 1;

          }

          /**
           * Consecutive day.
           */
          else if (
            isYesterday(
              currentUser.lastCheckIn,
              now
            )
          ) {

            newCurrentStreak =
              currentUser.currentStreak + 1;

          }

          /**
           * Missed one or more days.
           * Reset streak.
           */
          else {

            newCurrentStreak = 1;

          }


          /**
           * Update longest streak.
           */
          newLongestStreak =
            Math.max(
              currentUser.longestStreak,
              newCurrentStreak
            );


          /**
           * Save current check-in time.
           */
          newLastCheckIn = now;
        }


        /**
         * 3. Save task completion
         */
        const completion =
          await tx.taskCompletion.create({
            data: {
              userId,
              taskId,
              xpEarned,
            },

            include: {
              task: true,
            },
          });


        /**
         * 4. Update user XP, level and streak
         */
        const updatedUser =
          await tx.user.update({
            where: {
              id: userId,
            },

            data: {
              xp: newXp,
              level: newLevel,

              currentStreak:
                newCurrentStreak,

              longestStreak:
                newLongestStreak,

              lastCheckIn:
                newLastCheckIn,
            },

            select: {
              id: true,
              xp: true,
              level: true,

              currentStreak: true,
              longestStreak: true,
              lastCheckIn: true,
            },
          });


        /**
         * 5. Find referral where this user
         * was referred by another user.
         */
        const referral =
          await tx.referral.findUnique({
            where: {
              referredUserId: userId,
            },
          });


        let updatedReferral = null;

        const unlockedRewards = [];


        /**
         * Update referral progress.
         */
        if (
          referral &&
          referral.status !== 'CANCELLED'
        ) {

          updatedReferral =
            await tx.referral.update({
              where: {
                id: referral.id,
              },

              data: {
                taskCount: {
                  increment: 1,
                },
              },
            });


          /**
           * Mark referral successful
           * after 15 tasks.
           */
          if (
            updatedReferral.taskCount >= 15 &&
            updatedReferral.status !==
              'SUCCESSFUL'
          ) {

            updatedReferral =
              await tx.referral.update({
                where: {
                  id: referral.id,
                },

                data: {
                  status: 'SUCCESSFUL',
                },
              });
          }


          /**
           * Find milestone rewards.
           */
          const availableRewards =
            await tx.reward.findMany({
              where: {
                requiredTasks: {
                  gt: 0,
                  lte:
                    updatedReferral.taskCount,
                },
              },

              orderBy: {
                requiredTasks: 'asc',
              },
            });


          /**
           * Unlock milestone rewards
           * for referrer.
           */
          for (
            const reward
            of availableRewards
          ) {

            const existingClaim =
              await tx.rewardClaim.findFirst({
                where: {
                  userId:
                    referral.referrerId,

                  referralId:
                    referral.id,

                  rewardId:
                    reward.id,
                },
              });


            if (!existingClaim) {

              const claim =
  await tx.rewardClaim.create({
    data: {
      userId: referral.referrerId,
      referralId: referral.id,
      rewardId: reward.id,
      status: 'UNLOCKED',
    },

    include: {
      reward: true,
    },
  });

/**
 * Add reward to referrer's wallet.
 */
await tx.user.update({
  where: {
    id: referral.referrerId,
  },

  data: {
    sve: {
      increment: reward.sve,
    },

    gems: {
      increment: reward.gems,
    },

    tokens: {
      increment: reward.tokens,
    },

    luckySpins: {
      increment: reward.luckySpins,
    },
  },
});

unlockedRewards.push(claim.reward);
            }
          }


          /**
           * Successful referral rewards.
           *
           * Rewards where requiredTasks = 0
           */
          if (
            updatedReferral.taskCount >= 15
          ) {

            const successRewards =
              await tx.reward.findMany({
                where: {
                  requiredTasks: 0,
                },
              });


            for (
              const reward
              of successRewards
            ) {

              const existingClaim =
                await tx.rewardClaim.findFirst({
                  where: {
                    userId:
                      referral.referrerId,

                    referralId:
                      referral.id,

                    rewardId:
                      reward.id,
                  },
                });


              if (!existingClaim) {
                const claim =
  await tx.rewardClaim.create({
    data: {
      userId: referral.referrerId,
      referralId: referral.id,
      rewardId: reward.id,
      status: 'UNLOCKED',
    },

    include: {
      reward: true,
    },
  });

/**
 * Add successful referral reward
 * to referrer's wallet.
 */
await tx.user.update({
  where: {
    id: referral.referrerId,
  },

  data: {
    sve: {
      increment: reward.sve,
    },

    gems: {
      increment: reward.gems,
    },

    tokens: {
      increment: reward.tokens,
    },

    luckySpins: {
      increment: reward.luckySpins,
    },
  },
});

unlockedRewards.push(claim.reward);
               
              }
            }
          }
        }


        /**
         * Return complete result
         */
        return {

          completion,


          userProgress: {

            xpEarned,

            totalXp:
              updatedUser.xp,

            level:
              updatedUser.level,

            leveledUp:
              updatedUser.level >
              currentUser.level,

            currentStreak:
              updatedUser.currentStreak,

            longestStreak:
              updatedUser.longestStreak,

            lastCheckIn:
              updatedUser.lastCheckIn,

            streakUpdated:
              task.type ===
              'DAILY_CHECKIN',
          },


          referral:
            updatedReferral,


          unlockedRewards,
        };
      });


    res.json({
      success: true,

      message:
        'Task completed successfully',

      data: result,
    });

  } catch (error) {
    next(error);
  }
}


module.exports = {
  getTasks,
  getMyTaskCompletions,
  completeTask,
};