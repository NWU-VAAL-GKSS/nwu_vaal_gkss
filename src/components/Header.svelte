<script>
	let { isLoggedIn, isExecutive, user } = $props();
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

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
	class="navbar fixed top-0 z-50 flex w-screen items-center justify-between bg-base-200/95 shadow-lg backdrop-blur"
>
	<a href="/"><img src="/logo.png" alt="logo" class="ml-5 h-[60px] w-[80px]" /></a>
	{#if !$page.url.pathname.includes('/executive')}
		<nav class="mr-5 hidden items-center space-x-5 lg:flex">
			<a
				href="/"
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={$page.url.pathname === '/'}>Home</a
			>
			<a
				href="/about"
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={$page.url.pathname === '/about'}>About</a
			>

			<a
				href="/gallery"
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={currentPath === '/gallery'}>Gallery</a
			>

			<a
				href="/events"
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={$page.url.pathname.includes('/events')}>Events</a
			>
			<a
				href="/geekOfTheWeek"
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={$page.url.pathname === '/geekOfTheWeek'}>Geek Of The Week</a
			>
			<a
				href="/community"
				class="navItem border-red-500 hover:border-b hover:text-white"
				class:selected={$page.url.pathname.includes('/community')}>Community</a
			>
			{#if isLoggedIn}
				<a
					href="/dashboard"
					class="navItem btn-bordered btn border-red-500 hover:border-b hover:text-white"
					class:selected={$page.url.pathname === '/dashboard'}>Dashboard</a
				>
				{#if isExecutive}
					<a
						href="/executive"
						class="navItem btn btn-primary border-red-500 hover:border-b hover:text-white">Admin</a
					>
				{/if}
			{:else}
				<a
					href="/team"
					class="navItem border-red-500 hover:border-b hover:text-white"
					class:selected={$page.url.pathname === '/team'}>The team</a
				>
				<a
					href="/#contact"
					class="navItem border-red-500 hover:border-b hover:text-white"
					class:selected={$page.url.pathname === '/#contact'}>Contact Us</a
				>
				{#if $page.url.pathname != '/login'}
					<a
						href="/login"
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
			{#if !$page.url.pathname.includes('/executive')}
				<li>
					<a href="/" class="navItem text-lg" class:selected={$page.url.pathname === '/'}>Home</a>
				</li>
				<li>
					<a href="/about" class="navItem text-lg" class:selected={$page.url.pathname === '/about'}
						>About</a
					>
				</li>

				<li>
					<a
						href="/gallery"
						data-sveltekit-reload
						class="navItem text-lg"
						class:selected={currentPath === '/gallery'}>Gallery</a
					>
				</li>

				<li>
					<a
						href="/events"
						class="navItem text-lg"
						class:selected={$page.url.pathname.includes('/events')}>Events</a
					>
				</li>
				<li>
					<a
						href="/geekOfTheWeek"
						class="navItem text-lg"
						class:selected={$page.url.pathname === '/geekOfTheWeek'}>Geek Of The Week</a
					>
				</li>
				<li>
					<a
						href="/community"
						class="navItem text-lg"
						class:selected={$page.url.pathname.includes('/community')}>Community</a
					>
				</li>
				<li>
					<a href="/team" class="navItem text-lg" class:selected={$page.url.pathname === '/team'}
						>The team</a
					>
				</li>
				{#if isLoggedIn}
					<a
						href="/dashboard"
						class="navItem btn-bordered btn my-2 border-red-500 hover:border-b hover:text-white"
						class:selected={$page.url.pathname === '/dashboard'}>Dashboard</a
					>
					{#if isExecutive}
						<a
							href="/executive"
							class:selected={$page.url.pathname === '/executive'}
							class="navItem btn btn-primary my-2 border-red-500 hover:border-b hover:text-white"
							>Admin</a
						>
					{/if}
				{:else}
					<li>
						<a
							href="/#contact"
							class="navItem text-lg"
							class:selected={$page.url.pathname === '/#contact'}>Contact Us</a
						>
					</li>
					{#if $page.url.pathname != '/login'}
						<li>
							<a
								href="/login"
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
					<a href="/executive" class:selected={$page.url.pathname === '/executive'}>
						<Home />
						Home
					</a>
				</li>
				<li>
					<a
						class:selected={$page.url.pathname.includes('/executive/events')}
						href="/executive/events"
					>
						<ChartNoAxesColumn />
						Event Management
					</a>
				</li>
				<li>
					<a class:selected={$page.url.pathname === '/executive/team'} href="/executive/team">
						<UserCog />
						Executive Team
					</a>
				</li>
				<li>
					<a
						class:selected={$page.url.pathname === '/executive/membership'}
						href="/executive/membership"
					>
						<Users />
						Members
					</a>
				</li>
				<li>
					<a
						class:selected={$page.url.pathname.includes('/executive/quizzes')}
						href="/executive/quizzes"
					>
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
								<a href="/dashboard">
									<User />
									Dashboard
								</a>
							</li>
							<li>
								<a href="/community">
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
