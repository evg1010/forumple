import type { Tables } from '$lib/types/supabase';
import type { Message } from '$lib/types/types';

export function parseMessage(
	message: Tables<'messages'>,
	threadMessages: Tables<'messages'>[],
	threadUsers: any[]
): Message {
	let replyMessageContent = null;
	if (message.reply_message_id) {
		replyMessageContent = threadMessages.find(
			(replyMessage) => replyMessage.id === message.reply_message_id
		)?.content;
	}

	return {
		id: message.id,
		createdAt: message.created_at,
		content: message.content,
		image_url: message.image_url,
		reactions: message.reactions,
		replyMessageContent: replyMessageContent ?? null,
		user: threadUsers.find((user) => user?.id === message.user_id)
	};
}

export function orderThreads(threads: Tables<'threads'>[]) {
	threads.sort((a, b) => {
		return new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime();
	});

	const activeThread = threads.find((thread) => thread.active);
	if (activeThread) {
		return [activeThread, ...threads.filter((thread) => thread.id !== activeThread?.id)];
	}
	return threads;
}
