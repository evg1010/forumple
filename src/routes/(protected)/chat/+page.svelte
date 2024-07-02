<script lang="ts">
	import { Button, Input, Label } from 'flowbite-svelte';
	let message = '';
	let messages = [
		{ name: 'User1', text: 'Hello everyone!' },
		{ name: 'User2', text: 'Hi User1!' }
		// Add more messages here...
	];

	const sendMessage = () => {
		if (message.trim() !== '') {
			messages = [...messages, { name: 'You', text: message }];
			message = '';
		}
	};
</script>

<div class="flex bg-gray-100">
	<div class="w-full h-full p-8 space-y-4 bg-white rounded-md shadow-md">
		<h2 class="text-2xl font-semibold text-center text-gray-700">Group Conversation</h2>
		<div
			class="space-y-4 overflow-auto h-96 border border-gray-200 rounded-md p-4 bg-gradient-to-br from-rose-400 to-pink-500"
		>
			{#each messages as msg (msg.text)}
				<div class="p-3 w-1/3 rounded-2xl bg-rose-200 text-black">
					<strong>{msg.name}</strong>: {msg.text}
				</div>
			{/each}
		</div>
		<div class="space-y-2">
			<Label for="message">Message</Label>
			<Input id="message" type="text" bind:value={message} placeholder="Type your message here" />
		</div>
		<div class="pt-4">
			<Button on:click={sendMessage} variant="primary" block>Send</Button>
		</div>
	</div>
</div>
