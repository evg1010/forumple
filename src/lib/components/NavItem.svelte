<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { page } from '$app/stores';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { DotsVerticalOutline } from 'flowbite-svelte-icons';

	export let thread: Tables<'threads'>;
	export let unread: boolean = false;

	function handleRedirect() {
		window.location.href = `/chat/${thread.id}`;
		unread = false;
	}
</script>

<div
	class={`flex justify-between rounded-full bg-rose-200 hover:bg-white items-center my-2 ${unread ? 'outline outline-green-300' : ''}`}
	class:bg-gray-100={$page.url.pathname === `/chat/${thread.id}`}
>
	<a href="/chat/{thread.id}" class="px-2 truncate w-full" on:click={handleRedirect}>
		<span class="font-semibold text-sm text-gray-800 truncate">{thread.name}</span>
	</a>
	<Button class="!p-2" color="none" size="xs"><DotsVerticalOutline class="w-6 h-6" /></Button>
	<Dropdown>
		<DropdownItem>Delete</DropdownItem>
	</Dropdown>
</div>
