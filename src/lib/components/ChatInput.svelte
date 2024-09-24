<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowUpOutline, PaperClipOutline } from 'flowbite-svelte-icons';
	import AttachImage from './AttachImage.svelte';

	let message = '';
	let textareaElement: HTMLTextAreaElement | null = null;

	function handleSubmit() {
		if (message.trim()) {
			fetch(`?/createMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					content: message.trim()
				}).toString()
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

	function handleAttachment() {
		// Implement attachment functionality
		console.log('Attachment button clicked');
	}
</script>

<form
	on:submit|preventDefault={handleSubmit}
	class="flex gap-2 px-5 py-3 w-full items-center border-t-2"
>
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
