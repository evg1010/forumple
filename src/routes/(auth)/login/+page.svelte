<script>
	import { Button, Card, Heading } from 'flowbite-svelte';
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { GithubSolid } from 'flowbite-svelte-icons';
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-500 via-rose-400 to-pink-200"
>
	<Card class="max-w-md mx-auto p-8">
		<Heading class="text-3xl font-bold text-center mb-4">Iniciar sesión</Heading>
		<form
			method="post"
			action="/?/signInWithGithub"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'error') {
						toast.error(result.error.message);
					} else {
						await applyAction(result);
					}
				};
			}}
		>
			<Button
				variant="outline"
				type="submit"
				class="w-full py-2 px-4 flex justify-center items-center gap-2"
				><GithubSolid />
				Iniciar sesión con Github
			</Button>
		</form>
	</Card>
</div>
