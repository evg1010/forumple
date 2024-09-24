<script lang="ts">
	import { deserialize } from '$app/forms';
	import { Button, Modal, Textarea } from 'flowbite-svelte';
	import { PaperClipOutline } from 'flowbite-svelte-icons';

	let openModal = false;
	let file: File | null = null;
	let previewUrl: string | null = null;
	let content: string = '';

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			file = input.files[0];
			previewUrl = URL.createObjectURL(file);
			openModal = true;
		}
	}

	function triggerFileInput() {
		document.getElementById('file-upload')?.click();
	}

	async function handleUpload() {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		try {
			const uploadResponse = await fetch(`?/upload_image`, {
				method: 'POST',
				body: formData
			});

			if (!uploadResponse.ok) {
				throw new Error(`HTTP error! status: ${uploadResponse.status}`);
			}

			const { data } = deserialize(await uploadResponse.text());
			console.log(data);

			const image_url = data.image_url;
			console.log('IMAGE: ', image_url);

			if (image_url) {
				const messageResponse = await fetch(`?/createMessage`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						content: content,
						image_url: image_url
					}).toString()
				});

				if (!messageResponse.ok) {
					throw new Error(`HTTP error! status: ${messageResponse.status}`);
				}

				// Handle successful message creation here if needed
				console.log('Message created successfully');
			}
		} catch (error) {
			console.error('An error occurred:', error);
			// Handle the error appropriately (e.g., show an error message to the user)
		}
	}
</script>

<Button on:click={triggerFileInput} class="!p-2" pill={true} color="alternative">
	<PaperClipOutline />
	<input
		id="file-upload"
		type="file"
		accept="image/*"
		class="hidden"
		on:change={handleFileSelect}
		multiple={false}
	/>
</Button>
<Modal title="Send Image" bind:open={openModal} autoclose class="w-3/4">
	<div class="bg-gray-300 rounded-lg flex justify-center">
		<img src={previewUrl} alt="to share" />
	</div>

	<Textarea bind:value={content} placeholder="Write your message ..." />
	<svelte:fragment slot="footer">
		<Button on:click={handleUpload}>Send</Button>
		<Button color="alternative">Cancel</Button>
	</svelte:fragment>
</Modal>
