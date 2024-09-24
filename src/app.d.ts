import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/supabase';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: Tables<'users'> | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
