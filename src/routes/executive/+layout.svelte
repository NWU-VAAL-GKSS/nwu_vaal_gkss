<script>
	import {
		ChartNoAxesColumn,
		FileEdit,
		HeartHandshake,
		Home,
		Link,
		LucideUsers,
		MessageCircleMoreIcon,
		User,
		UserCog,
		Users
	} from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import PwaInstallPrompt from '../../components/PWAInstallPrompt.svelte';

	let { children, data } = $props();
	const currentUser = data.currentUser;
</script>

<title>Executive | NWU Vaal GKSS </title>

<div
	class="flex min-h-screen w-full justify-between bg-gradient-to-b from-white to-gray-200 lg:p-1"
>
	<ul class="menu hidden min-h-[90svh] w-56 rounded-box bg-base-200 lg:flex">
		<li class="menu-title my-2 flex flex-col rounded-box bg-gray-800 p-4 text-white">
			<!-- User Information (Image, Name, Surname) -->
			<div class="flex items-center gap-x-4">
				<img
					src={currentUser.image}
					alt={currentUser.name}
					class="h-[50px] w-[50px] rounded-full"
				/>
				<h2 class="text-lg font-semibold">{currentUser.name} {currentUser.surname}</h2>
			</div>

			<!-- Role below the name and picture -->
			<p class="mt-2 text-sm text-gray-400">{currentUser.role}</p>
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
	</ul>
	<div in:slide={{ x: 100 }} out:slide={{ x: -100 }} class="w-full lg:[width:calc(100%-224px)]">
		{@render children()}
	</div>
</div>
