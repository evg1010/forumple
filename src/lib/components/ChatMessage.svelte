<script lang="ts">
	import type { Message } from '$lib/types/types';
	import { Avatar } from 'flowbite-svelte';
	import moment from 'moment';

	export let is_current_user: boolean;
	export let message: Message;
	export let image: string | null = null;
</script>

<div
	id="message"
	class="flex gap-3 w-full first:mt-16 last:mb-4"
	class:justify-end={is_current_user}
>
	<div class={`rounded-3xl w-full max-w-lg p-4 shadow ${is_current_user ? 'bg-gray-100' : ''}`}>
		<div class="flex gap-2.5">
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
						<p class="text-gray-600 break-words">
							{message.replyMessageContent}
						</p>
					</div>
				{/if}
				{#if image}
					<img src={image} class="rounded-2xl object-none h-fit w-fit flex" alt="shared" />
				{/if}
				<p class="text-gray-800 break-words">
					{message.content}
				</p>
			</div>
		</div>
	</div>
</div>
