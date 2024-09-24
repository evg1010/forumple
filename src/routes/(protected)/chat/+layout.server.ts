import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { Tables } from '$lib/types/supabase';

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
	let threads: Tables<'threads'>[] = [];
	if (!user || user === undefined) return error(401, 'Unauthorized');
	const { data } = await supabase
		.from('user_thread')
		.select()
		.eq('user_id', user.id)
		.order('last_modified', { ascending: false });
	if (!data || data === undefined) return threads;

	for (const thread of data) {
		const { data: threadData } = await supabase.from('threads').select().eq('id', thread.thread_id);
		if (!threadData) continue;
		threads.push(threadData[0]);
	}

	return {
		threads,
		user
	};
};
