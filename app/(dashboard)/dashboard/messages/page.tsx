import { requireAuth } from '@/server/auth/requireAuth';
import { getConversations } from '@/server/actions/dashboard/messages/getConversations';
import { getMessages } from '@/server/actions/dashboard/messages/getMessages';
import MessagesClient from './MessagesClient';

export default async function MessagesPage({
  searchParams
}: {
  searchParams: Promise<{ conversationId?: string; with?: string }>;
}) {
  const params = await searchParams;
  const user = await requireAuth();
  const conversations = await getConversations();

  return (
    <MessagesClient
      userId={user.id}
      requestedWith={params.with ?? null}
      requestedConversationId={params.conversationId ?? null}
      initialConversations={conversations}
      initialMessages={params.conversationId ? await getMessages(params.conversationId) : []}
    />
  );
}
