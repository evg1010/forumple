import type { PageServerLoad } from './$types'
import { supabase } from "$lib/supabaseClient";
import { error, type Actions } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ locals, params }) => {    
    let notifications_enabled = true
    if (!locals.user) return error(401, "Unauthorized")
    const { data } = await supabase.from("user_thread").select().eq("user_id", locals.user.id).eq("thread_id", params.id)
    if (data) notifications_enabled = data[0].notifications_enabled
    
    return { notifications_enabled }
}

export const actions: Actions = {
    toggleNotifications: async ({ locals, params, request }) => {        
        if (!locals.user || !params.id) return error(401, "Unauthorized")
        const formData = await request.formData();
        const notifications_enabled = formData.get('notifications_enabled') === 'true';

        await supabase
          .from("user_thread")
          .update({ notifications_enabled })
          .eq("user_id", locals.user.id).eq("thread_id", params.id);
        console.log("notifications_enabled: ", notifications_enabled);
    },
    updateThreadName: async ({ locals, params, request }) => {
        if (!locals.user || !params.id) return error(401, "Unauthorized");
        const formData = await request.formData();
        const name = formData.get('name');
        await supabase
          .from("threads")
          .update({ name })
          .eq("id", params.id);
        console.log("Thread name updated:", name);
      },
  };