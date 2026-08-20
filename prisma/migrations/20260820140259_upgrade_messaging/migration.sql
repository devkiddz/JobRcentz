-- AlterTable
ALTER TABLE "message" ADD COLUMN     "replyToId" TEXT;

-- CreateTable
CREATE TABLE "message_attachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "resourceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "message_attachment_messageId_idx" ON "message_attachment"("messageId");

-- CreateIndex
CREATE INDEX "message_attachment_createdAt_idx" ON "message_attachment"("createdAt");

-- CreateIndex
CREATE INDEX "message_replyToId_idx" ON "message"("replyToId");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachment" ADD CONSTRAINT "message_attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
