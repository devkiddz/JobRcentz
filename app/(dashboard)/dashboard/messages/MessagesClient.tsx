'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Archive,
  ArrowLeft,
  Check,
  CheckCheck,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  MessageCircleReply,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Search,
  Send,
  Trash2,
  UserRound,
  Video
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { getConversations } from '@/server/actions/dashboard/messages/getConversations';
import { getMessages } from '@/server/actions/dashboard/messages/getMessages';
import { sendMessage, type MessageAttachmentInput } from '@/server/actions/dashboard/messages/sendMessage';
import { updateMessage } from '@/server/actions/dashboard/messages/updateMessage';
import { deleteMessage } from '@/server/actions/dashboard/messages/deleteMessage';

export type Conversations = Awaited<ReturnType<typeof getConversations>>;
export type Messages = Awaited<ReturnType<typeof getMessages>>;

type Props = {
  userId: string;
  requestedWith: string | null;
  requestedConversationId: string | null;
  initialConversations: Conversations;
  initialMessages: Messages;
};

type UploadedFile = MessageAttachmentInput;

export default function MessagesClient({
  userId,
  requestedWith,
  requestedConversationId,
  initialConversations,
  initialMessages
}: Props) {
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversations>(initialConversations);

  const [messages, setMessages] = useState<Messages>(initialMessages);

  const [selectedId, setSelectedId] = useState<string | null>(
    requestedConversationId ?? initialConversations[0]?.id ?? null
  );

  const [query, setQuery] = useState('');
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<Messages[number] | null>(null);
  const [editing, setEditing] = useState<Messages[number] | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<MessageAttachmentInput | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedConversation = useMemo(
    () => conversations.find(conversation => conversation.id === selectedId) ?? null,
    [conversations, selectedId]
  );

  const otherUser = selectedConversation?.participants[0]?.user;

  const filteredConversations = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return conversations;
    }

    return conversations.filter(conversation => {
      const other = conversation.participants[0]?.user;

      return `${other?.name ?? ''} ${other?.email ?? ''}`.toLowerCase().includes(value);
    });
  }, [conversations, query]);

  async function refreshConversation(id: string, replaceMessages = true) {
    const [nextConversations, nextMessages] = await Promise.all([getConversations(), getMessages(id)]);

    setConversations(nextConversations);

    if (replaceMessages) {
      setMessages(nextMessages);
    }
  }

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    let active = true;

    refreshConversation(selectedId).catch(() => {
      if (active) {
        setError('Unable to refresh this conversation.');
      }
    });

    const interval = window.setInterval(async () => {
      try {
        const nextMessages = await getMessages(selectedId);

        if (active) {
          setMessages(nextMessages);
        }
      } catch {
        // Keep the current conversation visible if polling briefly fails.
      }
    }, 3000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages.length]);

  async function selectConversation(id: string) {
    setSelectedId(id);
    setError(null);
    setReplyTo(null);
    setEditing(null);

    router.replace(`/dashboard/messages?conversationId=${id}`);
  }

  async function uploadFiles(): Promise<UploadedFile[]> {
    const uploaded: UploadedFile[] = [];

    for (const file of files) {
      const formData = new FormData();

      formData.append('file', file);

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to upload file.');
      }

      uploaded.push(data);
    }

    return uploaded;
  }

  async function submitMessage() {
    if (!selectedId || busy) {
      return;
    }

    if (!editing && !body.trim() && files.length === 0) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      if (editing) {
        const result = await updateMessage(editing.id, body.trim());

        if (!result.success) {
          throw new Error(result.error);
        }

        setEditing(null);
      } else {
        const uploaded = await uploadFiles();

        const result = await sendMessage(selectedId, body.trim(), replyTo?.id ?? null, uploaded);

        if (!result.success) {
          throw new Error(result.error);
        }

        setReplyTo(null);
      }

      setBody('');
      setFiles([]);

      if (fileRef.current) {
        fileRef.current.value = '';
      }

      await refreshConversation(selectedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send the message.');
    } finally {
      setBusy(false);
    }
  }

  async function removeMessage(id: string) {
    if (busy) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const result = await deleteMessage(id);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (selectedId) {
        await refreshConversation(selectedId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete the message.');
    } finally {
      setBusy(false);
    }
  }

  function beginEdit(message: Messages[number]) {
    setEditing(message);
    setReplyTo(null);
    setBody(message.body);
  }

  function beginReply(message: Messages[number]) {
    setReplyTo(message);
    setEditing(null);
    setBody('');
  }

  function cancelComposerMode() {
    setReplyTo(null);
    setEditing(null);
    setBody('');
  }

  function isPreviewable(file?: MessageAttachmentInput | null) {
    return Boolean(
      file?.mimeType?.startsWith('image/') ||
      file?.mimeType?.startsWith('video/') ||
      file?.mimeType === 'application/pdf'
    );
  }

  function attachmentIcon(mimeType?: string | null) {
    if (mimeType?.startsWith('image/')) {
      return <ImageIcon className="size-4" />;
    }

    if (mimeType?.startsWith('video/')) {
      return <Video className="size-4" />;
    }

    return <FileText className="size-4" />;
  }

  function getInitials(name?: string | null, email?: string | null) {
    const value = name?.trim() || email?.trim();

    if (!value) {
      return '?';
    }

    const parts = value.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  function renderAvatar(
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } | null,
    size: 'sm' | 'md' = 'sm'
  ) {
    const sizeClass = size === 'md' ? 'size-10' : 'size-9';

    const iconClass = size === 'md' ? 'size-5' : 'size-4';

    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted`}>
        {user?.image ? (
          <img src={user.image} alt={user.name ?? user.email ?? 'User'} className="size-full object-cover" />
        ) : user ? (
          <span className="text-[10px] font-semibold text-muted-foreground">
            {getInitials(user.name, user.email)}
          </span>
        ) : (
          <UserRound className={`${iconClass} text-muted-foreground`} />
        )}
      </div>
    );
  }

  if (requestedWith && !requestedConversationId && !selectedId) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center p-4 lg:p-8">
        <section className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <MessageCircleReply className="size-6 text-primary" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">Start a conversation</h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Open the conversation with this user to discuss the opportunity.
          </p>

          <Button
            className="mt-6"
            onClick={() => router.replace(`/dashboard/messages?with=${requestedWith}`)}>
            Continue
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto h-[calc(100vh-4rem)] w-full max-w-[1500px] p-0 sm:p-4 lg:p-6">
      <div className="grid h-full min-h-0 overflow-hidden rounded-none border bg-card shadow-sm sm:rounded-3xl lg:grid-cols-[340px_1fr]">
        {/* Conversations */}
        <aside className={`min-h-0 border-r ${selectedId ? 'hidden lg:flex' : 'flex'} flex-col`}>
          <div className="border-b p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Communication</p>

                <h1 className="mt-1 text-xl font-bold">Messages</h1>
              </div>

              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                {conversations.length}
              </span>
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search conversations"
                className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <Archive className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">No conversations</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Conversations will appear here when you connect with another JobMan user.
                </p>
              </div>
            ) : (
              filteredConversations.map(conversation => {
                const other = conversation.participants[0]?.user;

                const latest = conversation.messages[0];

                const active = conversation.id === selectedId;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => void selectConversation(conversation.id)}
                    className={`flex w-full gap-3 border-b p-4 text-left transition-colors ${
                      active ? 'bg-primary/[0.06]' : 'hover:bg-muted/60'
                    }`}>
                    {renderAvatar(other, 'md')}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">
                          {other?.name ?? other?.email ?? 'Conversation'}
                        </p>

                        {latest && (
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {latest.createdAt.toLocaleTimeString('en-NG', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {latest?.deletedAt
                          ? 'Message deleted'
                          : latest?.body || (latest?.attachments?.length ? 'Attachment' : 'No messages yet')}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Conversation */}
        <section className={`min-h-0 flex-col ${selectedId ? 'flex' : 'hidden lg:flex'}`}>
          {!selectedId || !selectedConversation ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-muted">
                  <MessageCircleReply className="size-7 text-muted-foreground" />
                </div>

                <h2 className="mt-5 text-lg font-semibold">Your conversations</h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Choose a conversation to continue the discussion.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="flex shrink-0 items-center gap-3 border-b bg-card px-4 py-3 sm:px-5">
                <button
                  type="button"
                  className="rounded-lg p-2 hover:bg-muted lg:hidden"
                  onClick={() => {
                    setSelectedId(null);
                    router.replace('/dashboard/messages');
                  }}>
                  <ArrowLeft className="size-5" />
                </button>

                {renderAvatar(otherUser, 'md')}

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold">
                    {otherUser?.name ?? otherUser?.email ?? 'Conversation'}
                  </h2>

                  <p className="text-xs text-muted-foreground">Direct conversation</p>
                </div>

                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="size-4" />
                </Button>
              </header>

              {/* Messages */}
              <div className="min-h-0 flex-1 overflow-y-auto bg-muted/[0.16] px-3 py-5 sm:px-6">
                <div className="mx-auto max-w-3xl space-y-4">
                  {messages.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-card shadow-sm">
                        <MessageCircleReply className="size-5 text-muted-foreground" />
                      </div>

                      <p className="mt-4 text-sm font-medium">No messages yet</p>

                      <p className="mt-1 text-xs text-muted-foreground">Start the conversation below.</p>
                    </div>
                  )}

                  {messages.map(message => {
                    const mine = message.senderId === userId;

                    const deleted = Boolean(message.deletedAt);

                    const sender = message.sender;

                    return (
                      <div
                        key={message.id}
                        className={`group flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                        {/* Incoming avatar */}
                        {!mine && <div className="self-end pb-0.5">{renderAvatar(sender, 'sm')}</div>}

                        <div
                          className={`flex max-w-[88%] items-end gap-2 sm:max-w-[75%] ${
                            mine ? 'flex-row-reverse' : ''
                          }`}>
                          <div className="min-w-0">
                            {/* Sender name */}
                            {!mine && (
                              <p className="mb-1 px-1 text-[10px] font-medium text-muted-foreground">
                                {sender?.name ?? sender?.email ?? 'User'}
                              </p>
                            )}

                            {/* Bubble */}
                            <div
                              className={`rounded-2xl border px-3.5 py-2.5 shadow-sm ${
                                mine
                                  ? 'rounded-br-md border-emerald-700 bg-emerald-700 text-white'
                                  : 'rounded-bl-md bg-card text-foreground'
                              }`}>
                              {/* Reply preview */}
                              {message.replyTo && !deleted && (
                                <button
                                  type="button"
                                  onClick={() => beginReply(message.replyTo as Messages[number])}
                                  className={`mb-2 block w-full rounded-lg border-l-2 px-2.5 py-1.5 text-left text-xs ${
                                    mine ? 'border-white/50 bg-white/10' : 'border-primary bg-muted'
                                  }`}>
                                  <span className="font-semibold">{message.replyTo.sender.name}</span>

                                  <span className="mt-0.5 block truncate opacity-70">
                                    {message.replyTo.deletedAt
                                      ? 'Message deleted'
                                      : message.replyTo.body || 'Attachment'}
                                  </span>
                                </button>
                              )}

                              {/* Body */}
                              {deleted ? (
                                <p className="text-sm italic opacity-60">Message deleted</p>
                              ) : (
                                message.body && (
                                  <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                                )
                              )}

                              {/* Attachments */}
                              {message.attachments.length > 0 && !deleted && (
                                <div className={`space-y-2 ${message.body ? 'mt-2' : ''}`}>
                                  {message.attachments.map(file => (
                                    <div
                                      key={file.id}
                                      className={`overflow-hidden rounded-xl border ${
                                        mine ? 'border-white/15 bg-white/10' : 'bg-muted/50'
                                      }`}>
                                      {file.mimeType?.startsWith('image/') ? (
                                        <button
                                          type="button"
                                          onClick={() => setPreview(file)}
                                          className="block w-full">
                                          <img
                                            src={file.url}
                                            alt={file.fileName}
                                            className="max-h-64 w-full object-cover"
                                          />
                                        </button>
                                      ) : (
                                        <div className="flex items-center gap-3 p-2.5">
                                          <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                                              mine ? 'bg-white/10' : 'bg-background'
                                            }`}>
                                            {attachmentIcon(file.mimeType)}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium">{file.fileName}</p>

                                            <p className="text-[10px] opacity-60">
                                              {file.size ? `${Math.ceil(file.size / 1024)} KB` : 'Attachment'}
                                            </p>
                                          </div>

                                          {isPreviewable(file) && (
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant={mine ? 'secondary' : 'outline'}
                                              onClick={() => setPreview(file)}>
                                              Preview
                                            </Button>
                                          )}

                                          <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/5">
                                            <Download className="size-4" />
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Metadata */}
                              <div
                                className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                                  mine ? 'text-white/65' : 'text-muted-foreground'
                                }`}>
                                {message.updatedAt.getTime() !== message.createdAt.getTime() && !deleted && (
                                  <span>edited</span>
                                )}

                                <span>
                                  {message.createdAt.toLocaleTimeString('en-NG', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>

                                {mine &&
                                  (message.senderId === userId ? (
                                    <CheckCheck className="size-3" />
                                  ) : (
                                    <Check className="size-3" />
                                  ))}
                              </div>
                            </div>
                          </div>

                          {/* Message actions */}
                          {!deleted && (
                            <div className="invisible flex items-center gap-0.5 rounded-lg border bg-card p-1 shadow-sm transition-opacity group-hover:visible">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                title="Reply"
                                onClick={() => beginReply(message)}>
                                <MessageCircleReply className="size-3.5" />
                              </Button>

                              {mine && (
                                <>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    title="Edit"
                                    onClick={() => beginEdit(message)}>
                                    <Pencil className="size-3.5" />
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-destructive hover:text-destructive"
                                    title="Delete"
                                    onClick={() => void removeMessage(message.id)}>
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Outgoing avatar */}
                        {mine && <div className="self-end pb-0.5">{renderAvatar(sender, 'sm')}</div>}
                      </div>
                    );
                  })}

                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="border-t bg-destructive/5 px-4 py-2 text-xs text-destructive">{error}</div>
              )}

              {/* Reply / Edit context */}
              {(replyTo || editing) && (
                <div className="border-t bg-card px-4 py-2">
                  <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {editing ? (
                        <Pencil className="size-3.5 text-primary" />
                      ) : (
                        <MessageCircleReply className="size-3.5 text-primary" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">
                        {editing ? 'Editing message' : `Replying to ${replyTo?.sender.name ?? 'message'}`}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {editing ? editing.body : replyTo?.body || 'Attachment'}
                      </p>
                    </div>

                    <Button type="button" variant="ghost" size="sm" onClick={cancelComposerMode}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Selected files */}
              {files.length > 0 && !editing && (
                <div className="border-t bg-card px-4 py-2">
                  <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
                    {files.map(file => (
                      <span
                        key={`${file.name}-${file.lastModified}`}
                        className="inline-flex max-w-full items-center gap-2 rounded-full border bg-muted px-3 py-1.5 text-xs">
                        <Paperclip className="size-3 shrink-0" />

                        <span className="max-w-48 truncate">{file.name}</span>

                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setFiles(current => current.filter(item => item !== file))}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Composer */}
              <div className="shrink-0 border-t bg-card p-3 sm:p-4">
                <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm">
                  {!editing && (
                    <>
                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={event => setFiles(Array.from(event.target.files ?? []))}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 rounded-xl"
                        onClick={() => fileRef.current?.click()}>
                        <Paperclip className="size-5" />
                      </Button>
                    </>
                  )}

                  <textarea
                    value={body}
                    onChange={event => setBody(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void submitMessage();
                      }
                    }}
                    rows={1}
                    placeholder={
                      editing ? 'Edit your message…' : replyTo ? 'Write your reply…' : 'Write a message…'
                    }
                    className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />

                  <Button
                    type="button"
                    disabled={busy || (!body.trim() && files.length === 0)}
                    onClick={() => void submitMessage()}
                    className="size-10 shrink-0 rounded-xl"
                    size="icon">
                    {busy ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : editing ? (
                      <Check className="size-4" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>

                <p className="mx-auto mt-2 max-w-3xl px-2 text-[10px] text-muted-foreground">
                  Enter to send · Shift + Enter for a new line · files up to 10 MB
                </p>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Attachment Preview */}
      <Dialog
        open={Boolean(preview)}
        onOpenChange={open => {
          if (!open) {
            setPreview(null);
          }
        }}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle className="truncate text-sm">{preview?.fileName}</DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[78vh] min-h-80 items-center justify-center overflow-auto bg-muted/30 p-4">
            {preview?.mimeType?.startsWith('image/') && (
              <img
                src={preview.url}
                alt={preview.fileName}
                className="max-h-[70vh] max-w-full rounded-xl object-contain"
              />
            )}

            {preview?.mimeType?.startsWith('video/') && (
              <video src={preview.url} controls className="max-h-[70vh] max-w-full rounded-xl" />
            )}

            {preview?.mimeType === 'application/pdf' && (
              <iframe
                src={preview.url}
                title={preview.fileName}
                className="h-[70vh] w-full rounded-xl border bg-white"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
