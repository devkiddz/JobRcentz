-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'UNASSIGNED';

-- AlterTable
ALTER TABLE "company_profile" ADD COLUMN     "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "job_seeker_profile" ADD COLUMN     "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'UNASSIGNED';

-- CreateIndex
CREATE INDEX "company_profile_onboardingStatus_idx" ON "company_profile"("onboardingStatus");

-- CreateIndex
CREATE INDEX "job_seeker_profile_onboardingStatus_idx" ON "job_seeker_profile"("onboardingStatus");
