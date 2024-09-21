import type { LayoutServerLoad } from './$types'
import { supabase } from "$lib/supabaseClient";
import { error } from '@sveltejs/kit';
import type { Tables } from '$lib/types/supabase';


export const load: LayoutServerLoad = async ({ locals: { user } }) => {
    let threads: Tables<'threads'>[] = []
    if (!user) return error(401, "Unauthorized")
    const { data } = await supabase.from("user_thread").select().eq("user_id", user.id)
    if (!data) return threads

    for (const thread of data) {
        const { data: threadData } = await supabase.from("threads").select().eq("id", thread.thread_id)
        if (!threadData) continue
        threads.push(threadData[0]) 
    }
    console.log(threads);
    
    return {
        threads
    }
}