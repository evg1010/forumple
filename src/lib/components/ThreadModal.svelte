<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { Button, Input, Modal, Toggle, Avatar } from 'flowbite-svelte';
	import { UsersGroupOutline } from 'flowbite-svelte-icons';
	export let open = false;
	export let title = 'Thread';
	export let users: Tables<'users'>[];
	export let thread: Tables<'threads'>;
	export let user_thread: Tables<'user_thread'>[];
	export let name: string = '';
	export let everyone: boolean = false;

	function handleChange(user_id: string, state: boolean) {
		if (!thread) {
			thread = {
				id: '',
				name: '',
				created_at: '',
				description: ''
			};
		}

		const existingRelation = user_thread.find(
			(relation) => relation.user_id === user_id && relation.thread_id === thread.id
		);

		if (state) {
			if (!existingRelation) {
				user_thread = [
					...user_thread,
					{ user_id, thread_id: thread.id, notifications_enabled: true }
				];
			}
		} else {
			if (existingRelation) {
				user_thread = user_thread.filter(
					(relation) => relation.user_id !== user_id || relation.thread_id !== thread.id
				);
			}
		}
	}
</script>

<Modal {title} bind:open autoclose>
	<Input bind:value={name} placeholder="Name of the thread" />
	<div class="flex flex-col gap-3 w-full bg-gray-100 rounded-lg p-4">
		<div class="flex justify-between items-center">
			<div class="flex gap-2 items-center pl-1">
				<UsersGroupOutline class="w-6 h-6" />
				<span>Everyone</span>
			</div>
			<Toggle bind:checked={everyone} />
		</div>
		<hr class="border-gray-300" />
		{#each users as user}
			<div class="flex justify-between items-center">
				<div class="flex gap-2 items-center">
					<Avatar src={user.avatar_url ?? undefined} />
					<span>{user.name}</span>
				</div>
				<Toggle
					checked={everyone ||
						user_thread.some(
							(relation) => relation.user_id === user.id && relation.thread_id === thread.id
						)}
					value={user.id}
					on:change={(e) =>
						handleChange(
							user.id,
							// @ts-expect-error
							e.target.checked
						)}
					disabled={everyone}
				/>
			</div>
		{/each}
	</div>
	<svelte:fragment slot="footer">
		<Button on:click={() => alert('Handle "success"')}>Accept</Button>
		<Button color="alternative">Cancel</Button>
	</svelte:fragment>
</Modal>
