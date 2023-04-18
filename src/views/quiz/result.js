import { html } from '../../lib.js';

const resultTemplate = (quiz, result) => html`<section id="summary">
	<div class="hero layout">
		<article class="details glass">
			<h1>Quiz Results</h1>
			<h2>${quiz.title}</h2>

			<div class="summary summary-top">${result.percent}%</div>

			<div class="summary">${result.correct}/${result.total} correct answers</div>

			<a class="action cta" href="/quiz/${quiz.objectId}"><i class="fas fa-sync-alt"></i> Retake</a>
			<a class="action cta" href="/details/${quiz.objectId}"><i class="fas fa-clipboard-list"></i> Details</a>
		</article>
	</div>

	<div class="pad-large alt-page gr">
		<article class="preview">
			<span class="s-correct">
				Question 1
				<i class="fas fa-check"></i>
			</span>
			<div class="right-col">
				<button class="action">See question</button>
			</div>
		</article>

		<article class="preview">
			<span class="s-correct">
				Question 2
				<i class="fas fa-check"></i>
			</span>
			<div class="right-col">
				<button class="action">See question</button>
			</div>
		</article>

		<article class="preview">
			<span class="s-incorrect">
				Question 3
				<i class="fas fa-times"></i>
			</span>
			<div class="right-col">
				<button class="action">Reveal answer</button>
			</div>
		</article>

		<article class="preview">
			<span class="s-incorrect">
				Question 4
				<i class="fas fa-times"></i>
			</span>
			<div class="right-col">
				<button class="action">Close</button>
			</div>

			<div>
				<p id="q-result">
					This is the first question. Veniam unde beatae est ab quisquam quos officia,
					eius harum accusamus adipisci?
				</p>
				<div class="s-answer">
					<span class="s-incorrect">
						This is answer 1
						<i class="fas fa-times"></i>
						<strong>Your choice</strong>
					</span>
				</div>
				<div class="s-answer">
					<span class="s-correct">
						This is answer 2
						<i class="fas fa-check"></i>
						<strong>Correct answer</strong>
					</span>
				</div>
				<div class="s-answer ans-normal">
					<span> This is answer 3 </span>
				</div>
			</div>
		</article>
	</div>
</section>`;

export async function resultPage(ctx) {
	const questions = ctx.quiz.questions;
	const answers = ctx.quiz.answers;
	const correct = answers.reduce(
		(acc, current, i) => acc + Number(questions[i].correctIndex == current),
		0
	);
	ctx.render(
		resultTemplate(ctx.quiz, {
			percent: ((correct / questions.length) * 100).toFixed(0),
			correct,
			total: questions.length,
		})
	);
}
