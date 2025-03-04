<script>
	import moment from 'moment';
	import { onMount } from 'svelte';

	let quizzes = $state([]);

	const fetchQuizzes = async () => {
		const response = await fetch('/executive/api/fetchQuizzes', {
			method: 'GET'
		});
		const res = await response.json();
		if (res.success) {
			quizzes = res.quizzes;
		}
	};

	onMount(() => fetchQuizzes());
</script>

<div class="container mx-auto p-4">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-black">Quizzes</h1>
	</div>

	<!-- Quiz Grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#if !quizzes.length}
			{#each [1, 2, 3, 4, 5, 6] as num}
				<div class="card bg-base-100 shadow-xl">
					<div class="skeleton h-32 w-full"></div>
					<div class="skeleton h-4 w-28"></div>
					<div class="skeleton h-4 w-full"></div>
					<div class="skeleton h-4 w-full"></div>
				</div>
			{/each}
		{:else}
			{#each quizzes as quiz (quiz.id)}
				{#if !moment(quiz.due).isSameOrBefore(moment())}
					<div class="card bg-base-100 text-white shadow-xl">
						<div class="card-body space-y-4">
							<h2 class="card-title">{quiz.title}</h2>
							<div class="flex justify-between">
								<span class="badge badge-info"
									>Questions: {quiz ? quiz.quiz_questions.length : ''}</span
								>
								<span class="badge badge-ghost">Due: {moment(quiz.due).fromNow()}</span>
							</div>
							<div class="card-actions mt-4 justify-end">
								<a href={`/community/quiz/${quiz.id}`} class="btn btn-primary w-full">Take Quiz</a>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
</div>
