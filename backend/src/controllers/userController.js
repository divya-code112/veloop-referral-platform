const prisma = require('../config/prisma');

async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        referredById: true,

        // =========================
        // USER PROGRESS
        // =========================
        xp: true,
        level: true,

        currentStreak: true,
        longestStreak: true,
        lastCheckIn: true,

        // =========================
        // WALLET / GAME BALANCE
        // =========================
        sve: true,
        gems: true,
        tokens: true,
        luckySpins: true,

        // =========================
        // DATES
        // =========================
        createdAt: true,
        updatedAt: true,

        // =========================
        // REFERRALS CREATED BY USER
        // =========================
        sentReferrals: {
          select: {
            id: true,
            status: true,
            taskCount: true,
            createdAt: true,

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
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
};