const express = require('express');

const {
  getReferrals,
  getReferralStats,
  completeReferralTask,
} = require('../controllers/referralController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getReferrals);

router.get('/stats', protect, getReferralStats);

router.post('/:id/complete-task', protect, completeReferralTask);

module.exports = router;