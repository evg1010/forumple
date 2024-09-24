import { createServerClient } from '@supabase/ssr';
import { error, type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Tables } from '$lib/types/supabase';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	let current_user: Tables<'users'> | null = null;
	let { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;

	if (user) {
		const { data } = await event.locals.supabase.from('users').select().eq('id', user.id);
		if (data && data.length === 1) current_user = data[0];
	}
	event.locals.user = current_user;

	if (!event.locals.session && event.url.pathname.startsWith('/chat')) {
		redirect(303, '/login');
	}

	if (
		event.locals.session &&
		(event.url.pathname === '/login' ||
			event.url.pathname === '/chat' ||
			event.url.pathname === '/')
	) {
		// Search the last thread the user was in
		const { data } = await event.locals.supabase
			.from('user_thread')
			.select('thread_id')
			.eq('user_id', event.locals.user?.id)
			.order('last_modified', { ascending: false })
			.limit(1);

		if (data) redirect(303, `/chat/${data[0].thread_id}`);
		else error(404, 'No chat threads found');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
