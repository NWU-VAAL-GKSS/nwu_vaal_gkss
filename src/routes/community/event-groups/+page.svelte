<script>
	import { LogIn } from 'lucide-svelte';
	import moment from 'moment';

	let { data } = $props();
	let events = $state(data.events);
</script>

<title>Event Groups | NWU Vaal GKSS</title>
{#if data.isLoggedIn}
	<div class="p-3">
		<h1 class="text-lg font-bold">Events you registered for</h1>
		<p>Below you will see events you registered for which require you to be in a group.</p>
		<section class="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
			<ul role="list" class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
				{#each events as event}
					{#if event.needs_groups && event.event_attendee.some((attendee) => attendee.Member.username == data.currentUser.username)}
						<li>
							<a
								href={`/community/event-groups/${event.id}`}
								class="hover:border-primary-300 focus:ring-primary-500 group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md focus:outline-none focus:ring-2"
							>
								<div class="mb-4 flex items-center gap-3">
									<div>
										{#if event.date}
											<time class="text-xs text-gray-500" datetime={event.date}>
												{moment(event.date).format('LL')}
											</time>
										{/if}
									</div>
								</div>

								<div class="flex flex-1 flex-col">
									<h2 class="group-hover:text-primary-600 mb-2 text-xl font-semibold text-gray-900">
										{event.topic}
									</h2>
									<p class="mb-4 line-clamp-3 flex-1 text-base text-gray-600">
										{event.description}
									</p>
								</div>
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</section>
	</div>
{:else}
	<div class="rounded-xl border-2 border-dashed p-8 text-center">
		<div class="mx-auto max-w-xs space-y-4">
			<LogIn class="mx-auto h-12 w-12 text-primary" />
			<h4 class="text-xl font-semibold">Join the community</h4>
			<p class="mb-4 text-gray-600">Sign in to be able to register for events and join groups</p>
			<a href="/login" class="btn btn-primary w-full gap-2">
				<LogIn class="h-5 w-5" />
				Login to Continue
			</a>
		</div>
	</div>
{/if}
