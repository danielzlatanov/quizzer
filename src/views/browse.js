import { getQuizzes } from '../api/data.js';
import { html, until } from '../lib.js';
import { cube } from './common/loader.js';

const browseTemplate = quizzesPromise => html`<section id="browse">
	<header class="pad-large">
		<form class="browse-filter">
			<input class="input" type="text" name="query" />
			<select class="input" name="topic">
				<option value="all">All Categories</option>
				<option value="it">Languages</option>
				<option value="hardware">Hardware</option>
				<option value="software">Tools and Software</option>
			</select>
			<input class="input submit action" type="submit" value="Filter Quizzes" />
		</form>
		<h1>All quizzes</h1>
	</header>
	${until(quizzesPromise, cube())}
</section>`;

const quizTemplate = quiz => html`<article class="preview layout">
	<div class="right-col">
		<a class="action cta" href="/details/${quiz.objectId}">View</a>
	</div>
	<div class="left-col">
		<h3>
			<a class="quiz-title-link" href="/details/${quiz.objectId}">${quiz.title}</a>
		</h3>
		<span class="quiz-topic">Topic: ${quiz.topic}</span>
		<div class="quiz-meta">
			<span
				><span id="descCount">${quiz.questionCount}</span> question${quiz.questionCount == 1
					? ''
					: 's'}</span
			>
			<span>|</span>
			<span
				>Taken
				<span id="descCount">15</span>
				times</span
			>
		</div>
	</div>
</article>`;

async function loadQuizzes() {
	const quizzes = await getQuizzes();
	return html`<div class="pad-large alt-page gr">${quizzes.map(quizTemplate)}</div>`;
}

export async function browsePage(ctx) {
	ctx.render(browseTemplate(loadQuizzes()));
}
