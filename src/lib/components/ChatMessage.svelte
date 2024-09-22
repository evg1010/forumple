<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { Avatar, Card } from 'flowbite-svelte';

	export let current_user: boolean = false;
	export let message: Tables<'messages'>;
	export let reply_to: Tables<'messages'> | null = null;
	export let image: string | null = null;
</script>

<div id="message" class="flex gap-3 w-full first:mt-16 last:mb-4" class:justify-end={current_user}>
	<div class={`rounded-3xl w-full max-w-lg p-4 shadow ${current_user ? 'bg-gray-100' : ''}`}>
		<div class="flex gap-2.5">
			{#if !current_user}
				<Avatar src="https://flowbite-svelte.com/images/profile-picture-2.webp" />
			{/if}
			<div id="message" class={`flex flex-col gap-1 ${current_user ? 'items-end' : ''}`}>
				<div id="name-time" class="flex gap-1.5" class:justify-end={current_user}>
					<span class="text-sm font-semibold text-black">Bonnie Green</span>
					<span class="text-sm text-gray-500">{message.created_at}</span>
				</div>
				{#if reply_to}
					<div id="reply" class="flex gap-1 px-1">
						<div class="bg-gray-300 w-1.5"></div>
						<p class="text-gray-600 break-words">
							{reply_to.content}
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
