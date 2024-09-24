<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import { Button, Input, Modal, Toggle, Avatar } from 'flowbite-svelte';
	import { UsersGroupOutline } from 'flowbite-svelte-icons';
	import { supabase } from '$lib/supabaseClient.js';

	export let open = false;
	export let title = 'Thread';
	export let current_user: Tables<'users'> | null = null;
	export let users: Tables<'users'>[];
	export let thread: Tables<'threads'> = { id: '', name: '', created_at: '', description: '' };
	export let user_threads: Tables<'user_thread'>[];
	// export let name: string = '';
	export let everyone: boolean = false;

	let chosen_user_threads: Tables<'user_thread'>[] = [];

	if (current_user) {
		users = users.filter((user) => user.id !== current_user.id);

		user_threads = user_threads.filter((user_thread) => user_thread.user_id !== current_user.id);
	}
	if (thread.id) {
		chosen_user_threads = user_threads.filter((user_thread) => user_thread.thread_id === thread.id);
	}

	function handleChange(user_id: string, state: boolean) {
		const existingRelation = user_threads.find(
			(relation) => relation.user_id === user_id && relation.thread_id === thread.id
		);

		if (state) {
			const new_user_thread: Tables<'user_thread'> = {
				user_id,
				thread_id: thread.id,
				notifications_enabled: true,
				last_modified: new Date().toISOString()
			};
			if (!existingRelation) user_threads = [...user_threads, new_user_thread];

			chosen_user_threads.push(new_user_thread);
		} else {
			if (existingRelation) {
				user_threads = user_threads.filter(
					(relation) => relation.user_id !== user_id || relation.thread_id !== thread.id
				);
			}
			chosen_user_threads = chosen_user_threads.filter(
				(relation) => relation.user_id !== user_id || relation.thread_id !== thread.id
			);
		}
	}
	async function handleOnClick() {
		// Create new thread
		if (!thread.id && current_user) {
			const { data } = await supabase
				.from('threads')
				.insert({ name: thread.name, description: thread.description })
				.select();
			const new_thread = data[0];
			console.log(new_thread);

			if (everyone) {
				for (const user of users) {
					chosen_user_threads.push({
						user_id: user.id,
						thread_id: new_thread.id,
						notifications_enabled: true,
						last_modified: new Date().toISOString()
					});
				}
			}

			chosen_user_threads.push({
				user_id: current_user.id,
				thread_id: new_thread.id,
				notifications_enabled: true,
				last_modified: new Date().toISOString()
			});
			console.log(chosen_user_threads);

			for (const user_thread of chosen_user_threads) {
				await supabase.from('user_thread').insert(user_thread);
			}
		}
	}
</script>

<Modal {title} bind:open autoclose>
	<Input bind:value={thread.name} placeholder="Name of the thread" />
	<Input bind:value={thread.description} placeholder="Write a description if you want to" />
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
						user_threads.some(
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
		<Button on:click={handleOnClick}>Accept</Button>
		<Button color="alternative">Cancel</Button>
	</svelte:fragment>
</Modal>
