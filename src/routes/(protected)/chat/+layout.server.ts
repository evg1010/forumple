import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { Tables } from '$lib/types/supabase';

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
	if (!user || user === undefined) return error(401, 'Unauthorized');

	let users: Tables<'users'>[] = [];
	let user_thread_relationships: Tables<'user_thread'>[] = [];
	let threads: Tables<'threads'>[] = [];

	const { data: usersData } = await supabase.from('users').select();
	if (usersData) users = usersData;

	const { data: user_thread_relationshipsData } = await supabase.from('user_thread').select();
	if (user_thread_relationshipsData) user_thread_relationships = user_thread_relationshipsData;

	// Filter and order user_thread_relationships based on user_id and last_modified
	const current_user_thread_relationships = user_thread_relationships
		.filter((relationship) => relationship.user_id === user.id)
		.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime());

	// Fetch corresponding threads
	for (const relationship of current_user_thread_relationships) {
		const { data: threadData } = await supabase
			.from('threads')
			.select()
			.eq('id', relationship.thread_id);
		if (!threadData) continue;
		threads.push(threadData[0]);
	}

	return { user_thread_relationships, threads, users, current_user: user };
};
