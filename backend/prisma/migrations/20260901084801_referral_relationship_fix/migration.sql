-- DropIndex
DROP INDEX "Referral_referrerId_key";

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "Referral"("status");

-- CreateIndex
CREATE INDEX "RewardClaim_userId_idx" ON "RewardClaim"("userId");

-- CreateIndex
CREATE INDEX "RewardClaim_rewardId_idx" ON "RewardClaim"("rewardId");
