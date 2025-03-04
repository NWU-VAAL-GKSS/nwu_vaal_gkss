<script>
	let { quiz, alreadyCompleted } = $props();

	let userAnswers = $state({});
	let currentQuestion = $state(0);
	let showScore = $state(false);
	let score = $state(0);
	let totalPoints = $state(0);

	const handleAnswer = (questionIndex, answer) => {
		userAnswers = { ...userAnswers, [questionIndex]: answer };
	};

	const calculateScore = async () => {
		if (userAnswers[0] == undefined) {
			alert('You need to answer the quiz first');
			return;
		}
		let calculatedScore = 0;
		totalPoints = quiz.quiz_questions.reduce((acc, q) => acc + q.points, 0);

		quiz.quiz_questions.forEach((q, index) => {
			const userAnswer = userAnswers[index];
			if (userAnswers.length == index) return;
			switch (q.type) {
				case 'multipleChoice':
					if (userAnswer.toLowerCase() === q.options[q.correctOption].toLowerCase())
						calculatedScore += q.points;

					break;
				case 'shortAnswer':
					if (userAnswer.toLowerCase() === q.correctAnswer.toLowerCase())
						calculatedScore += q.points;
					break;
				case 'trueFalse':
					if (userAnswer === q.correctAnswer);

					calculatedScore += q.points;
					break;
			}
		});

		score = calculatedScore;
		showScore = true;
		alreadyCompleted = true;
		const response = await fetch('/executive/api/submitQuizAttempt', {
			method: 'POST',
			body: JSON.stringify({ points: score, quiz_id: quiz.id })
		});
	};

	const handleNext = () => {
		if (currentQuestion < quiz.quiz_questions.length - 1) {
			currentQuestion++;
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			currentQuestion--;
		}
	};
</script>

<div class="container mx-auto max-w-3xl p-4">
	{#if !alreadyCompleted}
		<!-- Quiz Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold">{quiz.title}</h1>
			<div class="text-sm text-gray-500">
				Question {currentQuestion + 1} of {quiz.quiz_questions.length}
			</div>
		</div>

		<!-- Questions -->
		{#each quiz.quiz_questions as question, qi}
			{#if qi === currentQuestion}
				<div class="card mb-6 bg-base-100 text-white shadow-xl">
					<div class="card-body">
						<!-- Question Text -->
						<h2 class="card-title mb-4 text-xl">{question.text}</h2>

						<!-- Multiple Choice -->
						{#if question.type === 'multipleChoice'}
							<div class="space-y-2">
								{#each question.options as option, oi}
									<label
										class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-base-200"
									>
										<input
											type="radio"
											name="options-{oi}"
											class="radio-primary radio"
											checked={userAnswers[qi] === option}
											onchange={() => handleAnswer(qi, option)}
										/>
										<span>{option}</span>
									</label>
								{/each}
							</div>

							<!-- Fill in Blank -->
						{:else if question.type === 'fillInBlank'}
							<div class="form-control">
								<input
									type="text"
									class="input input-bordered w-full"
									placeholder="Type your answer here"
									bind:value={userAnswers[qi]}
								/>
							</div>

							<!-- True/False -->
						{:else if question.type === 'trueFalse'}
							<div class="flex gap-4">
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name={`tf-${qi}`}
										class="radio-primary radio"
										checked={userAnswers[qi] === true}
										onchange={() => handleAnswer(qi, true)}
									/>
									True
								</label>
								<label class="flex items-center gap-2">
									<input
										type="radio"
										name={`tf-${qi}`}
										class="radio-primary radio"
										checked={userAnswers[qi] === false}
										onchange={() => handleAnswer(qi, false)}
									/>
									False
								</label>
							</div>

							<!-- Short Answer -->
						{:else}
							<div class="form-control">
								<textarea
									class="textarea textarea-bordered"
									placeholder="Type your answer here"
									bind:value={userAnswers[qi]}
								></textarea>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/each}

		<!-- Navigation Controls -->
		<div class="mt-6 flex justify-between">
			<button
				class="btn btn-outline bg-gray-100 text-black"
				onclick={handlePrevious}
				disabled={currentQuestion === 0}
			>
				Previous
			</button>

			{#if currentQuestion === quiz.quiz_questions.length - 1}
				<button class="btn btn-primary" onclick={calculateScore}> Submit Quiz </button>
			{:else}
				<button class="btn btn-primary" onclick={handleNext}> Next </button>
			{/if}
		</div>
	{:else}
		<div class="card mx-auto mt-8 max-w-md bg-base-100 shadow-lg">
			<div class="card-body">
				<div class="badge badge-warning mx-auto mb-4 gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					Quiz Master Alert!
				</div>

				<h2 class="mb-2 text-center text-2xl font-bold text-primary">
					🏆 Victory Already Claimed! 🏆
				</h2>

				<div class="alert alert-warning shadow-lg">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 flex-shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<span>
							Your genius has already been recorded!<br />
							<span class="font-bold">One submission</span> per geek allowed
						</span>
					</div>
				</div>

				<div class="badge badge-info mt-4 gap-2">✨ One-Time Wonder Rule</div>

				<p class="mt-2 text-center text-sm text-white opacity-75">
					Like a phoenix reborn or limited sneaker drop<br />
					This quiz disappears after one glorious attempt!
				</p>

				<div class="mt-4 text-center">
					<div class="radial-progress text-success" style="--value:100; --size:3rem;">100%</div>
					<p class="mt-2 text-xs text-white opacity-50">(Confetti system overload detected 🎉)</p>
				</div>
			</div>
		</div>
	{/if}
	<!-- Score Modal -->
	<div class={showScore ? 'modal modal-open' : 'modal'}>
		<div class="modal-box">
			<h3 class="text-lg font-bold text-white">Quiz Results</h3>
			<div class="py-4">
				<div class="mb-4 text-center">
					{#if Math.round((score / totalPoints) * 100) < 50}
						<div class="text-4xl font-bold text-primary">{score}/{totalPoints}</div>
						<div class="text-lg text-primary">
							({Math.round((score / totalPoints) * 100)}%)
						</div>
					{:else}
						<div class="text-4xl font-bold text-success">{score}/{totalPoints}</div>
						<div class="text-lg text-success">
							({Math.round((score / totalPoints) * 100)}%)
						</div>
					{/if}
				</div>

				<div class="divider"></div>

				<!-- Answers Review -->
				<div class="max-h-96 space-y-4 overflow-y-auto text-white">
					{#each quiz.quiz_questions as question, qi}
						<div class="rounded-lg border p-4">
							<div class="mb-2 font-bold">{question.text}</div>
							<div class="mb-2 text-sm">
								Your answer: {userAnswers[qi] ?? 'No answer'}
							</div>
							<div class="text-sm text-success">
								Correct answer: {#if question.type === 'multipleChoice'}
									{question.options[question.correctOption]}
								{:else if question.type === 'trueFalse'}
									{question.correctAnswer ? 'true' : 'false'}
								{:else}
									{question.correctAnswer}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="modal-action">
				<button class="btn" onclick={() => (showScore = false)}> Close </button>
			</div>
		</div>
	</div>
</div>
