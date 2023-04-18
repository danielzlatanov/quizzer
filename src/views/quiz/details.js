import { html, until } from '../../lib.js';
import { topics } from '../../util.js';
import { cube } from '../common/loader.js';
import { getSolutionCount } from '../../api/data.js';

const detailsTemplate = quiz => html`<section id="details">
	<div class="pad-large alt-page gr">
		<article class="details">
			<h1>${quiz.title}</h1>
			<span class="quiz-topic"
				>A quiz by <a href="/users/${quiz.owner.objectId}">${quiz.owner.username}</a> on
				"${topics[quiz.topic]}"</span
			>
			${until(loadCount(quiz), cube())}
			<p class="quiz-desc">${quiz.description}</p>

			<div>
				<a class="cta action" href="/quiz/${quiz.objectId}">Start</a>
			</div>
		</article>
	</div>
</section>`;

async function loadCount(quiz) {
	const taken = (await getSolutionCount([quiz.objectId]))[quiz.objectId] || 0;

	return html`<div class="quiz-meta">
		<span
			><span id="descCount">${quiz.questionCount}</span> question${quiz.questionCount == 1
				? ''
				: 's'}</span
		>
		<span>|</span>
		<span>Solved <span id="descCount">${taken}</span> time${taken == 1 ? '' : 's'}</span>
	</div>`;
}

export function detailsPage(ctx) {
	ctx.render(detailsTemplate(ctx.quiz));
}
