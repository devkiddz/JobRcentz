-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('IN_PERSON', 'ONLINE', 'AI');

-- CreateEnum
CREATE TYPE "InterviewOutcome" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'NO_DECISION');

-- CreateEnum
CREATE TYPE "InterviewProvider" AS ENUM ('INTERNAL', 'ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS', 'OTHER');

-- CreateEnum
CREATE TYPE "InterviewParticipantRole" AS ENUM ('EMPLOYER', 'CANDIDATE', 'INTERVIEWER', 'OBSERVER', 'AI');

-- CreateEnum
CREATE TYPE "InterviewTaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InterviewNoteVisibility" AS ENUM ('PRIVATE', 'SHARED');

-- CreateEnum
CREATE TYPE "InterviewRecommendation" AS ENUM ('PENDING', 'STRONG_YES', 'YES', 'MAYBE', 'NO', 'STRONG_NO');

-- CreateEnum
CREATE TYPE "InterviewSessionType" AS ENUM ('ONLINE', 'AI', 'FACIAL_VERIFICATION', 'RECORDING', 'TRANSCRIPTION');

-- CreateEnum
CREATE TYPE "InterviewSessionStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InterviewEventType" AS ENUM ('CREATED', 'UPDATED', 'SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'STARTED', 'COMPLETED', 'NO_SHOW', 'PARTICIPANT_JOINED', 'PARTICIPANT_LEFT', 'TASK_CREATED', 'TASK_COMPLETED', 'NOTE_ADDED', 'EVALUATION_CREATED', 'OUTCOME_UPDATED', 'MEETING_CREATED', 'MEETING_UPDATED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InterviewStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "InterviewStatus" ADD VALUE 'NO_SHOW';

-- AlterTable
ALTER TABLE "interview" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "meetingId" TEXT,
ADD COLUMN     "meetingPasscode" TEXT,
ADD COLUMN     "meetingProvider" "InterviewProvider",
ADD COLUMN     "outcome" "InterviewOutcome" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "rescheduledFromId" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "timezone" TEXT DEFAULT 'Africa/Lagos',
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "InterviewType" NOT NULL DEFAULT 'ONLINE';

-- CreateTable
CREATE TABLE "interview_participant" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "InterviewParticipantRole" NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_task" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "InterviewTaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TodoPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_note" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "visibility" "InterviewNoteVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_evaluation" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "overallScore" DECIMAL(65,30),
    "recommendation" "InterviewRecommendation" NOT NULL DEFAULT 'PENDING',
    "strengths" TEXT,
    "weaknesses" TEXT,
    "feedback" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_evaluation_criterion" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" DECIMAL(65,30),
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_evaluation_criterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_session" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "type" "InterviewSessionType" NOT NULL,
    "status" "InterviewSessionStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "InterviewProvider",
    "externalSessionId" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "recordingUrl" TEXT,
    "transcriptUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_event" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "type" "InterviewEventType" NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interview_participant_interviewId_idx" ON "interview_participant"("interviewId");

-- CreateIndex
CREATE INDEX "interview_participant_userId_idx" ON "interview_participant"("userId");

-- CreateIndex
CREATE INDEX "interview_participant_role_idx" ON "interview_participant"("role");

-- CreateIndex
CREATE UNIQUE INDEX "interview_participant_interviewId_userId_key" ON "interview_participant"("interviewId", "userId");

-- CreateIndex
CREATE INDEX "interview_task_interviewId_idx" ON "interview_task"("interviewId");

-- CreateIndex
CREATE INDEX "interview_task_assignedToId_idx" ON "interview_task"("assignedToId");

-- CreateIndex
CREATE INDEX "interview_task_status_idx" ON "interview_task"("status");

-- CreateIndex
CREATE INDEX "interview_task_priority_idx" ON "interview_task"("priority");

-- CreateIndex
CREATE INDEX "interview_task_dueAt_idx" ON "interview_task"("dueAt");

-- CreateIndex
CREATE INDEX "interview_note_interviewId_idx" ON "interview_note"("interviewId");

-- CreateIndex
CREATE INDEX "interview_note_authorId_idx" ON "interview_note"("authorId");

-- CreateIndex
CREATE INDEX "interview_note_visibility_idx" ON "interview_note"("visibility");

-- CreateIndex
CREATE INDEX "interview_note_createdAt_idx" ON "interview_note"("createdAt");

-- CreateIndex
CREATE INDEX "interview_evaluation_interviewId_idx" ON "interview_evaluation"("interviewId");

-- CreateIndex
CREATE INDEX "interview_evaluation_evaluatorId_idx" ON "interview_evaluation"("evaluatorId");

-- CreateIndex
CREATE INDEX "interview_evaluation_recommendation_idx" ON "interview_evaluation"("recommendation");

-- CreateIndex
CREATE INDEX "interview_evaluation_createdAt_idx" ON "interview_evaluation"("createdAt");

-- CreateIndex
CREATE INDEX "interview_evaluation_criterion_evaluationId_idx" ON "interview_evaluation_criterion"("evaluationId");

-- CreateIndex
CREATE INDEX "interview_session_interviewId_idx" ON "interview_session"("interviewId");

-- CreateIndex
CREATE INDEX "interview_session_type_idx" ON "interview_session"("type");

-- CreateIndex
CREATE INDEX "interview_session_status_idx" ON "interview_session"("status");

-- CreateIndex
CREATE INDEX "interview_session_externalSessionId_idx" ON "interview_session"("externalSessionId");

-- CreateIndex
CREATE INDEX "interview_event_interviewId_idx" ON "interview_event"("interviewId");

-- CreateIndex
CREATE INDEX "interview_event_type_idx" ON "interview_event"("type");

-- CreateIndex
CREATE INDEX "interview_event_actorId_idx" ON "interview_event"("actorId");

-- CreateIndex
CREATE INDEX "interview_event_createdAt_idx" ON "interview_event"("createdAt");

-- CreateIndex
CREATE INDEX "interview_type_idx" ON "interview"("type");

-- CreateIndex
CREATE INDEX "interview_status_idx" ON "interview"("status");

-- CreateIndex
CREATE INDEX "interview_outcome_idx" ON "interview"("outcome");

-- CreateIndex
CREATE INDEX "interview_meetingProvider_idx" ON "interview"("meetingProvider");

-- CreateIndex
CREATE INDEX "interview_createdAt_idx" ON "interview"("createdAt");

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_rescheduledFromId_fkey" FOREIGN KEY ("rescheduledFromId") REFERENCES "interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_participant" ADD CONSTRAINT "interview_participant_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_participant" ADD CONSTRAINT "interview_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_task" ADD CONSTRAINT "interview_task_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_task" ADD CONSTRAINT "interview_task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_note" ADD CONSTRAINT "interview_note_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_note" ADD CONSTRAINT "interview_note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_evaluation" ADD CONSTRAINT "interview_evaluation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_evaluation" ADD CONSTRAINT "interview_evaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_evaluation_criterion" ADD CONSTRAINT "interview_evaluation_criterion_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "interview_evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_session" ADD CONSTRAINT "interview_session_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_event" ADD CONSTRAINT "interview_event_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
