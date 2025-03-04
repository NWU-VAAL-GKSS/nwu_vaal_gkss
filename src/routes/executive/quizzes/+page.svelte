<script>
	import moment from 'moment';
	import { onMount } from 'svelte';

	let quizzes = $state([]);

	const deleteQuiz = (id) => {
		quizzes = quizzes.filter((quiz) => quiz.id !== id);
	};
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
		<h1 class="text-3xl font-bold text-black">Quiz Manager</h1>
		<a href="/executive/quizzes/create" class="btn btn-primary"> Create New Quiz </a>
	</div>

	<!-- Quiz Grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">{quiz.title}</h2>
						<div class="flex justify-between">
							<span class="badge badge-info"
								>Questions: {quiz ? quiz.quiz_questions.length : ''}</span
							>
							<span class="badge badge-ghost">Due: {moment(quiz.due).fromNow()}</span>
						</div>
						<div class="card-actions mt-4 justify-end">
							<button class="btn btn-primary btn-sm">Take Quiz</button>
							<button class="btn btn-error btn-sm" onclick={() => deleteQuiz(quiz.id)}>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
