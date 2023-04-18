import { html, until } from '../../lib.js';
import { topics } from '../../util.js';
import { cube } from '../common/loader.js';

const detailsTemplate = (quiz) => html`<section id="details">
	<div class="pad-large alt-page gr">
		<article class="details">
			<h1>${quiz.title}</h1>
			<span class="quiz-topic">A quiz by <a href="/users/${quiz.owner.objectId}">${quiz.owner.username}</a> on "${topics[quiz.topic]}"</span>
			<div class="quiz-meta">
				<span><span id="descCount">${quiz.questionCount}</span> Questions</span>
				<span>|</span>
				<span>Taken <span id="descCount">${quiz.taken}</span> times</span>
			</div>
			<p class="quiz-desc">
				${quiz.description}
			</p>

			<div>
				<a class="cta action" href="/quiz/${quiz.objectId}">Start</a>
			</div>
		</article>
	</div>
</section>`;

export function detailsPage(ctx) {
	ctx.render(detailsTemplate(ctx.quiz));
}
