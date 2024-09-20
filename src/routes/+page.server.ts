import { error, redirect, type Actions } from "@sveltejs/kit"
import { supabase } from "$lib/supabaseClient";

export async function load() {
  console.log("HEREEEEEE");
  
  const { data } = await supabase.from("users").select('*');
  console.log(data);
  
  return {
    users: data ?? [],
  };
}

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