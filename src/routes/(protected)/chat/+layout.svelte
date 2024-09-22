<script lang="ts">
	import NavItem from '$lib/components/NavItem.svelte';
	import type { Tables } from '$lib/types/supabase';
	import { Button } from 'flowbite-svelte';
	import { BarsOutline } from 'flowbite-svelte-icons';

	export let data;
	const threads: Tables<'threads'>[] = data.threads || [];

	// const testThreads: Tables<'threads'>[] = [
	// 	{
	// 		id: 'akhj1l3h2',
	// 		name: '🖌️ Design Chat',
	// 		created_at: 'morning day sunshine',
	// 		description: 'Desdeccsfds'
	// 	},
	// 	{
	// 		id: 'thread2',
	// 		name: '👩‍💻 Development Discussion hgjhgjhg',
	// 		created_at: 'afternoon',
	// 		description: 'Discuss development-related topics'
	// 	},
	// 	{
	// 		id: 'thread3',
	// 		name: '📢 Marketing Meeting',
	// 		created_at: 'yesterday',
	// 		description: 'Discuss marketing strategies'
	// 	},
	// 	{
	// 		id: 'thread4',
	// 		name: '💼 Sales Chat',
	// 		created_at: 'last week',
	// 		description: 'Discuss sales-related topics'
	// 	},
	// 	{
	// 		id: 'thread5',
	// 		name: '🤵 Customer Support',
	// 		created_at: 'this morning',
	// 		description: 'Discuss customer support-related topics'
	// 	}
	// ];
</script>

<div class="flex w-full h-full">
	<div id="sidebar" class="flex flex-col w-80 shrink-0 h-full border-r-2">
		<div id="app-header" class="flex items-center gap-3 px-3">
			<Button color="alternative" size="lg" class="!p-2"><BarsOutline class="w-6 h-6" /></Button>
			<div id="logo" class="flex gap-1 items-center">
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUm66Ge_N0-YLhMRhezPP3CY1COm7mmjQ9pA&s"
					alt="logo"
					class="w-8 h-8"
				/>
				<span class="text-2xl font-light text-pink-600">Forumple</span>
			</div>
		</div>
		<div id="chat-history" class="flex flex-col px-3">
			<div id="head" class="py-2">
				<span class="text-lg font-semibold">Chat History</span>
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
