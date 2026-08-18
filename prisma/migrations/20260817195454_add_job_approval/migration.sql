-- CreateEnum
CREATE TYPE "JobApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "approvalStatus" "JobApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "job_approvalStatus_idx" ON "job"("approvalStatus");
