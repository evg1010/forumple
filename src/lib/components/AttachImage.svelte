<script lang="ts">
	import { Button, Modal, Textarea, Label } from 'flowbite-svelte';
	import { PaperClipOutline } from 'flowbite-svelte-icons';

	let openModal = false;
	let file: File | null = null;
	let previewUrl: string | null = null;

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

	<Textarea placeholder="Write your message ..." />
	<svelte:fragment slot="footer">
		<Button on:click={() => alert('Handle "success"')}>Send</Button>
		<Button color="alternative">Cancel</Button>
	</svelte:fragment>
</Modal>
