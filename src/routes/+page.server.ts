import { error, redirect, type Actions } from '@sveltejs/kit';
import { ORIGIN } from '$env/static/private';

export const actions: Actions = {
	signInWithGithub: async ({ locals: { supabase } }) => {
		const { data, error: requestError } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${ORIGIN}/api/auth-callback`
			}
		});

		if (requestError) {
			console.log(requestError);
			throw error(requestError?.status || 500, {
				message: requestError?.message || 'Ocurrió un error'
			});
		}
		if (data.url) {
			return redirect(303, data.url);
		} else {
			throw error(500, {
				message: 'Ocurrió un error'
			});
		}
	}
};
