import { html } from '../../lib.js';
import { topics } from '../../util.js';

export const popularTemplate = quiz => html`<article class="popular-preview layout popular">
	<h3>
		<a class="popular-title" href="/details/${quiz.objectId}">${quiz.title}</a>
	</h3>
	<span class="quiz-topic">Topic: ${topics[quiz.topic]}</span>
	<div class="quiz-meta">
		<span
			>Solved
			<span id="descCount">${quiz.taken || 0}</span>
			time${quiz.taken == 1 ? '' : 's'}</span
		>
	</div>
</article>`;
