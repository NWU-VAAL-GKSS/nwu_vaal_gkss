<script>
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { LogIn, Medal } from 'lucide-svelte';
	import Loading from '../../../components/Loading.svelte';

	let { data } = $props();
	let event = $state(data.event);

	let registrationCount = $state(event.event_attendee.length);
	let formData = $state({
		name: data.isLoggedIn ? data.currentUser.name + ' ' + data.currentUser.surname : '',
		email: data.isLoggedIn ? data.email : '',
		tickets: 1
	});

	let registrationSuccess = $state(false);
	let registrationError = $state(false);
	let isLoading = $state(false);

	async function submitRegistration(e) {
		isLoading = true;
		e.preventDefault();
		try {
			let event_id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
			const response = await fetch('/executive/api/event-registration', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ event_id })
			});

			const res = await response.json();
			console.log(res);
			if (res.success) {
				registrationCount++;
				registrationSuccess = true;
			}
		} catch (error) {
			registrationError = true;
		}
		isLoading = false;
	}
</script>

<title>{event.topic} | NWU VAAL GKSS</title>
<div class="container mx-auto px-4 py-8">
	<div class="grid gap-8 text-black md:grid-cols-2">
		<!-- Event Details -->
		<div>
			<h1 class="mb-4 text-4xl font-bold">{event.topic}</h1>
			<p class="mb-4 text-gray-600">{event.description}</p>

			<div class="mb-4 rounded-lg bg-gray-100 p-4">
				<div class="mb-2 flex justify-between">
					<span class="font-semibold">Date:</span>
					<span>{moment(event.date).format('LLLL')}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-semibold">Venue:</span>
					<span>{event.venue}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-semibold">Registered Attendees:</span>
					<span>{registrationCount}</span>
				</div>
			</div>
		</div>

		<!-- Registration Form -->
		<div id="register" class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-2xl font-semibold">Register for Event</h2>
			{#if data.isLoggedIn}
				{#if data.alreadyRegistered}
					<p>You have already registered for this event</p>
				{:else}
					{#if registrationError}
						<div class="alert alert-error mb-4">Registration failed. Please try again.</div>
					{/if}
					{#if registrationSuccess}
						<div class="alert alert-success mb-4">
							Registration successful! Thank you for registering, we have awarded you with +35
							points<Medal />
							<br />
						</div>
						{#if event.external && event.needs_groups}
							You are required to join a group <a
								class="link link-primary"
								href={`/community/event-groups/${event.id}`}>Click here to join or create a group</a
							>
						{/if}
					{:else if moment(event.date).isBefore(moment())}
						<div class="alert alert-error mb-4">Registrations have been closed.</div>
					{:else if isLoading}
						<Loading />
					{:else}
						<form onsubmit={submitRegistration}>
							<div class="mb-4">
								<label for="name" class="mb-2 block">Full Name</label>
								<input
									type="text"
									placeholder="Enter your"
									id="name"
									bind:value={formData.name}
									required
									class="w-full rounded-lg border px-3 py-2"
								/>
							</div>

							<div class="mb-4">
								<label for="email" class="mb-2 block">Email</label>
								<input
									type="email"
									id="email"
									bind:value={formData.email}
									required
									class="w-full rounded-lg border px-3 py-2"
								/>
							</div>
							<button type="submit" class="btn btn-primary w-full text-white">
								Register Now
							</button>
						</form>
					{/if}
				{/if}
			{:else}
				<p>You need to be logged in to register for this event</p>
				<a href="/login" class="btn btn-primary w-full text-white"><LogIn /> Login</a>
			{/if}
		</div>
	</div>
</div>
