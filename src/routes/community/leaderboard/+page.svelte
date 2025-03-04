<script>
	import { onMount } from 'svelte';
	import Loading from '../../../components/Loading.svelte';
	import { slide } from 'svelte/transition';

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

	onMount(async () => {
		window.addEventListener('hashchange', handleHashChange);
		handleHashChange();
		isLoading = false;
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

		return () => window.removeEventListener('hashchange', handleHashChange);
	});
</script>

<title>LeaderBoard | NWU Vaal GKSS</title>

<div class="overflow-hidden rounded-lg bg-white shadow-xl">
	<header class="mb-8 flex flex-col items-center justify-between p-6">
		<h1 class="text-3xl font-semibold text-gray-800">LeaderBoard</h1>
		<nav aria-label="Leaderboard categories" class="mt-3 flex flex-wrap gap-2">
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
		<main class="max-h-screen space-y-8 overflow-auto px-6 pb-6">
			{#if ['all', 'members'].includes(tab)}
				<section aria-labelledby="members-heading">
					<h2 id="members-heading" class="mb-4 text-xl font-semibold text-gray-800">
						Top 10 Members
					</h2>
					<div class="overflow-x-auto">
						<table class="w-full shadow-xl">
							<thead class="bg-gray-100">
								<tr>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Rank</th
									>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Member</th
									>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Topics</th
									>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Projects</th
									>
									<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
										>Points</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each members as member, index}
									<tr
										transition:slide
										on:click={() => (window.location = `/community/${member.username}`)}
										class="cursor-pointer transition-colors hover:bg-gray-50"
									>
										<td class="px-4 py-3 font-medium text-gray-900">{index + 1}</td>
										<td class="flex items-center gap-3 px-4 py-3">
											<img
												class="h-8 w-8 rounded-full object-cover"
												src={member.image || '/default-avatar.png'}
												alt={`${member.name}'s profile picture`}
											/>
											<span>{member.name} {member.surname}</span>
										</td>
										<td class="px-4 py-3">{member.Topic.length}</td>
										<td class="px-4 py-3">{member.Project.length}</td>
										<td class="px-4 py-3 font-semibold">{member.points}</td>
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
										on:click={() => (window.location = `/community/tools/${project.id}`)}
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
