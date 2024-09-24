<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { Avatar, Button, Dropdown, DropdownItem, Input } from 'flowbite-svelte';
	import { BellOutline, BellRingSolid, EditOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import { parseMessage } from '$lib/utils/messages';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import type { Message } from '$lib/types/types.js';

	export let data;
	let notifications_enabled: boolean = data.notifications_enabled;
	let current_thread_users: Tables<'users'>[] = data.current_thread_users;
	const currentThreadMessages = writable(data.current_thread_messages);
	let currentThread: Tables<'threads'> = data.threads?.find(
		(thread) => thread.id === $page.params.id
	);

	let reply_message: Message;

	onMount(() => {
		// Set up realtime subscription
		const subscription = supabase
			.channel('messages')
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'user_thread' },
				(payload) => {
					notifications_enabled = payload.new.notifications_enabled;
				}
			)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
				if (payload.eventType === 'INSERT') {
					const message = payload.new as Tables<'messages'>;
					currentThreadMessages.update((messages) => [...messages, message]);
				}
				if (payload.eventType === 'UPDATE') {
					const message = payload.new as Tables<'messages'>;
					currentThreadMessages.update((messages) => {
						const index = messages.findIndex((m) => m.id === message.id);
						if (index !== -1) {
							messages[index] = message;
						}
						return messages;
					});
				}
				if (payload.eventType === 'DELETE') {
					const message = payload.old as Tables<'messages'>;
					currentThreadMessages.update((messages) => {
						const index = messages.findIndex((m) => m.id === message.id);
						if (index !== -1) {
							messages.splice(index, 1);
						}
						return messages;
					});
				}
			})
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'threads' },
				(payload) => {
					const new_thread = payload.new as Tables<'threads'>;
					if (new_thread.id === $page.params.id) {
						currentThread = new_thread;
					}
				}
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	});

	$: messages = $currentThreadMessages.map((message) =>
		parseMessage(message, $currentThreadMessages, current_thread_users)
	);

	async function handleNotificationsOnClick() {
		const newValue = !notifications_enabled;
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
	}

	async function handleSignOut() {
		await fetch('?/sign_out', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		throw goto('/login');
	}

	function handleReply(event: CustomEvent<Message>) {
		reply_message = event.detail;
	}
</script>

<div id="main" class="flex flex-col w-full h-screen">
	<div
		id="chat-header"
		class="flex sticky top-0 px-4 py-1.5 justify-between items-center border-b-2 bg-rose-200"
	>
		<div id="head" class="flex items-center gap-2">
			<span class="text-lg font-semibold text-gray-700">{currentThread.name}</span>
			<Button class="!p-2" color="alternative"><EditOutline /></Button>
		</div>
		<div id="tail" class="flex items-center gap-2">
			<!-- <Button class="!p-2" pill={true} color="none" on:click={handleNotificationsOnClick}>
				{#if notifications_enabled}
					<BellRingSolid />
				{:else}
					<BellOutline />
				{/if}
			</Button> -->
			<Avatar src={data.current_user?.avatar_url ?? undefined} />
			<Dropdown>
				<DropdownItem on:click={handleSignOut}>Sign Out</DropdownItem>
			</Dropdown>
		</div>
	</div>
	<ChatContainer>
		{#each messages as message}
			<ChatMessage
				{message}
				is_current_user={message.user.id === data.current_user?.id}
				on:reply={handleReply}
			/>
		{/each}
	</ChatContainer>
	<ChatInput bind:reply_message />
</div>
