require('dotenv').config();

const prisma = require('../src/config/prisma');

/* =========================
   REWARDS
========================= */

const rewards = [
  {
    title: '5000 SVE',
    subtitle: '≈ ₹10',
    condition: 'Friend completes 15 tasks',
    requiredTasks: 15,

    sve: 5000,
    gems: 0,
    tokens: 0,
    luckySpins: 0,
  },

  {
    title: '2 Lucky Spins',
    subtitle: null,
    condition: 'Friend completes 20 tasks',
    requiredTasks: 20,

    sve: 0,
    gems: 0,
    tokens: 0,
    luckySpins: 2,
  },

  {
    title: '5000 Tokens',
    subtitle: null,
    condition: 'Friend completes 30 tasks',
    requiredTasks: 30,

    sve: 0,
    gems: 0,
    tokens: 5000,
    luckySpins: 0,
  },

  {
    title: '10 Gems',
    subtitle: null,
    condition: 'Friend completes 35 tasks',
    requiredTasks: 35,

    sve: 0,
    gems: 10,
    tokens: 0,
    luckySpins: 0,
  },

  {
    title: '+20 XP',
    subtitle: null,
    condition: 'Awarded for every successful referral',
    requiredTasks: 0,

    sve: 0,
    gems: 0,
    tokens: 0,
    luckySpins: 0,
  },
];

/* =========================
   TASKS
========================= */

const tasks = [
  // EASY

  {
    title: 'Daily Check-in',
    description:
      'Check in daily to maintain activity and earn XP.',
    type: 'DAILY_CHECKIN',
    difficulty: 'EASY',
    xpReward: 10,
    repeatable: true,
    active: true,
  },

  {
    title: 'Watch Advertisement',
    description:
      'Watch the complete advertisement without skipping.',
    type: 'WATCH_AD',
    difficulty: 'EASY',
    xpReward: 15,
    repeatable: false,
    active: true,
  },

  // MEDIUM

  {
    title: 'Solve CAPTCHA',
    description:
      'Complete the security verification challenge successfully.',
    type: 'CAPTCHA',
    difficulty: 'MEDIUM',
    xpReward: 25,
    repeatable: false,
    active: true,
  },

  {
    title: 'Quick Quiz',
    description:
      'Answer referral-related questions correctly to complete the challenge.',
    type: 'QUIZ',
    difficulty: 'MEDIUM',
    xpReward: 30,
    repeatable: false,
    active: true,
  },

  // HARD

  {
    title: 'Advanced Referral Quiz',
    description:
      'Complete an advanced referral knowledge quiz with at least 80% correct answers.',
    type: 'QUIZ',
    difficulty: 'HARD',
    xpReward: 50,
    repeatable: false,
    active: true,
  },

  {
    title: 'Human Verification Challenge',
    description:
      'Pass an advanced verification challenge within the given time limit.',
    type: 'CAPTCHA',
    difficulty: 'HARD',
    xpReward: 60,
    repeatable: false,
    active: true,
  },

  // EXPERT

  {
    title: 'VELoop Master Challenge',
    description:
      'Complete a difficult multi-stage challenge and prove your VELoop knowledge.',
    type: 'QUIZ',
    difficulty: 'EXPERT',
    xpReward: 100,
    repeatable: false,
    active: true,
  },
];

/* =========================
   SEED FUNCTION
========================= */

async function main() {
  console.log('Seeding rewards and tasks...');

  /* =========================
     SEED REWARDS
  ========================= */

  for (const reward of rewards) {
    const existing = await prisma.reward.findFirst({
      where: {
        title: reward.title,
      },
    });

    if (existing) {
      await prisma.reward.update({
        where: {
          id: existing.id,
        },
        data: reward,
      });

      console.log(`Updated reward: ${reward.title}`);
    } else {
      await prisma.reward.create({
        data: reward,
      });

      console.log(`Created reward: ${reward.title}`);
    }
  }

  console.log('Rewards seeded successfully.');

  /* =========================
     SEED TASKS
  ========================= */

  for (const task of tasks) {
    const existing = await prisma.task.findFirst({
      where: {
        title: task.title,
      },
    });

    if (existing) {
      await prisma.task.update({
        where: {
          id: existing.id,
        },
        data: task,
      });

      console.log(`Updated task: ${task.title}`);
    } else {
      await prisma.task.create({
        data: task,
      });

      console.log(`Created task: ${task.title}`);
    }
  }

  console.log('Tasks seeded successfully.');
}

/* =========================
   RUN SEED
========================= */

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });