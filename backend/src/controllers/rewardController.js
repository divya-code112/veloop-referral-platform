const prisma = require('../config/prisma');


/**
 * Get all rewards with unlock/claim status
 */
async function getRewards(req, res, next) {
  try {
    const rewards = await prisma.reward.findMany({
      orderBy: {
        requiredTasks: 'asc',
      },
    });

    const claims = await prisma.rewardClaim.findMany({
      where: {
        userId: req.user.id,
      },
    });

    const result = rewards.map((reward) => {
      const rewardClaims = claims.filter(
        (claim) => claim.rewardId === reward.id
      );

      const unlocked = rewardClaims.some(
        (claim) =>
          claim.status === 'UNLOCKED' ||
          claim.status === 'CLAIMED'
      );

      const claimed = rewardClaims.some(
        (claim) => claim.status === 'CLAIMED'
      );

      return {
        ...reward,
        unlocked,
        claimed,
      };
    });

    res.json({
      success: true,
      rewards: result,
    });
  } catch (error) {
    next(error);
  }
}


/**
 * Get current user's reward claims
 */
async function getRewardClaims(req, res, next) {
  try {
    const claims = await prisma.rewardClaim.findMany({
      where: {
        userId: req.user.id,
      },

      include: {
        reward: true,

        referral: {
          select: {
            id: true,
            taskCount: true,
            status: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      claims,
    });
  } catch (error) {
    next(error);
  }
}


/**
 * Claim unlocked reward
 *
 * Features:
 * - Verify reward is unlocked
 * - Prevent duplicate claims
 * - Add SVE to wallet
 * - Add Gems to wallet
 * - Add Tokens to wallet
 * - Add Lucky Spins to wallet
 * - Mark reward as CLAIMED
 */
async function claimReward(req, res, next) {
  try {
    const rewardId = Number(req.params.id);
    const userId = req.user.id;

    if (
      !Number.isInteger(rewardId) ||
      rewardId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reward ID',
      });
    }


    /**
     * Use transaction so wallet update
     * and reward claim happen together.
     */
    const result =
      await prisma.$transaction(async (tx) => {

        /**
         * Find unlocked claim.
         */
        const claim =
          await tx.rewardClaim.findFirst({
            where: {
              userId,
              rewardId,
              status: 'UNLOCKED',
            },

            include: {
              reward: true,
            },
          });


        if (!claim) {
          throw new Error(
            'Reward is not unlocked or has already been claimed'
          );
        }


        /**
         * Add reward values to user wallet.
         */
        const updatedUser =
          await tx.user.update({
            where: {
              id: userId,
            },

            data: {
              sve: {
                increment:
                  claim.reward.sve || 0,
              },

              gems: {
                increment:
                  claim.reward.gems || 0,
              },

              tokens: {
                increment:
                  claim.reward.tokens || 0,
              },

              luckySpins: {
                increment:
                  claim.reward.luckySpins || 0,
              },
            },

            select: {
              id: true,
              xp: true,
              level: true,

              sve: true,
              gems: true,
              tokens: true,
              luckySpins: true,
            },
          });


        /**
         * Mark reward as claimed.
         */
        const updatedClaim =
          await tx.rewardClaim.update({
            where: {
              id: claim.id,
            },

            data: {
              status: 'CLAIMED',
              claimedAt: new Date(),
            },

            include: {
              reward: true,
            },
          });


        return {
          claim: updatedClaim,
          wallet: updatedUser,
        };
      });


    res.json({
      success: true,

      message:
        'Reward claimed successfully and added to your wallet',

      data: result,
    });

  } catch (error) {

    if (
      error.message ===
      'Reward is not unlocked or has already been claimed'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}


module.exports = {
  getRewards,
  getRewardClaims,
  claimReward,
};