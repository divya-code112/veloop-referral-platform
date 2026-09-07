const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');

function generateReferralCode() {
  return crypto.randomInt(10000000, 100000000).toString();
}

async function createUniqueReferralCode() {
  let code;
  let exists = true;

  while (exists) {
    code = generateReferralCode();

    const existing = await prisma.user.findUnique({
      where: {
        referralCode: code,
      },
    });

    exists = !!existing;
  }

  return code;
}

function generateToken(userId) {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 6 characters',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    let referrer = null;

    if (referralCode) {
      referrer = await prisma.user.findUnique({
        where: {
          referralCode: referralCode.trim(),
        },
      });

      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newReferralCode = await createUniqueReferralCode();

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: name?.trim() || null,
          email: normalizedEmail,
          password: hashedPassword,
          referralCode: newReferralCode,
          referredById: referrer ? referrer.id : null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          referralCode: true,
          referredById: true,
          createdAt: true,
        },
      });

      if (referrer) {
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: createdUser.id,
            status: 'PENDING',
          },
        });
      }

      return createdUser;
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        referredById: user.referredById,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
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
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};