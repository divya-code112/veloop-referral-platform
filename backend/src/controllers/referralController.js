const prisma = require('../config/prisma');

/**
 * Get all referrals created by current user.
 */
async function getReferrals(req, res, next) {
  try {
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: req.user.id,
      },
      include: {
        referredUser: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get referral statistics for current user.
 *
 * Includes:
 * - Total referrals
 * - Successful referrals
 * - Pending referrals
 * - Rewards earned
 * - Actual user XP
 * - Gems
 * - Tokens
 * - Lucky spins
 */
async function getReferralStats(req, res, next) {
  try {
    /*
     * Get referrals created by current user.
     */
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: req.user.id,
      },
    });

    /*
     * Get ACTUAL user XP and level.
     *
     * This is important because task XP
     * is stored in the User table.
     */
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        xp: true,
        level: true,
      },
    });

    /*
     * Referral counts.
     */
    const totalReferrals = referrals.length;

    const successfulReferrals = referrals.filter(
      (referral) => referral.status === 'SUCCESSFUL'
    ).length;

    const pendingReferrals = referrals.filter(
      (referral) => referral.status === 'PENDING'
    ).length;

    const cancelledReferrals = referrals.filter(
      (referral) => referral.status === 'CANCELLED'
    ).length;

    /*
     * Get unlocked and claimed rewards.
     */
    const rewardClaims = await prisma.rewardClaim.findMany({
      where: {
        userId: req.user.id,
        status: {
          in: ['UNLOCKED', 'CLAIMED'],
        },
      },
      include: {
        reward: true,
      },
    });

    /*
     * Reward totals.
     */
    let sve = 0;
    let gems = 0;
    let tokens = 0;
    let luckySpins = 0;

    rewardClaims.forEach((claim) => {
      const title = claim.reward.title.toLowerCase();

      const sveMatch = title.match(/(\d+)\s*sve/i);

      const gemsMatch =
        title.match(/(\d+)\s*gems?/i);

      const tokenMatch =
        title.match(/(\d+)\s*tokens?/i);

      const spinMatch =
        title.match(/(\d+)\s*lucky spins?/i);

      if (sveMatch) {
        sve += Number(sveMatch[1]);
      }

      if (gemsMatch) {
        gems += Number(gemsMatch[1]);
      }

      if (tokenMatch) {
        tokens += Number(tokenMatch[1]);
      }

      if (spinMatch) {
        luckySpins += Number(spinMatch[1]);
      }
    });

    /*
     * Send statistics.
     */
    res.json({
      success: true,

      statistics: {
        totalReferrals,
        successfulReferrals,
        pendingReferrals,
        cancelledReferrals,

        totalRewardsEarned: sve,
        earningsUnit: 'SVE',

        /*
         * IMPORTANT:
         * Actual XP comes directly
         * from User table.
         */
        totalXPEarned: user?.xp || 0,

        /*
         * Current user level.
         */
        currentLevel: user?.level || 1,

        totalGemsEarned: gems,

        totalTokensEarned: tokens,

        luckySpins,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Complete referral task manually.
 *
 * This route increments taskCount
 * for a referral.
 */
async function completeReferralTask(req, res, next) {
  try {
    const referralId = Number(req.params.id);

    if (!Number.isInteger(referralId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid referral ID',
      });
    }

    const referral = await prisma.referral.findFirst({
      where: {
        id: referralId,
        referrerId: req.user.id,
      },
    });

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found',
      });
    }

    /*
     * Cancelled referrals cannot receive tasks.
     */
    if (referral.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This referral has been cancelled',
      });
    }

    /*
     * Maximum milestone is 35 tasks.
     */
    if (referral.taskCount >= 35) {
      return res.status(400).json({
        success: false,
        message:
          'All referral tasks have already been completed',
      });
    }

    const updatedReferral =
      await prisma.$transaction(async (tx) => {
        /*
         * Increase task count.
         */
        const updated = await tx.referral.update({
          where: {
            id: referral.id,
          },
          data: {
            taskCount: {
              increment: 1,
            },
          },
        });

        /*
         * Unlock milestone rewards.
         */
        const taskRewards =
          await tx.reward.findMany({
            where: {
              requiredTasks: {
                gt: 0,
                lte: updated.taskCount,
              },
            },
            orderBy: {
              requiredTasks: 'asc',
            },
          });

        for (const reward of taskRewards) {
          const existingClaim =
            await tx.rewardClaim.findFirst({
              where: {
                userId: req.user.id,
                referralId: referral.id,
                rewardId: reward.id,
              },
            });

          if (!existingClaim) {
            await tx.rewardClaim.create({
              data: {
                userId: req.user.id,
                referralId: referral.id,
                rewardId: reward.id,
                status: 'UNLOCKED',
              },
            });
          }
        }

        /*
         * Referral becomes successful
         * after 15 completed tasks.
         */
        if (
          updated.taskCount >= 15 &&
          updated.status !== 'SUCCESSFUL'
        ) {
          await tx.referral.update({
            where: {
              id: referral.id,
            },
            data: {
              status: 'SUCCESSFUL',
            },
          });
        }

        /*
         * Unlock successful referral rewards.
         *
         * requiredTasks = 0
         */
        if (updated.taskCount >= 15) {
          const successfulRewards =
            await tx.reward.findMany({
              where: {
                requiredTasks: 0,
              },
            });

          for (const reward of successfulRewards) {
            const existingClaim =
              await tx.rewardClaim.findFirst({
                where: {
                  userId: req.user.id,
                  referralId: referral.id,
                  rewardId: reward.id,
                },
              });

            if (!existingClaim) {
              await tx.rewardClaim.create({
                data: {
                  userId: req.user.id,
                  referralId: referral.id,
                  rewardId: reward.id,
                  status: 'UNLOCKED',
                },
              });
            }
          }
        }

        /*
         * Return updated referral.
         */
        return await tx.referral.findUnique({
          where: {
            id: referral.id,
          },
        });
      });

    res.json({
      success: true,
      message: 'Referral task completed',
      referral: updatedReferral,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReferrals,
  getReferralStats,
  completeReferralTask,
};