<script>
	let { todaysBirthdays } = $props();
</script>

{#if todaysBirthdays.length > 0}
	<h1 class="text-center text-2xl font-extrabold text-black">Today's birthdays</h1>
	<div class="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each todaysBirthdays as member}
			<div
				class="card transform overflow-hidden rounded-lg bg-white p-4 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
			>
				<figure class="relative">
					<img
						src={member.image}
						alt="member"
						class="h-[300px] w-full transform rounded-md object-cover transition duration-300 ease-in-out hover:scale-105"
					/>
				</figure>
				<div class="card-body p-4 text-black">
					<h2 class="card-title text-xl font-semibold text-red-600">
						{member.name}
						{member.surname}
					</h2>
					<p class="text-lg text-gray-700">
						{member.year_of_study} year student in {member.qualification}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
