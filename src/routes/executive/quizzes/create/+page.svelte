<script>
	import Loading from '../../../../components/Loading.svelte';

	let newQuiz = $state({
		title: '',
		due: '',
		questions: []
	});
	let isLoading = $state(false);

	const questionTypes = [
		{ value: 'multipleChoice', label: 'Multiple Choice' },
		{ value: 'trueFalse', label: 'True/False' },
		{ value: 'shortAnswer', label: 'Short Answer' }
	];

	const addQuestion = (type) => {
		const baseQuestion = {
			id: Date.now(),
			type,
			text: '',
			points: 1
		};

		switch (type) {
			case 'multipleChoice':
				newQuiz.questions = [
					...newQuiz.questions,
					{
						...baseQuestion,
						options: ['', ''],
						correctOption: 0
					}
				];
				break;

			case 'trueFalse':
				newQuiz.questions = [
					...newQuiz.questions,
					{
						...baseQuestion,
						correctAnswer: true
					}
				];
				break;

			default:
				newQuiz.questions = [
					...newQuiz.questions,
					{
						...baseQuestion,
						correctAnswer: ''
					}
				];
		}
	};

	const addOption = (questionIndex) => {
		newQuiz.questions[questionIndex].options = [...newQuiz.questions[questionIndex].options, ''];
	};

	const removeOption = (questionIndex, optionIndex) => {
		newQuiz.questions[questionIndex].options = newQuiz.questions[questionIndex].options.filter(
			(_, i) => i !== optionIndex
		);
	};

	const validateQuiz = () => {
		return (
			newQuiz.title.trim() &&
			newQuiz.questions.every((question) => {
				if (!question.text.trim()) return false;

				switch (question.type) {
					case 'multipleChoice':
						return question.options.every((opt) => opt.trim()) && question.options.length >= 2;

					case 'shortAnswer':
						return question.correctAnswer.trim();

					case 'trueFalse':
						return typeof question.correctAnswer === 'boolean';
				}
				return true;
			})
		);
	};

	const submitQuiz = async () => {
		isLoading = true;
		const response = await fetch('/executive/api/createQuiz', {
			method: 'POST',
			body: JSON.stringify({ quiz: newQuiz })
		});
		const res = await response.json();
		if (res.success) {
			location = '/executive/quizzes';
		} else {
			alert('Failed to create quiz, contact admin, message: ' + res.error);
		}
	};
</script>

<div class="container mx-auto max-h-screen overflow-auto p-4 lg:p-10">
	{#if isLoading}
		<Loading />
	{:else}
		<h1 class="mb-8 text-3xl font-bold text-black">Create New Quiz</h1>

		<!-- Quiz Title -->
		<div class="form-control mb-8">
			<label for="title" class="label">
				<span class="label-text text-black">Quiz Title</span>
			</label>
			<input
				type="text"
				name="title"
				placeholder="Enter quiz title"
				class="input input-bordered w-full"
				bind:value={newQuiz.title}
				required
			/>
		</div>
		<!-- Due date -->
		<div class="form-control mb-8">
			<label for="due" class="label">
				<span class="label-text text-black">Due date and time</span>
			</label>
			<input
				type="datetime-local"
				name="due"
				placeholder="Enter quiz title"
				class="input input-bordered w-full"
				bind:value={newQuiz.due}
				required
			/>
		</div>

		<!-- Questions -->
		{#each newQuiz.questions as question, qi (question.id)}
			<div class="card mb-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex justify-between">
						<h2 class="card-title">Question {qi + 1}</h2>
						<select class="select select-bordered select-sm" bind:value={question.type}>
							{#each questionTypes as type}
								<option value={type.value}>{type.label}</option>
							{/each}
						</select>
					</div>

					<!-- Question Text -->
					<textarea
						class="textarea textarea-bordered mb-4"
						placeholder="Enter your question"
						bind:value={question.text}
					></textarea>

					<!-- Question Type-Specific Inputs -->
					{#if question.type === 'multipleChoice'}
						<div class="space-y-2">
							{#each question.options as option, oi}
								<div class="flex items-center gap-2">
									<input
										type="radio"
										name={`correct-${qi}`}
										class="radio-primary radio"
										checked={question.correctOption === oi}
										onchange={() => (question.correctOption = oi)}
									/>
									<input
										type="text"
										class="input input-bordered flex-1"
										placeholder={`Option ${oi + 1}`}
										bind:value={question.options[oi]}
									/>
									{#if question.options.length > 2}
										<button
											class="btn btn-circle btn-error btn-xs"
											onclick={() => removeOption(qi, oi)}
										>
											✕
										</button>
									{/if}
								</div>
							{/each}
							<button class="btn btn-success btn-sm" onclick={() => addOption(qi)}>
								Add Option
							</button>
						</div>
					{:else if question.type === 'fillInBlank'}
						<div class="form-control">
							<label for="correctAnswer" class="label">
								<span class="label-text">Correct Answer</span>
							</label>
							<input
								name="correctAnswer"
								type="text"
								class="input input-bordered"
								bind:value={question.correctAnswer}
							/>
						</div>
					{:else if question.type === 'trueFalse'}
						<div class="flex gap-4">
							<label class="flex items-center gap-2">
								<input
									type="radio"
									name={`tf-${qi}`}
									class="radio-primary radio"
									checked={question.correctAnswer === true}
									onchange={() => (question.correctAnswer = true)}
								/>
								True
							</label>
							<label class="flex items-center gap-2">
								<input
									type="radio"
									name={`tf-${qi}`}
									class="radio-primary radio"
									checked={question.correctAnswer === false}
									onchange={() => (question.correctAnswer = false)}
								/>
								False
							</label>
						</div>
					{:else}
						<div class="form-control">
							<label for="correctAnswer" class="label">
								<span class="label-text">Correct Answer</span>
							</label>
							<input
								name="correctAnswer"
								type="text"
								class="input input-bordered"
								bind:value={question.correctAnswer}
							/>
						</div>
					{/if}

					<!-- Points -->
					<div class="form-control mt-4">
						<label for="points" class="label">
							<span class="label-text">Points</span>
						</label>
						<input
							type="number"
							min="1"
							name="points"
							class="input input-bordered w-24"
							bind:value={question.points}
						/>
					</div>

					<button
						class="btn btn-error btn-sm mt-4"
						onclick={() => (newQuiz.questions = newQuiz.questions.filter((_, i) => i !== qi))}
					>
						Remove Question
					</button>
				</div>
			</div>
		{/each}

		<!-- Add Question Buttons -->
		<div class="join join-vertical w-full">
			{#each questionTypes as type}
				<button class="btn join-item" onclick={() => addQuestion(type.value)}>
					Add {type.label} Question
				</button>
			{/each}
		</div>

		<!-- Save Button -->
		<div class="mt-8 flex justify-end">
			<button class="btn btn-primary" disabled={!validateQuiz()} onclick={submitQuiz}>
				Save Quiz
			</button>
		</div>
	{/if}
</div>
