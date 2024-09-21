import type { LayoutServerLoad } from './$types'
import { supabase } from "$lib/supabaseClient";
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
    let threadsInfoList: any[] = []
    if (!user) return error(401, "Unauthorized")
    const { data } = await supabase.from("user_thread").select().eq("user_id", user.id)
    if (!data) return threadsInfoList

    for (const thread of data) {
        const { data: threadData } = await supabase.from("threads").select().eq("id", thread.thread_id)
        if (!threadData) continue
        const item = {
            threadData: threadData[0],
            notifications_enabled: thread.notifications_enabled
        }        
        threadsInfoList.push(item) 
    }

    return {
        threadsInfoList
    }
}