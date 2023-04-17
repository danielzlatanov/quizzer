import { classMap, html, styleMap } from '../../lib.js';

const quizTemplate = (quiz, questions, answers, currentIndex, onSelect, startOver) => html`<section
	id="quiz">
	<header class="pad-large">
		<h1>${quiz.title} - Question ${currentIndex + 1} / ${questions.length}</h1>
		<nav class="layout q-control">
			<span class="block q-dec">Questions:</span>
			${questions.map((q, i) =>
				indexTemplate(quiz.objectId, i, i == currentIndex, answers[i] !== undefined)
			)}
		</nav>
	</header>
	<div class="pad-large alt-page gr">
		<article class="question">
			<p class="q-text">${questions[currentIndex].text}</p>

			<form @change=${onSelect}>
				${questions.map((q, i) => questionTemplate(q, i, i == currentIndex))}
			</form>

			<nav class="q-control">
				<span class="block q-remaining"
					><span id="qCount">${answers.filter(a => a == undefined).length}</span>
					questions remaining</span
				>
				${currentIndex > 0
					? html`<a class="action" href="/quiz/${quiz.objectId}?question=${currentIndex}"
							><i class="fas fa-arrow-left"></i> Previous</a
					  >`
					: ''}

				<a @click=${startOver} class="action" href="javascript:void(0)"
					><i class="fas fa-sync-alt"></i> Start over</a
				>
				<div class="right-col">
					${currentIndex < questions.length - 1
						? html`<a
								class="action"
								href="/quiz/${quiz.objectId}?question=${currentIndex + 2}"
								>Next <i class="fas fa-arrow-right"></i
						  ></a>`
						: ''}
					${answers.filter(a => a == undefined).length == 0 ||
					currentIndex == questions.length - 1
						? html`<a class="action" href="#">Submit answers</a>`
						: ''}
				</div>
			</nav>
		</article>
	</div>
</section>`;

const indexTemplate = (quizId, i, isCurrent, isAnswered) => {
	const className = {
		'q-index': true,
		'q-current': isCurrent,
		'q-answered': isAnswered,
	};

	return html`<a class=${classMap(className)} href="/quiz/${quizId}?question=${i + 1}"></a>`;
};

const questionTemplate = (question, questionIndex, isCurrent) => html`<div
	data-index="question-${questionIndex}"
	style=${styleMap({ display: isCurrent ? '' : 'none' })}>
	${question.answers.map((a, i) => answerTemplate(questionIndex, i, a))}
</div>`;

const answerTemplate = (questionIndex, index, text) => html`<label class="q-answer radio">
	<input class="input" type="radio" name="question-${questionIndex}" value=${index} />
	<i class="fas fa-check-circle"></i>
	${text}
</label>`;

export async function quizPage(ctx) {
	const index = Number(ctx.querystring.split('=')[1] || 1) - 1;
	const questions = ctx.quiz.questions;
	const answers = ctx.quiz.answers;
	update();

	function onSelect(e) {
		const questionIndex = Number(e.target.name.split('-')[1]);
		if (Number.isNaN(questionIndex) != true) {
			const answerIndex = Number(e.target.value);
			answers[questionIndex] = answerIndex;
			update();
		}
	}

	function startOver() {
		const confirmed = confirm('Are you sure you want to start over?');
		if (confirmed) {
			const quizId = ctx.quiz.objectId;
			ctx.clearCache(quizId);
			ctx.page.redirect('/quiz/' + quizId);
		}
	}

	function update() {
		ctx.render(quizTemplate(ctx.quiz, questions, answers, index, onSelect, startOver));
	}
}
