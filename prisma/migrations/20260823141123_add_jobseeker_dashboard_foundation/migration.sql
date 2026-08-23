-- CreateEnum
CREATE TYPE "PortfolioPreviewSource" AS ENUM ('UPLOAD', 'GENERATED', 'EXTERNAL');

-- AlterTable
ALTER TABLE "job_seeker_profile" ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "portfolio_project" ADD COLUMN     "coverImagePublicId" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "previewImageSource" "PortfolioPreviewSource",
ADD COLUMN     "previewImageUrl" TEXT;

-- CreateTable
CREATE TABLE "job_seeker_profile_view" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "viewerId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_seeker_profile_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_seeker_profile_view_profileId_idx" ON "job_seeker_profile_view"("profileId");

-- CreateIndex
CREATE INDEX "job_seeker_profile_view_profileId_viewedAt_idx" ON "job_seeker_profile_view"("profileId", "viewedAt");

-- CreateIndex
CREATE INDEX "job_seeker_profile_view_viewerId_idx" ON "job_seeker_profile_view"("viewerId");

-- CreateIndex
CREATE INDEX "job_seeker_profile_view_viewedAt_idx" ON "job_seeker_profile_view"("viewedAt");

-- AddForeignKey
ALTER TABLE "job_seeker_profile_view" ADD CONSTRAINT "job_seeker_profile_view_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "job_seeker_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_seeker_profile_view" ADD CONSTRAINT "job_seeker_profile_view_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
