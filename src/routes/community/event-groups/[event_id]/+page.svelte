<script>
	import { onMount } from 'svelte';
	import Loading from '../../../../components/Loading.svelte';
	import { ArrowLeft, XCircle } from 'lucide-svelte';
	import moment from 'moment';

	let { data } = $props();
	let event = $state(null);
	let groups = $state([]);
	let userGroup = $state();
	let selectedGroup = $state();
	let form = $state({ hasJoinedGroup: false, hasGroupMembers: null });
	let groupForm = $state({ name: `Team GenAI`, is_public: false });
	onMount(async () => {
		const event_id = location.pathname.split('/').pop();
		event = data.events.filter((event) => event.id == event_id).pop();
		const result = await fetch('/community/api/getEventGroups', {
			method: 'POST',
			body: JSON.stringify({ event_id: event.id })
		});
		const res = await result.json();
		groups = res.groups;
		let selectedGroup = groups[0]; //select any
	});

	let isSubmitting = $state(false);
	const createGroup = async (e) => {
		isSubmitting = true;
		e.preventDefault();
		groupForm = { ...groupForm, event_id: event.id };
		const response = await fetch('/community/api/createNewGroup', {
			method: 'POST',
			body: JSON.stringify({ groupForm })
		});
		const result = await response.json();
		console.log(result);
		if (result.success) {
			groups.push(result.group.pop());
		}
		createGroupModal.close();
		isSubmitting = false;
	};
</script>

<title>Event Groups : {event ? event.topic : ''} | NWU Vaal GKSS</title>

<div class="w-full p-5">
	{#if !event}
		<Loading />
	{:else}
		<div class="flex items-center justify-between">
			<h1 class="flex items-center gap-3 space-x-5 text-lg font-bold">
				<button
					class="rounded-full bg-gray-300 p-2 text-lg shadow-md focus:outline-none"
					onclick={() => history.back(-1)}
					aria-label="Go back"
				>
					<ArrowLeft class="h-6 w-6" />
				</button>Group formations
			</h1>

			<button class="btn btn-primary" onclick={() => createGroupModal.show()}
				>Create new Group</button
			>
		</div>

		<div class="my-5">
			<p class=" my-3 font-normal">Event: <b>{event.topic}</b></p>
			<p>Join any of the following groups below or create a new group</p>
			{#if !groups.length}
				<Loading />
			{/if}
			<section class="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
				<ul role="list" class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
					{#each groups as group}
						<li>
							<div
								class="hover:border-primary-300 focus:ring-primary-500 group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md focus:outline-none focus:ring-2"
							>
								<div class="mb-4 flex items-center gap-3 text-sm">
									<p>Created by {group.Member.name} {group.Member.surname}</p>
								</div>

								<div class="flex flex-1 flex-col">
									<h2 class="group-hover:text-primary-600 mb-2 text-xl font-semibold text-gray-900">
										{group.name}
									</h2>
									<p class="my-5">{group.event_group_member.length} members in this group</p>
									<a href={`/community/event-groups/group/${group.id}`} class="btn btn-primary"
										>View</a
									>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</section>
		</div>
	{/if}
</div>

<!-- Create Group Modal-->
<dialog id="createGroupModal" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold text-white">Create a group</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn"><XCircle /></button>
				</form>
			</div>
		</div>
		{#if isSubmitting}
			<Loading />
		{:else}
			<form onsubmit={createGroup} class="flex w-full flex-col gap-5">
				<label class="form-control w-full">
					<p>Name</p>
					<input
						type="text"
						class="input input-bordered"
						name="name"
						id="name"
						placeholder="Create group name"
						required
						bind:value={groupForm.name}
					/>
				</label>
				<label class="label cursor-pointer">
					<span class="form-control">Make group public</span>
					<input
						bind:checked={groupForm.is_public}
						type="checkbox"
						name="public"
						class="toggle toggle-primary"
					/>
				</label>
				<button type="submit" class="btn btn-primary text-white">Submit</button>
			</form>
		{/if}
	</div>
</dialog>
