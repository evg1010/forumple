<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowUpOutline, CloseCircleSolid } from 'flowbite-svelte-icons';
	import AttachImage from './AttachImage.svelte';
	import type { Message, MessageBody } from '$lib/types/types';

	export let reply_message: Message | null = null;
	let message = '';
	let textareaElement: HTMLTextAreaElement | null = null;

	function handleSubmit() {
		if (message.trim()) {
			let body: MessageBody = {
				content: message.trim()
			};

			if (reply_message) {
				body.reply_message_id = reply_message.id;
			}

			fetch(`?/createMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams(body).toString()
			});
			message = '';
			autoResize(); // Reset the height after sending the message
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}

	function autoResize() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			const maxHeight = 96; // Maximum height in pixels (approx. 3 lines)
			textareaElement.style.height = Math.min(textareaElement.scrollHeight, maxHeight) + 'px';
		}
	}

	// Call autoResize when the component initializes
	onMount(() => {
		autoResize();
	});

	// Watch the message variable and adjust the textarea height accordingly
	$: autoResize();

	function handleCloseReply() {
		reply_message = null;
	}
</script>

<div class="flex flex-col border-t-2">
	{#if reply_message}
		<div class="flex justify-between items-center p-2 mt-2 mx-6 bg-gray-100 rounded-lg">
			<div class="flex gap-1">
				<div class="bg-gray-300 w-1.5"></div>
				<p class="text-gray-600 break-words">
					{reply_message.content}
				</p>
			</div>
			<Button color="none" pill={true} size="xs" class="!p-2" on:click={handleCloseReply}>
				<CloseCircleSolid class="w-4 h-4" color="gray" />
			</Button>
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="flex gap-2 px-5 py-3 w-full items-center">
		<div class="flex flex-grow items-end">
			<textarea
				bind:value={message}
				bind:this={textareaElement}
				on:input={autoResize}
				on:keydown={handleKeydown}
				placeholder="Type your message here ..."
				rows="1"
				class="w-full text-sm px-3 p-2 pr-10 rounded-3xl resize-none overflow-y-auto border-gray-200 scrollbar-none"
				style="line-height: 1.5;"
			></textarea>
		</div>
		<AttachImage />
		<Button type="submit" class="!p-2" pill={true} color="alternative" disabled={!message.trim()}>
			<ArrowUpOutline />
		</Button>
	</form>
</div>
