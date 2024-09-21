<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { Avatar, Button, Dropdown, DropdownItem, Input } from 'flowbite-svelte';
	import {
		BellOutline,
		EditOutline,
		PaperClipOutline,
		ArrowUpOutline
	} from 'flowbite-svelte-icons';

	const current_thread: Tables<'threads'> = {
		id: 'dafa',
		created_at: '2021-01-01',
		description: 'This is a thread',
		name: '🖌️ Design Chat'
	};
</script>

<div id="main" class="flex flex-col w-full h-full">
	<div id="chat-header" class="flex px-4 py-1.5 justify-between items-center border-b-2">
		<div id="head" class="flex items-center gap-2">
			<span class="text-lg font-semibold text-gray-700">{current_thread.name}</span>
			<Button class="!p-2" pill={true} color="none"><EditOutline /></Button>
		</div>
		<div id="tail" class="flex items-center gap-2">
			<Button class="!p-2" pill={true} color="none"><BellOutline /></Button>
			<Avatar src="https://flowbite-svelte.com/images/profile-picture-2.webp" />
			<Dropdown>
				<DropdownItem>Sign Out</DropdownItem>
			</Dropdown>
		</div>
	</div>
	<div id="chat" class="flex flex-col items-center justify-center w-full h-full">
		<div id="chat-container" class="flex flex-col w-full h-full p-6 md:p-20"></div>
		<div id="input-zone" class="flex gap-2 px-5 py-3 w-full items-center border-t-2">
			<Input class="rounded-full px-3" placeholder="Type your message here ..." />
			<Button class="!p-2" pill={true} color="alternative"><PaperClipOutline /></Button>
			<Button class="!p-2" pill={true} color="alternative"><ArrowUpOutline /></Button>
		</div>
	</div>
</div>
