<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';

	const test_messages: Tables<'messages'>[] = [
		{
			id: '1',
			user_id: '1',
			content: "That's awesome. I think our users will really appreciate the improvements.",
			created_at: '2021-01-01 12:00:00',
			reactions: null,
			reply_message_id: null,
			thread_id: '1'
		},
		{
			id: '2',
			user_id: '2',
			content: 'Yeah! totally agree with you. Send me the details',
			created_at: '2021-01-01 12:01:00',
			reactions: null,
			reply_message_id: null,
			thread_id: '1'
		}
	];
</script>

<div class="flex flex-col h-screen">
	<ChatContainer>
		<ChatMessage
			message={test_messages[0]}
			is_current_user={true}
			image={'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png'}
		/>
		<ChatMessage message={test_messages[0]} />
		<ChatMessage message={test_messages[1]} is_current_user={true} reply_to={test_messages[0]} />
		<ChatMessage
			message={test_messages[0]}
			is_current_user={true}
			image={'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png'}
		/>
		<ChatMessage message={test_messages[0]} />
		<ChatMessage message={test_messages[1]} is_current_user={true} reply_to={test_messages[0]} />
	</ChatContainer>
	<ChatInput />
</div>
