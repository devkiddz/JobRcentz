-- CreateTable
CREATE TABLE "user_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "address" TEXT,
    "website" TEXT,
    "linkedIn" TEXT,
    "x" TEXT,
    "github" TEXT,
    "avatarUrl" TEXT,
    "avatarId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "size" TEXT,
    "description" TEXT,
    "location" TEXT,
    "address" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "linkedIn" TEXT,
    "x" TEXT,
    "facebook" TEXT,
    "logoUrl" TEXT,
    "logoPublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "employmentType" TEXT,
    "workplaceType" TEXT,
    "experienceLevel" TEXT,
    "location" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT,
    "skills" TEXT,
    "requirements" TEXT,
    "benefits" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "companyId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "coverLetter" TEXT,
    "resumeUrl" TEXT,
    "resumeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- CreateIndex
CREATE INDEX "company_name_idx" ON "company"("name");

-- CreateIndex
CREATE INDEX "company_location_idx" ON "company"("location");

-- CreateIndex
CREATE INDEX "company_industry_idx" ON "company"("industry");

-- CreateIndex
CREATE INDEX "company_member_companyId_idx" ON "company_member"("companyId");

-- CreateIndex
CREATE INDEX "company_member_userId_idx" ON "company_member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_member_userId_companyId_key" ON "company_member"("userId", "companyId");

-- CreateIndex
CREATE INDEX "job_companyId_idx" ON "job"("companyId");

-- CreateIndex
CREATE INDEX "job_createdById_idx" ON "job"("createdById");

-- CreateIndex
CREATE INDEX "job_status_idx" ON "job"("status");

-- CreateIndex
CREATE INDEX "job_location_idx" ON "job"("location");

-- CreateIndex
CREATE INDEX "job_publishedAt_idx" ON "job"("publishedAt");

-- CreateIndex
CREATE INDEX "application_jobId_idx" ON "application"("jobId");

-- CreateIndex
CREATE INDEX "application_applicantId_idx" ON "application"("applicantId");

-- CreateIndex
CREATE INDEX "application_status_idx" ON "application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "application_jobId_applicantId_key" ON "application"("jobId", "applicantId");

-- CreateIndex
CREATE INDEX "saved_job_userId_idx" ON "saved_job"("userId");

-- CreateIndex
CREATE INDEX "saved_job_jobId_idx" ON "saved_job"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_job_userId_jobId_key" ON "saved_job"("userId", "jobId");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_member" ADD CONSTRAINT "company_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_member" ADD CONSTRAINT "company_member_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_job" ADD CONSTRAINT "saved_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_job" ADD CONSTRAINT "saved_job_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
