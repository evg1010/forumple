<script>
	import { goto } from '$app/navigation';
	import { Button, Input, Label } from 'flowbite-svelte';
	let username = '';
	let password = '';

	const handleLogin = async () => {
		await goto('/');
	};
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-500 via-rose-400 to-pink-200"
>
	<form
		class="w-full max-w-md p-8 m-8 space-y-4 rounded-md shadow-md bg-white"
		on:submit|preventDefault={handleLogin}
	>
		<h2 class="text-2xl font-semibold text-center text-gray-700">Login</h2>
		<div class="space-y-2">
			<Label for="username">Username</Label>
			<Input id="username" type="text" bind:value={username} placeholder="Enter your username" />
		</div>
		<div class="space-y-2">
			<Label for="password">Password</Label>
			<Input
				id="password"
				type="password"
				bind:value={password}
				placeholder="Enter your password"
			/>
		</div>
		<div class="pt-4 flex flex-col items-center">
			<Button variant="primary" block outline type="submit">Login</Button>
		</div>
	</form>
</div>
