import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error: requestError } = await supabase.auth.exchangeCodeForSession(code);
		if (!requestError) {
			throw redirect(303, `/${next.slice(1)}`);
		}
	}
    
    // return the user to an error page with instructions
	throw error(404, 'Code not found');
};
