<script>
	let { title, message, homeUrl } = $props();
</script>

<section class="min-h-screen bg-white dark:bg-black">
	<div class="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
		<div class="mx-auto max-w-screen-sm text-center">
			<h1 class="mb-4 text-7xl font-extrabold tracking-tight text-primary lg:text-9xl">404</h1>
			<p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
				{title ? title : "Something's missing."}
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				{message
					? message
					: "Sorry, we can't find that page. You'll find lots to explore on the home page."}
			</p>
			<a
				href={homeUrl ? homeUrl : '/'}
				class="bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 btn btn-primary my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
				>Back to Home</a
			>
		</div>
	</div>
</section>
