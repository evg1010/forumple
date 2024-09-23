import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { error as svelteError, type Actions } from '@sveltejs/kit';
import type { Tables } from '$lib/types/supabase';

export const load: PageServerLoad = async ({ locals, params }) => {
	let notifications_enabled = false;
	let current_thread_messages: Tables<'messages'>[] = [];
	let current_thread_users = [];

	if (locals.user) {
		const current_user_id = locals.user.id;
		const { data } = await supabase
			.from('user_thread')
			.select('notifications_enabled, users(id, name, avatar_url)')
			.eq('thread_id', params.id);

		if (data) {
			current_thread_users = data.map((item) => item.users);
			const matchingItem = data.find((item) => item.users?.id === current_user_id);
			if (matchingItem) {
				notifications_enabled = matchingItem.notifications_enabled;
			}

			const { data: messages } = await supabase
				.from('messages')
				.select()
				.eq('thread_id', params.id)
				.order('created_at', { ascending: true });
			if (messages) current_thread_messages = messages;

			return { notifications_enabled, current_thread_users, current_thread_messages };
		} else {
			return svelteError(404, 'Thread not found');
		}
	} else {
		return svelteError(401, 'Unauthorized');
	}
};

export const actions: Actions = {
	toggleNotifications: async ({ locals, params, request }) => {
		if (!locals.user || !params.id) return svelteError(401, 'Unauthorized');
		const formData = await request.formData();
		const notifications_enabled = formData.get('notifications_enabled') === 'true';

		await supabase
			.from('user_thread')
			.update({ notifications_enabled })
			.eq('user_id', locals.user.id)
			.eq('thread_id', params.id);
		console.log('notifications_enabled: ', notifications_enabled);
	},
	updateThreadName: async ({ locals, params, request }) => {
		if (!locals.user || !params.id) return svelteError(401, 'Unauthorized');
		const formData = await request.formData();
		const name = formData.get('name');
		if (name !== null) {
			const { error } = await supabase
				.from('threads')
				.update({ name: name as string })
				.eq('id', params.id);
			console.log('Error updating thread name: ', error?.message);

			console.log('Thread name updated:', name);
		}
	},
	createMessage: async ({ locals, params, request }) => {
		if (!locals.user || !params.id) return svelteError(401, 'Unauthorized');
		const formData = await request.formData();
		const content = formData.get('content');

		if (content !== null) {
			const { error } = await supabase.from('messages').insert({
				content: content as string,
				thread_id: params.id,
				user_id: locals.user.id,
				reply_message_id: null
			});
			console.log('Error creating message: ', error?.message);
			console.log('Message created');
		}
	}
};
