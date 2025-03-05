<script>
	import { onMount } from 'svelte';
	import Loading from '../../../components/Loading.svelte';
	import { slide } from 'svelte/transition';

	import { Award, Icon, Medal, Sparkles, Star, Trophy } from 'lucide-svelte';

	let { data, form } = $props();

	// Reactive state
	let tab = $state('all');
	let isLoading = $state(true);

	let members = $state(
		data.members
			.filter((m) => m.name && m.username) // Filter valid members
			.sort((a, b) => b.points - a.points || b.Project.length - a.Project.length)
			.slice(0, 10)
	);

	let projects = $state(
		data.projects
			.map((p) => ({
				...p,
				rating: p.rating?.length
					? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length).toFixed(1)
					: 'N/A'
			}))
			.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
			.slice(0, 10)
	);

	// Tab management
	const handleHashChange = () => {
		const validTabs = ['all', 'projects', 'members'];
		const newTab = location.hash.replace('#', '');
		tab = validTabs.includes(newTab) ? newTab : 'all';
	};

	const fetchLeaderBoard = async () => {
		const response = await fetch('/community/api/getLeaderBoard', {
			method: 'GET'
		});
		const res = await response.json();
		if (res.success) {
			members = res.members
				.filter((m) => m.name && m.username) // Filter valid members
				.sort((a, b) => b.points - a.points || b.Project.length - a.Project.length)
				.slice(0, 10);
			projects = res.projects
				.map((p) => ({
					...p,
					rating: p.rating?.length
						? (p.rating.reduce((sum, r) => sum + r.rating, 0) / p.rating.length).toFixed(1)
						: 'N/A'
				}))
				.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
				.slice(0, 10);
		}
	};



	onMount(async () => {
		window.addEventListener('hashchange', handleHashChange);
		handleHashChange();
		isLoading = false;


		// Initial fetch
		fetchLeaderBoard();

		// Set up polling every 30 seconds
		const interval = setInterval(fetchLeaderBoard, 30000);

		// Clear interval on component unmount

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
			clearInterval(interval);
		};

	});
</script>

<title>LeaderBoard | NWU Vaal GKSS</title>

<div class="overflow-hidden rounded-lg bg-white shadow-xl">
	<header class=" flex flex-col items-center justify-between p-6 py-1">
		<nav aria-label="Leaderboard categories" class="mt-3 flex flex-wrap items-center gap-2">
			{#each [{ id: 'all', label: 'All' }, { id: 'projects', label: 'Projects' }, { id: 'members', label: 'Members' }] as btn}
				<a
					href="#{btn.id}"
					class="rounded px-3 py-1 transition-colors"
					class:bg-primary={tab === btn.id}
					class:text-white={tab === btn.id}
					class:bg-gray-100={tab !== btn.id}
					class:text-gray-700={tab !== btn.id}
					aria-current={tab === btn.id ? 'page' : undefined}
				>
					{btn.label}
				</a>
			{/each}
		</nav>
	</header>

	{#if isLoading}
		<div class="p-8">
			<Loading />
		</div>
	{:else}
		<main class="max-h-screen space-y-8 overflow-auto px-6">
			{#if ['all', 'members'].includes(tab)}
				<section aria-labelledby="members-heading" class="p-4 md:p-8">
					<!-- Enhanced Title Section -->
					<div class="mb-8 text-center md:mb-12">
						<div class="inline-block rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 p-1">
							<div
								class="flex items-center gap-3 rounded-xl bg-base-100 px-6 py-4 md:gap-4 md:px-8 md:py-5"
							>
								<Trophy
									name="trophy"
									class=" h-8 w-8 animate-bounce  text-amber-500 md:h-10 md:w-10"
									style="animation-duration: 2s;"
								/>
								<h2
									id="members-heading"
									class="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-4xl"
								>
									ELITE LEADERBOARD
								</h2>
							</div>
						</div>
						<p class="mt-4 text-sm text-gray-500 md:text-base">
							Celebrating our top contributors this month
						</p>
					</div>

					<!-- Responsive Table Section -->
					<div class="overflow-x-auto rounded-box shadow-lg">
						<table class="table table-lg">
							<thead class="bg-base-200">
								<tr>
									<th class="text-xs md:text-sm">Rank</th>
									<th class="text-xs md:text-sm">Member</th>

									<th class="flex items-center text-xs md:text-sm">
										<Star class="mr-1 hidden h-4 w-4 md:inline-block" />
										<span class="md:hidden">⭐</span> Points
									</th>
								</tr>
							</thead>
							<tbody>
								{#each members as member, index}
									<tr

										class="group cursor-pointer transition-all duration-300 hover:bg-gray-100"
										onclick={() => (window.location = `/community/${member.username}`)}
										transition:slide={{ delay: index * 50 }}

									>
										<!-- Rank Column -->
										<td class="font-bold">
											<div class="flex items-center gap-2">
												{#if index == 0}
													<Trophy
														class="h-5 w-5 {['text-amber-400', 'text-slate-400', 'text-amber-600'][
															index
														]}"
													/>
												{:else if index == 1}
													<Medal
														class="h-5 w-5 {['text-amber-400', 'text-slate-400', 'text-amber-600'][
															index
														]}"
													/>
												{:else if index == 2}
													<Award
														class="h-5 w-5 {['text-amber-400', 'text-slate-400', 'text-amber-600'][
															index
														]}"
													/>
												{:else}
													<span class="text-gray-400">#</span>
												{/if}
												<span class="md:text-md text-sm">{index + 1}</span>
											</div>
										</td>

										<!-- Member Column -->
										<td>
											<div class="flex items-center gap-3">
												<div class="avatar">
													<div class="mask mask-circle h-8 w-8 md:h-10 md:w-10">
														<img
															src={member.image || '/default-avatar.png'}
															alt={`${member.name}'s avatar`}
															class="transition-transform group-hover:scale-110"
														/>
													</div>
												</div>
												<div>
													<p class="text-sm font-semibold md:text-base">
														{member.name}
														{member.surname}
													</p>
													<p class="text-xs text-gray-500 md:text-sm">@{member.username}</p>
												</div>
											</div>
										</td>

										<!-- Responsive Columns -->

										<td>
											<div class="badge badge-primary badge-lg gap-2 font-bold">
												<Sparkles class="h-4 w-4" />
												<span class="text-sm md:text-base">{member.points}</span>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>
			{/if}

			{#if ['all', 'projects'].includes(tab)}
				<section aria-labelledby="projects-heading">
					<h2 id="projects-heading" class="mb-4 text-xl font-semibold text-gray-800">
						Top 10 Projects
					</h2>
					<div class="overflow-x-auto">
						<table class="w-full shadow-xl">
							<thead class="bg-gray-100">
								<tr>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Rank</th
									>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Project</th
									>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Rating</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each projects as project, index}
									<tr
										onclick={() => (window.location = `/community/tools/${project.id}`)}
										class="cursor-pointer transition-colors hover:bg-gray-50"
									>
										<td class="px-4 py-3 font-medium text-gray-900">{index + 1}</td>
										<td class="flex items-center gap-3 px-4 py-3">
											<div>
												<div class="font-medium">{project.name}</div>
												<div class="line-clamp-2 text-sm text-gray-500">{project.description}</div>
											</div>
										</td>

										<td class="px-4 py-3 font-semibold">
											{#if project.rating !== 'N/A'}
												{project.rating}/5.0
											{:else}
												<span class="text-gray-400">No ratings</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>
			{/if}
		</main>
	{/if}
</div>
