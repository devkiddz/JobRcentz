import { requireAuth } from '@/server/auth/requireAuth';
import { startConversation } from '@/server/actions/dashboard/messages/startConversation';
import { getConversations } from '@/server/actions/dashboard/messages/getConversations';
import { getMessages } from '@/server/actions/dashboard/messages/getMessages';
import { sendMessage } from '@/server/actions/dashboard/messages/sendMessage';

export default async function MessagesPage({
  searchParams
}: {
  searchParams: Promise<{
    conversationId?: string;
    with?: string;
  }>;
}) {
  const params = await searchParams;
  const user = await requireAuth();
  const conversations = await getConversations();

  const requestedWith = params.with;
  const requestedConversationId = params.conversationId;

  if (requestedWith && !requestedConversationId) {
    return (
      <main className="mx-auto w-full max-w-6xl p-4 lg:p-8">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">Start a conversation</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the button below to open a direct conversation.
          </p>

          <form
            action={async () => {
              'use server';
              await startConversation(requestedWith);
            }}
            className="mt-5">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Start conversation
            </button>
          </form>
        </div>
      </main>
    );
  }

  const selectedId =
    requestedConversationId ?? conversations[0]?.id ?? null;

  const messages = selectedId ? await getMessages(selectedId) : [];

  return (
    <main className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl gap-4 p-4 lg:grid-cols-[300px_1fr] lg:p-8">
      <aside className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b p-4">
          <h1 className="font-semibold">Messages</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Your direct conversations.
          </p>
        </div>

        <div className="divide-y">
          {conversations.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No conversations yet.
            </p>
          ) : (
            conversations.map((conversation) => {
              const other = conversation.participants[0]?.user;
              const latest = conversation.messages[0];

              return (
                <a
                  key={conversation.id}
                  href={`/dashboard/messages?conversationId=${conversation.id}`}
                  className={`block p-4 hover:bg-muted ${
                    conversation.id === selectedId ? 'bg-muted' : ''
                  }`}>
                  <p className="truncate text-sm font-medium">
                    {other?.name ?? other?.email ?? 'Conversation'}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {latest?.body ?? 'No messages yet.'}
                  </p>
                </a>
              );
            })
          )}
        </div>
      </aside>

      <section className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border bg-card">
        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
            Select a conversation to begin.
          </div>
        ) : (
          <>
            <div className="border-b p-4">
              <h2 className="font-semibold">
                {conversations
                  .find((conversation) => conversation.id === selectedId)
                  ?.participants[0]?.user.name ?? 'Conversation'}
              </h2>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation.
                </p>
              ) : (
                messages.map((message) => {
                  const mine = message.senderId === user.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        mine ? 'justify-end' : 'justify-start'
                      }`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                          mine
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                        <p className="whitespace-pre-wrap">{message.body}</p>
                        <p className="mt-1 text-[10px] opacity-60">
                          {message.createdAt.toLocaleString('en-NG')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form
              action={async (formData) => {
                'use server';
                await sendMessage(
                  selectedId,
                  String(formData.get('body') ?? '')
                );
              }}
              className="border-t p-4">
              <div className="flex gap-2">
                <textarea
                  name="body"
                  required
                  rows={2}
                  placeholder="Write a message..."
                  className="min-h-20 flex-1 resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="self-end rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
