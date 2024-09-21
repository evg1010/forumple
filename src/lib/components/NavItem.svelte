<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { page } from '$app/stores';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { DotsVerticalOutline } from 'flowbite-svelte-icons';

	export let thread: Tables<'threads'>;
</script>

<div
	class="flex justify-between rounded-full hover:bg-gray-50 items-center"
	class:bg-gray-100={$page.url.pathname === `/chat/${thread.id}`}
>
	<a href="/chat/{thread.id}" class="px-2 truncate">
		<span class="font-semibold text-sm text-gray-800 truncate">{thread.name}</span>
	</a>
	<Button class="!p-2" color="none" size="xs"><DotsVerticalOutline class="w-6 h-6" /></Button>
	<Dropdown>
		<DropdownItem>Delete</DropdownItem>
	</Dropdown>
</div>
