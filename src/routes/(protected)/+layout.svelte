<script>
	import {
		Dropdown,
		DropdownDivider,
		DropdownItem,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
</script>

<Navbar>
	<NavBrand href="/">
		<span
			class="p-4 self-center whitespace-nowrap text-2xl text-rose-700 font-semibold dark:text-white"
			>Forumple</span
		>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi class="cursor-pointer">
			Profile<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white inline" />
		</NavLi>
		<Dropdown class="w-44 z-20">
			<DropdownItem href="/settings">Settings</DropdownItem>
			<DropdownDivider />
			<DropdownItem href="/">Sign out</DropdownItem>
		</Dropdown>
	</NavUl>
</Navbar>

<slot />
