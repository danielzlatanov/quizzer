import { html } from '../../lib.js';
import { topics } from '../../util.js';

export const quizPreviewTemplate = quiz => html`<article class="preview layout">
	<div class="right-col">
		<a class="action cta" href="/details/${quiz.objectId}">View</a>
	</div>
	<div class="left-col">
		<h3>
			<a class="quiz-title-link" href="/details/${quiz.objectId}">${quiz.title}</a>
		</h3>
		<span class="quiz-topic">Topic: ${topics[quiz.topic]}</span>
		<div class="quiz-meta">
			<span
				><span id="descCount">${quiz.questionCount}</span> question${quiz.questionCount == 1
					? ''
					: 's'}</span
			>
			<span>|</span>
			<span
				>Taken
				<span id="descCount">${quiz.taken}</span>
				time${quiz.taken == 1
					? ''
					: 's'}</span
			>
		</div>
	</div>
</article>`;
