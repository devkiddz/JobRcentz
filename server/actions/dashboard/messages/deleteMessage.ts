'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/server/auth/requireAuth';
import { prisma } from '@/server/db/prisma';
import cloudinary from '@/server/lib/cloudinary';

export async function deleteMessage(messageId: string) {
  const user = await requireAuth();

  const existing = await prisma.message.findFirst({
    where: { id: messageId, senderId: user.id, deletedAt: null },
    select: {
      id: true,
      attachments: { select: { publicId: true, resourceType: true } }
    }
  });

  if (!existing) return { success: false, error: 'Message not found.' };

  await prisma.message.update({
    where: { id: existing.id },
    data: { deletedAt: new Date(), body: '' }
  });

  await prisma.messageAttachment.deleteMany({ where: { messageId: existing.id } });

  await Promise.all(
    existing.attachments
      .filter(file => file.publicId)
      .map(file =>
        cloudinary.uploader.destroy(file.publicId!, {
          resource_type: file.resourceType === 'raw' ? 'raw' : file.resourceType === 'video' ? 'video' : 'image'
        }).catch(error => console.error('Unable to remove message attachment from Cloudinary', error))
      )
  );

  revalidatePath('/dashboard/messages');
  return { success: true };
}
