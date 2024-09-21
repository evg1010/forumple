<script lang="ts">
	import NavItem from '$lib/components/NavItem.svelte';
	import type { Tables } from '$lib/types/supabase';
	import { Button } from 'flowbite-svelte';
	import { BarsOutline } from 'flowbite-svelte-icons';

	const testThreads: Tables<'threads'>[] = [
		{
			id: 'akhj1l3h2',
			name: 'Design Chat',
			created_at: 'morning day sunshine',
			description: 'Desdeccsfds'
		},
		{
			id: 'thread2',
			name: 'Development Discussion',
			created_at: 'afternoon',
			description: 'Discuss development-related topics'
		},
		{
			id: 'thread3',
			name: 'Marketing Meeting',
			created_at: 'yesterday',
			description: 'Discuss marketing strategies'
		},
		{
			id: 'thread4',
			name: 'Sales Chat',
			created_at: 'last week',
			description: 'Discuss sales-related topics'
		},
		{
			id: 'thread5',
			name: 'Customer Support',
			created_at: 'this morning',
			description: 'Discuss customer support-related topics'
		}
	];
</script>

<div class="flex w-full h-full">
	<div id="sidebar" class="flex flex-col w-80 h-full border-r-2">
		<div id="app-header" class="flex items-center gap-3 px-3">
			<Button color="alternative" size="lg" class="!p-2"><BarsOutline class="w-6 h-6" /></Button>
			<div id="logo" class="flex gap-1 items-center">
				<img
					src="https://static.vecteezy.com/system/resources/previews/022/493/606/original/3d-rendering-phone-call-icon-on-pink-chat-bubble-isolated-on-transparent-background-png.png"
					alt="logo"
					class="w-14 h-14"
				/>
				<span class="text-2xl font-light text-pink-900">Forumple</span>
			</div>
		</div>
		<div id="chat-history" class="flex flex-col px-3">
			<div id="head" class="py-2">
				<span class="text-lg font-semibold">Chat History</span>
			</div>
			<div id="list" class="flex-col gap-2">
				{#each testThreads as thread}
					<NavItem {thread} />
				{/each}
			</div>
		</div>
	</div>
</div>
