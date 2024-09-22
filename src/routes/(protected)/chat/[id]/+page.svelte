<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { Avatar, Button, Dropdown, DropdownItem, Input } from 'flowbite-svelte';
	import {
		BellOutline,
		BellRingSolid,
		EditOutline,
		PaperClipOutline,
		ArrowUpOutline
	} from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	const currentUser: Tables<'users'> = data.user;

	const currentThread: Tables<'threads'> = data.threads.find(
		(thread) => thread.id === $page.params.id
	);
	let editMode = false;
</script>

<div id="main" class="flex flex-col w-full h-full">
	<div id="chat-header" class="flex px-4 py-1.5 justify-between items-center border-b-2">
		<div id="head" class="flex items-center gap-2">
			<span class="text-lg font-semibold text-gray-700">{currentThread.name}</span>
			<Button
				class="!p-2"
				pill={true}
				color="none"
				on:click={async () => {
					editMode = true;
				}}><EditOutline /></Button
			>
			{#if editMode}
				<Input
					class="rounded-full px-3"
					value={currentThread.name}
					on:input={(e) => {
						currentThread.name = e.target.value;
					}}
				/>
				<Button
					class="!p-2"
					pill={true}
					color="alternative"
					on:click={async () => {
						editMode = false;
						// Send the updated thread name to the server
						const formData = new FormData();
						formData.append('name', currentThread.name);
						await fetch(`?/updateThreadName`, {
							method: 'POST',
							body: formData
						});
						// Refresh the page to display the updated thread name
						await invalidateAll();
					}}>Save</Button
				>
			{/if}
		</div>
		<div id="tail" class="flex items-center gap-2">
			<Button
				class="!p-2"
				pill={true}
				color="none"
				on:click={async () => {
					const newValue = !data.notifications_enabled;
					const formData = new URLSearchParams({
						notifications_enabled: newValue.toString()
					});
					await fetch(`?/toggleNotifications`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: formData.toString()
					});
					// const url = $page.url.pathname;
					await invalidateAll();
				}}
			>
				{#if data.notifications_enabled}
					<BellRingSolid />
				{:else}
					<BellOutline />
				{/if}
			</Button>
			<Avatar src={currentUser.avatar_url} />
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
