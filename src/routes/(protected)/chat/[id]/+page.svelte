<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { Avatar, Button, Dropdown, DropdownItem, Input } from 'flowbite-svelte';
	import { BellOutline, BellRingSolid, EditOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import type { Message } from '$lib/types/types.js';

	export let data;

	const currentThreadMessages: Tables<'messages'>[] = data.current_thread_messages;

	let messagesData: Message[] = [];
	for (const message of currentThreadMessages) {
		let replyMessageContent = null;
		if (message.reply_message_id) {
			replyMessageContent = data.current_thread_messages.find(
				(replyMessage) => replyMessage.id === message.reply_message_id
			)?.content;
		}

		messagesData.push({
			id: message.id,
			createdAt: message.created_at,
			content: message.content,
			reactions: message.reactions,
			replyMessageContent: replyMessageContent,
			user: data.current_thread_users.find((user) => user?.id === message.user_id)
		});
	}
	console.log(messagesData);

	const currentThread: Tables<'threads'> = data.threads?.find(
		(thread) => thread.id === $page.params.id
	);
</script>

<div id="main" class="flex flex-col w-full h-full">
	<div id="chat-header" class="flex px-4 py-1.5 justify-between items-center border-b-2">
		<div id="head" class="flex items-center gap-2">
			<span class="text-lg font-semibold text-gray-700">{currentThread.name}</span>
			<Button class="!p-2" pill={true} color="none"><EditOutline /></Button>
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
					await invalidateAll();
				}}
			>
				{#if data.notifications_enabled}
					<BellRingSolid />
				{:else}
					<BellOutline />
				{/if}
			</Button>
			<Avatar src={data.user?.avatar_url ?? undefined} />
			<Dropdown>
				<DropdownItem>Sign Out</DropdownItem>
			</Dropdown>
		</div>
	</div>
	<div id="chat" class="flex flex-col w-full h-screen">
		<ChatContainer>
			{#each messagesData as message}
				<ChatMessage {message} is_current_user={message.user.id === data.user?.id} />
			{/each}
		</ChatContainer>
		<ChatInput />
	</div>
</div>
