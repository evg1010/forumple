<script lang="ts">
	import NavItem from '$lib/components/NavItem.svelte';
	import type { Tables } from '$lib/types/supabase';
	import { Button } from 'flowbite-svelte';
	import { BarsOutline, PlusOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import ThreadModal from '$lib/components/ThreadModal.svelte';

	export let data;
	let threads: Tables<'threads'>[] = data.threads || [];

	onMount(() => {
		// Set up realtime subscription
		const subscription = supabase
			.channel('threads')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'threads' },
				(payload) => {
					const new_thread = payload.new as Tables<'threads'>;
					threads = [new_thread, ...threads];
				}
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'threads' },
				(payload) => {
					const updated_thread = payload.new as Tables<'threads'>;
					const index = threads.findIndex((thread) => thread.id === updated_thread.id);
					threads[index] = updated_thread;
				}
			)
			.on(
				'postgres_changes',
				{ event: 'DELETE', schema: 'public', table: 'threads' },
				(payload) => {
					const deleted_thread = payload.old as Tables<'threads'>;
					const index = threads.findIndex((thread) => thread.id === deleted_thread.id);
					threads.splice(index, 1);
				}
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	});

	let modalOpen = false;
</script>

<div class="flex w-full h-full">
	<div id="sidebar" class="flex flex-col w-80 shrink-0 h-full border-r-2 bg-rose-200">
		<div id="app-header" class="flex items-center gap-3 px-3 py-1.5">
			<!-- <Button color="alternative" size="lg" class="!p-2"><BarsOutline class="w-6 h-6" /></Button> -->
			<div id="logo" class="flex gap-1 items-center">
				<img
					src="https://i.pinimg.com/170x/10/a1/84/10a184250bda6ab31902b3b30ba4ee3a.jpg"
					alt="logo"
					class="w-10 h-10"
				/>
				<span class="text-4xl font-light font-mono text-rose-400">Forumple</span>
			</div>
		</div>
		<div id="chat-history" class="flex flex-col px-3">
			<div id="head" class="flex py-2 justify-between">
				<span class="text-lg font-semibold">Chat History</span>
				<Button color="alternative" size="sm" class="!p-2" on:click={() => (modalOpen = true)}>
					<PlusOutline />
				</Button>
				<ThreadModal
					current_user={data.current_user}
					users={data.users || []}
					title={'Create Thread'}
					user_threads={data.user_thread_relationships || []}
					bind:open={modalOpen}
				/>
			</div>
			<div id="list" class="flex-col gap-2">
				{#each threads as thread}
					<NavItem {thread} />
				{/each}
			</div>
		</div>
	</div>
	<slot />
</div>
