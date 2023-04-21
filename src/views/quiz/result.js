import { html } from '../../lib.js';

const resultTemplate = (quiz, result) => html`<section id="summary">
	<div class="hero layout">
		<article class="details glass">
			<h1>Quiz Results</h1>
			<h2>${quiz.title}</h2>

			<div class="summary summary-top">${result.percent}%</div>

			<div class="summary">${result.correct}/${result.total} correct answers</div>

			<a class="action cta" href="/quiz/${quiz.objectId}"
				><i class="fas fa-sync-alt"></i> Retake</a
			>
			<a class="action cta" href="/details/${quiz.objectId}"
				><i class="fas fa-clipboard-list"></i> Details</a
			>
		</article>
	</div>

	<div class="pad-large alt-page gr">
		${result.questions.map((q, i) => questionTemplate(i, q, result.answers))}
	</div>
</section>`;

const questionTemplate = (i, q, answers) => html`<article class="preview">
	<span class=${q.correctIndex == answers[i] ? 's-correct' : 's-incorrect'}>
		Question ${i + 1}
		${q.correctIndex == answers[i]
			? html`<i class="fas fa-check"></i>`
			: html`<i class="fas fa-times"></i>`}
	</span>
	<div class="right-col">
		<button @click=${toggleQuestionInfo} class="action">Reveal</button>
	</div>
	<div id="q-info-container" hidden>
		<p id="q-result">${q.text}</p>
		${q.correctIndex != answers[i]
			? html`<div class="s-answer">
						<span class="s-incorrect">
							${q.answers[answers[i]]
								? html`${q.answers[answers[i]]} <i class="fas fa-times"></i>
										<strong>Your choice</strong>`
								: html`You did not answer <i class="fas fa-times"></i>`}
						</span>
					</div>
					<div class="s-answer">
						<span class="s-correct">
							${q.answers[q.correctIndex]}
							<i class="fas fa-check"></i>
							<strong>Correct answer</strong>
						</span>
					</div>`
			: html`<div class="s-answer">
					<span class="s-correct">
						${q.answers[q.correctIndex]}
						<i class="fas fa-check"></i>
					</span>
			  </div>`}
	</div>
</article>`;

function toggleQuestionInfo(e) {
	const preview = e.target.parentNode.parentNode;

	if (e.target.textContent.trim() == 'Reveal') {
		preview.querySelector('#q-info-container').style.display = 'block';
		e.target.textContent = 'Hide';
	} else {
		preview.querySelector('#q-info-container').style.display = 'none';
		e.target.textContent = 'Reveal';
	}
}

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
			questions,
			answers,
		})
	);
}
