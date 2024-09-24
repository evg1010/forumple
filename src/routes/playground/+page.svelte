<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import { Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import ThreadModal from '$lib/components/ThreadModal.svelte';

	const test_messages: Message[] = [
		{
			id: '1',
			createdAt: '2023-10-01T12:00:00Z',
			content: 'Hello, world!',
			reactions: null,
			replyMessageContent: null,
			user: {
				id: 'user1',
				name: 'Alice',
				avatar_url:
					'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png'
			}
		},
		{
			id: '2',
			createdAt: '2023-10-01T12:05:00Z',
			content: 'Yeah! Totally agree with you. Send me the details.',
			reactions: null,
			replyMessageContent: null,
			user: {
				id: 'user2',
				name: 'Bob',
				avatar_url:
					'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png'
			}
		}
	];

	const test_users: Tables<'users'>[] = [
		{
			id: '1',
			name: 'user1',
			email: '<EMAIL>',
			avatar_url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png',
			created_at: '2021-01-01 12:00:00',
			description: 'This is a test user'
		},
		{
			id: '2',
			name: 'user2',
			email: '<EMAIL>',
			avatar_url: 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png',
			created_at: '2021-01-01 12:00:00',
			description: 'This is another test user'
		}
	];

	const test_thread: Tables<'threads'>[] = [
		{
			id: '1',
			name: 'Test Thread',
			created_at: '2021-01-01 12:00:00',
			description: ''
		}
	];

	const test_user_threads: Tables<'user_thread'>[] = [
		{
			user_id: '1',
			thread_id: '1',
			notifications_enabled: true,
			last_modified: 'lklk'
		}
	];

	let modalOpen = false;
</script>

<div class="flex flex-col h-screen">
	<div class="flex gap-2 sticky top-0 bg-blue-500 text-white p-4 shadow-md">
		<h1 class="text-xl font-bold">Chat Window</h1>
		<Button color="alternative" class="!p-2" on:click={() => (modalOpen = true)}
			><PlusOutline /></Button
		>
		<ThreadModal
			users={test_users}
			title={'Create Thread'}
			thread={test_thread[0]}
			user_threads={test_user_threads}
			bind:open={modalOpen}
		/>
	</div>
	<ChatContainer>
		<ChatMessage
			message={test_messages[0]}
			is_current_user={true}
			image={'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png'}
		/>
		<ChatMessage message={test_messages[0]} is_current_user={false} />
		<ChatMessage message={test_messages[1]} is_current_user={true} />
		<ChatMessage
			message={test_messages[0]}
			is_current_user={true}
			image={'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png'}
		/>
		<ChatMessage message={test_messages[0]} is_current_user={false} />
		<ChatMessage message={test_messages[1]} is_current_user={true} />
	</ChatContainer>
	<ChatInput />
</div>
