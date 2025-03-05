<script>
	import { ChartNoAxesColumn, CodeXml, Mail, PenBox, Star, Stars, Trash } from 'lucide-svelte';
	import NotFoundPage from '../../../components/NotFoundPage.svelte';
	import Topic from '../../../components/Topic.svelte';
	import Project from '../../../components/Project.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let myProfile = $state(false);
	let username = $state('');

	onMount(() => {
		myProfile = location.pathname.includes('profile');
		username = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
	});

	let topics = $state(data.topics);

	const deleteTopic = async (topic, index) => {
		if (confirm("Delete topic: '" + topic.topic + "'?")) {
			const formData = new FormData();
			formData.append('id', topic.id);
			await fetch('/community?/deleteTopic', {
				method: 'POST',
				body: formData
			});
			topics.splice(index, 1);
		}
	};
</script>

{#if data.notFound}
	<NotFoundPage
		title="User not found"
		homeUrl="/community"
		message={`Sorry, this user '@${username}' does not exist, please try again later or return to home`}
	/>
{:else}
	<title>{data.fullName} | NWU Vaal GKSS</title>
	<meta property="og:site_name" content={`${data.fullName} | NWU Vaal GKSS`} />
	<meta name="twitter:title" content={`${data.fullName} | NWU Vaal GKSS`} />
	<meta name="twitter:image:alt" content={`${data.fullName} | NWU Vaal GKSS`} />
	<meta property="title" content="User profile" />

	<div class="min-h-screen pb-8">
		<!-- Profile Header -->
		<div class="flex flex-col items-center gap-8 px-4 py-6 lg:flex-row lg:items-start lg:px-8">
			<!-- Profile Image -->
			<div class="flex flex-col items-center space-y-3 text-center">
				<img
					src={data.image}
					alt={data.username}
					class="h-40 w-40 rounded-full border-4 border-white shadow-lg"
				/>
				<div class="space-y-1">
					{#if !data.fullName.includes('null')}
						<h1 class="text-2xl font-bold text-gray-800">{data.fullName}</h1>
					{/if}
					<h2 class="text-lg text-gray-600">@{data.username}</h2>
				</div>
			</div>

			<!-- Stats Card -->
			<div class="w-full max-w-2xl space-y-6 rounded-xl border bg-white p-6 shadow-sm">
				<h2 class="text-xl font-semibold text-gray-800">Contribution Overview</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<!-- Topics Created -->
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div>
							<p class="text-sm font-medium text-gray-500">Topics Created</p>
							<p class="text-2xl font-bold text-gray-800">{data.topics.length}</p>
						</div>
						<PenBox class="h-8 w-8 text-primary" />
					</div>

					<!-- Total Views -->
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div>
							<p class="text-sm font-medium text-gray-500">Total Views</p>
							<p class="text-2xl font-bold text-gray-800">{data.user_views}</p>
						</div>
						<ChartNoAxesColumn class="h-8 w-8 text-primary" />
					</div>

					<!-- Projects -->
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div>
							<p class="text-sm font-medium text-gray-500">Total Projects</p>
							<p class="text-2xl font-bold text-gray-800">{data.projects.length}</p>
						</div>
						<CodeXml class="h-8 w-8 text-primary" />
					</div>

					<!-- Ratings -->
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div>
							<p class="text-sm font-medium text-gray-500">Total Points</p>
							<p class="text-2xl font-bold text-gray-800">{data.points.toFixed(0) || 0.0} pts</p>
						</div>
						<Stars class="h-8 w-8 text-primary" />
					</div>
				</div>
			</div>
		</div>

		<!-- Content Tabs -->
		<div class="px-4 lg:px-8">
			<div role="tablist" class="tabs-boxed tabs bg-gray-100 p-2">
				<input
					type="radio"
					name="my_tabs_2"
					role="tab"
					aria-label="Topics"
					checked="checked"
					class="tab font-medium text-gray-500 [--tab-bg:transparent] aria-selected:bg-primary aria-selected:text-white"
				/>
				<div role="tabpanel" class="tab-content mt-4 space-y-4">
					{#each topics as topic, index}
						<Topic {topic} {myProfile} {deleteTopic} {index} />
					{:else}
						<div class="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
							No topics created yet
						</div>
					{/each}
				</div>

				<input
					type="radio"
					name="my_tabs_2"
					role="tab"
					aria-label="Projects"
					class="tab font-medium text-gray-500 [--tab-bg:transparent] aria-selected:bg-primary aria-selected:text-white"
				/>
				<div role="tabpanel" class="tab-content mt-4">
					<section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
						<ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{#each data.projects as project}
								<Project {project} />
							{:else}
								<div class="col-span-full rounded-lg bg-gray-50 p-6 text-center text-gray-500">
									No projects submitted yet
								</div>
							{/each}
						</ul>
					</section>
				</div>
			</div>
		</div>
	</div>
{/if}
