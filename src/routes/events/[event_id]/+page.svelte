<script>
	import { onMount } from 'svelte';
	import moment from 'moment';
	import { LogIn, Medal } from 'lucide-svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { fade, fly } from 'svelte/transition';
	import { models } from '$lib/state.svelte.js';
	import TrixDisplay from '$lib/components/TrixDisplay.svelte';

	let { data } = $props();
	//let event = $state(data.event);
	let event = $state({});
	onMount(() => {
		event = JSON.parse(localStorage.getItem('ev'));
	});

	//models.context = 'Event: ' + JSON.stringify(event);

	let registrationCount = $state(0);
	let formData = $state({
		name: data.isLoggedIn ? data.currentUser.name + ' ' + data.currentUser.surname : '',
		email: data.isLoggedIn ? data.email : ''
	});

	let registrationSuccess = $state(false);
	let registrationError = $state(false);
	let isLoading = $state(false);

	async function submitRegistration(e) {
		isLoading = true;
		e.preventDefault();
		try {
			let event_id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
			const response = await fetch('/api/event/registration', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ event_id })
			});

			const res = await response.json();
			if (res.success) {
				registrationCount++;
				registrationSuccess = true;
				let data = {
					subject: 'Event Registration',
					message: `
        <p>You have registered for the following event: <b>${event.topic}</b></p>
        <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${event.topic}</h1>
            <p style="color: #555; font-size: 16px; margin-bottom: 16px;">${event.description}</p>
            <div style="background-color: #fff; padding: 16px; border-radius: 6px; border: 1px solid #ddd;">
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                    <span style="font-weight: bold;">Date:</span>
                    <span>${moment(event.date).format('LLLL')}</span>
                </div>
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                    <span style="font-weight: bold;">Venue:</span>
                    <span>${event.venue}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: bold;">Registered Attendees:</span>
                    <span>${registrationCount}</span>
                </div>
            </div>
        </div>
        <p style="margin-top: 16px;">This is an automatic message sent by our website. Visit: 
        <a href="https://nwu-vaal-gkss.netlify.app" style="color: #007bff; text-decoration: none;">https://nwu-vaal-gkss.netlify.app</a></p>
    `
				};

				const res = await fetch('/api/sendEmail', {
					method: 'POST',
					body: JSON.stringify({ data })
				});
			}
		} catch (error) {
			registrationError = true;
		}
		isLoading = false;
	}
</script>

<title>{event.topic} | NWU VAAL GKSS</title>
<div
	in:fly={{ x: 100, duration: 400 }}
	out:fade={{ duration: 300 }}
	class="container mx-auto px-4 py-8"
>
	<div class="grid gap-8 text-black md:grid-cols-2">
		<!-- Event Details -->
		<div>
			<div class="divider divider-start">
				<h1 class="mb-4 text-4xl font-bold">{event.topic}</h1>
			</div>
			<div class="rounded-xl bg-white p-4">
				<TrixDisplay content={event.description} />
			</div>
		</div>

		<!-- Registration Form -->
		<div id="register" class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-2xl font-semibold">Register for Event</h2>
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
