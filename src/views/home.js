import { html, until } from '../lib.js';
import { getUserData, topics } from '../util.js';
import { cube } from './common/loader.js';
import { getQuizzes, getMostRecentQuiz } from '../api/data.js';
import { quizPreviewTemplate } from './common/quizPreview.js';

const homeTemplate = (quizCount, topics) => html`<section id="welcome">
	<div class="hero layout">
		<div class="glass welcome">
			<h1>Welcome to Quizzer</h1>
			<p>
				${quizCount} quizzes in ${topics} topics
				<br />
				<a href="/browse">Browse quizzes</a>
			</p>
			${getUserData() == null
				? html`<a class="action cta" href="/login">Login to create a quiz</a>`
				: ''}
		</div>
	</div>

	${until(loadRecentQuiz(), cube())}
</section>`;

async function loadRecentQuiz() {
  const recent = await getMostRecentQuiz();

	return html`<div class="pad-large alt-page gr">
		<h2>Our most recent quiz:</h2>

		${recent
			? quizPreviewTemplate(recent)
			: html`<p id="no-quizzes">No quizzes yet. Be the first to create one!</p>`}

		<div>
			<a class="action cta" href="/browse">Browse all quizzes</a>
		</div>
	</div>`;
}

export async function homePage(ctx) {
	const quizzes = await getQuizzes();
	ctx.render(homeTemplate(quizzes.length, Object.keys(topics).length));
}
