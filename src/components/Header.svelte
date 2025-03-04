<script>
	let currentPath = $state('');
	let { isLoggedIn, isExecutive, user } = $props();
	import { onMount } from 'svelte';

	onMount(() => {
		currentPath = location.pathname;
	});
	import {
		ChartNoAxesColumn,
		FileEdit,
		HeartHandshake,
		Home,
		Link,
		LogIn,
		Menu,
		MessageCircleMoreIcon,
		PlusCircle,
		Search,
		User,
		UserCog,
		Users
	} from 'lucide-svelte';
</script>

<div
	class="navbar fixed top-0 z-50 flex w-screen items-center justify-between bg-base-200 shadow-lg backdrop-blur"
>
	<a href="/"><img src="/logo_white.png" alt="logo" class="ml-5 h-[20px] w-[150px]" /></a>
	{#if !currentPath.includes('/executive')}
		<nav class="mr-5 hidden items-center space-x-5 lg:flex">
			<a
				href="/"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/'}>Home</a
			>
			<a
				href="/about"
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/about'}>About</a
			>
			<a
				href="/events"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath.includes('/events')}>Events</a
			>
			<a
				href="/geekOfTheWeek"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/geekOfTheWeek'}>Geek Of The Week</a
			>
			<a
				href="/community"
				data-sveltekit-reload
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath.includes('/community')}>Community</a
			>
			{#if isLoggedIn}
				<a
					href="/dashboard"
					data-sveltekit-reload
					class="navItem btn-bordered btn border-red-500 hover:border-b hover:text-white"
					class:selected={currentPath === '/dashboard'}>Dashboard</a
				>
				{#if isExecutive}
					<a
						href="/executive"
						data-sveltekit-reload
						class="navItem btn btn-primary border-red-500 hover:border-b hover:text-white">Admin</a
					>
				{/if}
			{:else}
				<a
					href="/team"
					data-sveltekit-reload
					class="navItem border-red-500 hover:border-b hover:text-white"
					class:selected={currentPath === '/team'}>The team</a
				>
				<a
					href="/#contact"
					data-sveltekit-reload
					class="navItem border-red-500 hover:border-b hover:text-white"
					class:selected={currentPath === '/#contact'}>Contact Us</a
				>
				{#if currentPath != '/login'}
					<a
						href="/login"
						data-sveltekit-reload
						class="navItem btn btn-primary border-red-500 hover:border-b hover:text-white"
					>
						<LogIn />
						Login</a
					>
				{/if}
			{/if}
		</nav>
	{/if}
	<div class="space-x-2 lg:hidden">
		<label for="my-drawer" class="btn drawer-button rounded-full lg:hidden"
			><Menu color="white" /></label
		>
	</div>
</div>

<div class="drawer z-50">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

		<ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<h2 class="text-2xl font-bold text-white">Menu</h2>
			<!-- Sidebar content here -->
			{#if !currentPath.includes('/executive')}
				<li>
					<a
						href="/"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/'}>Home</a
					>
				</li>
				<li>
					<a
						href="/about"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/about'}>About</a
					>
				</li>
				<li>
					<a
						href="/events"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath.includes('/events')}>Events</a
					>
				</li>
				<li>
					<a
						href="/geekOfTheWeek"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/geekOfTheWeek'}>Geek Of The Week</a
					>
				</li>
				<li>
					<a
						href="/community"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath.includes('/community')}>Community</a
					>
				</li>
				<li>
					<a
						href="/team"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/team'}>The team</a
					>
				</li>
				{#if isLoggedIn}
					<a
						href="/dashboard"
						data-sveltekit-reload
						class="navItem btn-bordered btn my-2 border-red-500 hover:border-b hover:text-white"
						class:selected={currentPath === '/dashboard'}>Dashboard</a
					>
					{#if isExecutive}
						<a
							href="/executive"
							data-sveltekit-reload
							class="navItem btn btn-primary my-2 border-red-500 hover:border-b hover:text-white"
							>Admin</a
						>
					{/if}
				{:else}
					<li>
						<a
							href="/#contact"
							data-sveltekit-reload
							class="navItem text-lg"
							class:selected={currentPath === '/#contact'}>Contact Us</a
						>
					</li>
					{#if currentPath != '/login'}
						<li>
							<a
								href="/login"
								data-sveltekit-reload
								class="navItem btn btn-primary my-2 border-red-500 hover:border-b hover:text-white"
							>
								<LogIn />
								Login</a
							>
						</li>
					{/if}
				{/if}
			{:else}
				<li class="menu-title my-2 flex flex-col rounded-box bg-gray-800 p-4 text-white">
					<!-- User Information (Image, Name, Surname) -->
					<div class="flex items-center gap-x-4">
						<img src={user.image} alt={user.surname} class="h-[50px] w-[50px] rounded-full" />
						<h2 class="text-lg font-semibold">{user.name} {user.surname}</h2>
					</div>

					<!-- Role below the name and picture -->
					<p class="mt-2 text-sm text-gray-400">{user.role}</p>
				</li>

				<li>
					<a href="/executive">
						<Home />
						Home
					</a>
				</li>
				<li>
					<a href="/executive/events">
						<ChartNoAxesColumn />
						Event Management
					</a>
				</li>
				<li>
					<a href="/executive/team">
						<UserCog />
						Executive Team
					</a>
				</li>
				<li>
					<a href="/executive/membership">
						<Users />
						Members
					</a>
				</li>
				<li>
					<a href="/executive/quizzes">
						<FileEdit />
						Quizzes
					</a>
				</li>
				<li></li>
				<li>
					<details open>
						<summary><Link />Other links</summary>
						<ul>
							<li>
								<a data-sveltekit-reload href="/dashboard">
									<User />
									Dashboard
								</a>
							</li>
							<li>
								<a data-sveltekit-reload href="/community">
									<MessageCircleMoreIcon />
									Community
								</a>
							</li>
						</ul>
					</details>
				</li>
			{/if}
		</ul>
	</div>
</div>

<style>
	.selected {
		@apply link-primary font-bold;
	}
</style>
