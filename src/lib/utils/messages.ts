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
