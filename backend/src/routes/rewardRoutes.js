const express = require('express');

const {
  getRewards,
  getRewardClaims,
  claimReward,
} = require('../controllers/rewardController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getRewards);

router.get('/claims', protect, getRewardClaims);

router.post('/:id/claim', protect, claimReward);

module.exports = router;