import { error, redirect, type Actions } from "@sveltejs/kit"

export const actions: Actions = {
    signInWithGithub: async ({locals: { supabase }}) => {
        const { data, error: requestError } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: 'http://localhost:5173/api/auth-callback',
          },
        })

        if (requestError) {
          console.log(requestError);
          throw error(requestError?.status || 500, {
            message: requestError?.message || 'Ocurrió un error'
          });
		}
        if (data.url) {          
          return redirect(303, data.url)
        }
        else {
          throw error(500, {
              message: 'Ocurrió un error'
          })
        }
    },
    logout: async ({ locals: { supabase } }) => {
		const { error: requestError } = await supabase.auth.signOut();
		if (requestError) {
			console.log(requestError);
			throw error(requestError?.status || 500, {
				message: requestError?.message || 'Ocurrió un error'
			});
		}
		redirect(302, '/login');
	}
}