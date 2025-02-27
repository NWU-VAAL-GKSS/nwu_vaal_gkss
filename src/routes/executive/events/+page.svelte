<script>
	import {
		ArrowUpRightFromSquareIcon,
		Edit,
		Eye,
		Pencil,
		PlusCircle,
		Trash,
		Trash2,
		X
	} from 'lucide-svelte';
	import moment from 'moment';

	let array = [];
	let { data, form } = $props();
	let events = $state(data.events);
	let editData = $state({
		topic: '',
		description: '',
		venue: '',
		date: '',
		public: true,
		needs_groups: false,
		is_external: false,
		external_link: ''
	});
	let isEditing = $state(false);

	const handleDelete = (id) => {
		if (
			confirm(
				`Click Ok to confirm to delete "${events.filter((event) => event.id == id)[0].topic}""`
			)
		) {
			const data = new FormData();
			data.append('id', id);
			fetch('?/deleteEvent', {
				method: 'POST',
				body: data
			});
			// Remove the deleted event from state
			events = events.filter((event) => event.id !== id);
		}
	};
	const showEdit = (id) => {
		isEditing = true;
		editData = events.filter((event) => event.id == id)[0];
		my_modal_1.showModal();
	};
	const handleEdit = async () => {
		const res = await fetch('/executive/api/editEvent', {
			method: 'POST',
			body: JSON.stringify({ editData }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const response = await res.json();
		if (response.success) {
			my_modal_1.close();
			editData = { topic: '', description: '', venue: '', date: '', public: '' };
			isEditing = false;
		} else {
			alert('Unexpected error');
			isEditing = false;
		}
	};
</script>

<div class="overflow-hidden rounded-lg shadow-xl">
	<div class="mb-8 flex items-center justify-between p-6">
		<h2 class="text-3xl font-semibold text-gray-800">Event Management</h2>
		<button
			class="btn btn-primary flex items-center space-x-2"
			onclick={() => my_modal_1.showModal()}
		>
			<PlusCircle class="mr-2" /> <span>Create Event</span>
		</button>
	</div>

	<div class="overflow-x-auto px-6 pb-6">
		<table class="w-full border-separate border-spacing-0 text-left shadow-lg">
			<caption class="sr-only">List of upcoming events</caption>
			<thead class="bg-gray-50">
				<tr>
					<th
						class="rounded-tl-lg px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700"
						>Event</th
					>
					<th
						class="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700 lg:table-cell"
						>Description</th
					>
					<th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700"
						>Date & Time</th
					>
					<th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700"
						>Venue</th
					>
					<th
						class="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700 lg:table-cell"
						>Type</th
					>
					<th
						class="rounded-tr-lg px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each events as event}
					<tr class="transition-colors even:bg-gray-50 hover:bg-gray-100">
						<td class="px-4 py-4 text-base font-medium text-gray-900">
							<a
								href={`/executive/events/${event.id}`}
								class="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{event.topic}
							</a>
						</td>
						<td
							class="hidden max-w-[300px] truncate px-4 py-4 text-base text-gray-600 lg:table-cell"
						>
							{event.description}
						</td>
						<td class="px-4 py-4 text-base text-gray-600">
							<span class="whitespace-nowrap">{moment(event.date).format('MMM D, YYYY')}</span>
							<span class="block text-sm text-gray-500">{moment(event.date).format('h:mm A')}</span>
						</td>
						<td class="px-4 py-4 text-base text-gray-600">{event.venue}</td>
						<td class="hidden px-4 py-4 lg:table-cell">
							<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
								{event.public ? 'Public' : 'Private'}
							</span>
						</td>
						<td class="px-4 py-4 text-base text-gray-600">
							<div class="flex items-center justify-end space-x-2">
								<a
									href={`/executive/events/${event.id}`}
									class="rounded-md p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<span class="sr-only">View</span>
									<Eye class="h-5 w-5" />
								</a>
								<button
									onclick={() => showEdit(event.id)}
									class="rounded-md p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<span class="sr-only">Edit</span>
									<Pencil class="h-5 w-5" />
								</button>
								<button
									onclick={() => handleDelete(event.id)}
									class="rounded-md p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
								>
									<span class="sr-only">Delete</span>
									<Trash class="h-5 w-5" />
								</button>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-4 py-6 text-center text-gray-500">No events found</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<!--CREATE/EDIT EVENT MODAL-->
<dialog id="my_modal_1" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold">Create an Event</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn text-white"><X /> Close</button>
				</form>
			</div>
		</div>

		<p class="py-4 text-sm">Enter the required details to create an event</p>
		<form method="post" action="?/addEvent" class="flex w-full flex-col gap-5">
			<label class="form-control w-full">
				<p>Topic</p>
				<input
					type="text"
					name="topic"
					class="input input-bordered"
					id="topic"
					placeholder="The name of the event"
					bind:value={editData.topic}
				/>
			</label>
			<label class="form-control w-full">
				<p>Venue</p>
				<input
					type="text"
					name="venue"
					class="input input-bordered"
					id="venu"
					placeholder="The name of the venue."
					bind:value={editData.venue}
				/>
			</label>
			<label class="label cursor-pointer">
				<span class="form-control">Make event public</span>
				<input
					bind:checked={editData.public}
					type="checkbox"
					name="public"
					class="toggle toggle-primary"
				/>
			</label>
			<label class="label cursor-pointer">
				<span class="form-control">Requires groups?</span>
				<input
					bind:checked={editData.needs_groups}
					type="checkbox"
					name="needs_groups"
					class="toggle toggle-primary"
				/>
			</label>
			<label class="label cursor-pointer">
				<span class="form-control">External Event?</span>
				<input
					bind:checked={editData.is_external}
					type="checkbox"
					name="is_external"
					class="toggle toggle-primary"
				/>
			</label>
			{#if editData.is_external}
				<label class="form-control w-full">
					<p>External link</p>
					<input
						type="url"
						name="external_link"
						class="input input-bordered"
						id="external_link"
						placeholder="Provide the link for registration"
						bind:value={editData.external_link}
						required
					/>
				</label>
			{/if}
			<label class="form-control w-full">
				<p>Date and Time</p>
				<input
					bind:value={editData.date}
					type="datetime-local"
					name="date"
					class="input input-bordered"
					id="date"
				/>
			</label>
			<label class="form-control hidden w-full">
				<p>Poster</p>
				<input
					type="file"
					name="image"
					class="file-input file-input-bordered w-full"
					accept="image/*"
					id="image"
				/>
			</label>
			<label class="form-control w-full">
				<p>Description</p>
				<textarea
					bind:value={editData.description}
					name="description"
					class="textarea textarea-bordered"
					id="description"
					placeholder="What is the event about?"
				></textarea>
			</label>
			{#if isEditing}
				<button type="button" onclick={handleEdit} class="btn btn-primary text-white">Edit</button>
			{:else}
				<button type="submit" class="btn btn-primary text-white">Create</button>
			{/if}
		</form>
	</div>
</dialog>

<style>
	table,
	td,
	tr,
	th,
	h1,
	h2,
	h3 {
		@apply text-black;
	}
	/* Add hover effects for action buttons */
	.btn-ghost:hover {
		@apply bg-gray-200;
	}
	/* Adjust cursor and mobile responsiveness */
	overflow-x-auto {
		@apply max-w-full;
	}
	/* Improve padding for better readability */
	th,
	td {
		@apply px-6 py-4;
	}
	/* Making sure the modal box is centered and not too wide */
	.modal-box {
		@apply mx-auto max-w-lg;
	}
</style>
