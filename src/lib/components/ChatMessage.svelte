<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Message } from '$lib/types/types';
	import { Avatar, Button } from 'flowbite-svelte';
	import { ReplyOutline } from 'flowbite-svelte-icons';
	import moment from 'moment';

	export let is_current_user: boolean;
	export let message: Message;

	const dispatch = createEventDispatcher();

	function handleReply() {
		dispatch('reply', message);
	}
</script>

<div
	id="message"
	class="flex gap-3 w-full first:mt-16 last:mb-4 items-center group"
	class:justify-end={is_current_user}
>
	<div class={`rounded-3xl w-fit max-w-lg p-4 shadow ${is_current_user ? 'bg-gray-100' : ''}`}>
		<div class="flex w-full gap-2.5">
			{#if !is_current_user}
				<Avatar src={message.user.avatar_url ?? undefined} />
			{/if}
			<div id="message" class={`flex flex-col gap-1 ${is_current_user ? 'items-end' : ''}`}>
				<div id="name-time" class="flex gap-1.5" class:justify-end={is_current_user}>
					<span class="text-sm font-semibold text-black">{message.user.name}</span>
					<span class="text-sm text-gray-500">
						{moment(message.createdAt).format('MMMM D, YYYY h:mm A')}
					</span>
				</div>
				{#if message.replyMessageContent}
					<div id="reply" class="flex gap-1 px-1">
						<div class="bg-gray-300 w-1.5"></div>
						<p class="text-gray-600 break-words">
							{message.replyMessageContent}
						</p>
					</div>
				{/if}
				{#if message.image_url}
					<img src={message.image_url} class="rounded-2xl h-fit w-fit flex" alt="shared" />
				{/if}
				<p class="text-gray-800 break-words">
					{message.content}
				</p>
			</div>
		</div>
	</div>
	<Button
		color="alternative"
		pill={true}
		size="xs"
		class={`!p-2 h-fit text-gray-200 hover:text-gray-500 group-hover:block hidden ${is_current_user ? 'order-first' : ''}`}
		on:click={handleReply}
	>
		<ReplyOutline class="w-4 h-4" />
	</Button>
</div>
