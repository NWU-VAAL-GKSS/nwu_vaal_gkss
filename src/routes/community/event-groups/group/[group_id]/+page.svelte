<script>
	import { onMount } from 'svelte';
	import Loading from '../../../../../components/Loading.svelte';

	let { data } = $props();
	console.log(data.group);
	let group = $state(data.group[0]);
	let group_id = $state();
	let isSubmitting = $state(false);
	let isMember = $state(false);

	onMount(() => {
		group_id = location.pathname.split('/').pop();
		isMember = group.event_group_member.some(
			(member) => member.Member.username == data.currentUser.username
		);
	});
	const joinTeam = async () => {
		isSubmitting = true;
		const response = await fetch('/community/api/joinGroup', {
			method: 'POST',
			body: JSON.stringify({ group_id })
		});
		const result = await response.json();
		if (result.success) {
			isMember = true;
		}
		isSubmitting = false;
	};
</script>

<title>{group ? `${group.name} | NWU Vaal GKSS` : 'Group | NWU Vaal GKSS'}</title>

{#if !group_id}
	<div class="flex min-h-screen items-center justify-center">
		<Loading size="lg" />
	</div>
{:else}
	<div class="mx-auto min-h-screen max-w-4xl p-6">
		<div class="mb-8">
			<button
				onclick={() => history.back()}
				class="hover:text-primary-dark mb-4 flex items-center text-primary"
			>
				← Back to Groups
			</button>
			<h1 class="mb-2 text-4xl font-bold text-gray-800">{group.name}</h1>
			<div class="flex items-center text-gray-600">
				<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
					/>
				</svg>
				<span
					>{group.event_group_member.length}
					{group.event_group_member.length === 1 ? 'Member' : 'Members'}</span
				>
			</div>
		</div>

		{#if group.event_group_member.length > 0}
			<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each group.event_group_member as member}
					<div class="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
						<div class="flex items-center">
							<div
								class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
							>
								{member.Member.name[0]}{member.Member.surname[0]}
							</div>
							<div>
								<p class="font-semibold text-gray-800">
									{member.Member.name}
									{member.Member.surname}
								</p>
								<p class="text-sm text-gray-600">Member</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="mb-8 rounded-lg bg-gray-50 p-8 text-center">
				<p class="italic text-gray-600">No members yet. Be the first to join!</p>
			</div>
		{/if}

		<div class="border-t pt-8 text-center">
			{#if isMember}
				<div class="inline-flex items-center rounded-full bg-green-100 px-6 py-3 text-green-700">
					<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					You're part of this team!
				</div>
			{:else}
				<button
					onclick={joinTeam}
					class="hover:bg-primary-dark transform rounded-full bg-primary px-8 py-3 font-semibold
                 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl
                 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<Loading size="sm" light />
					{:else}
						<div class="flex items-center">
							<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
									clip-rule="evenodd"
								/>
							</svg>
							Join This Team
						</div>
					{/if}
				</button>
			{/if}
		</div>
	</div>
{/if}
