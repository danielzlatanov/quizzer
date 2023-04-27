import { getQuizzes } from '../api/data.js';
import { html, until } from '../lib.js';
import { topics } from '../util.js';
import { cube } from './common/loader.js';
import { quizPreviewTemplate } from './common/quizPreview.js';

const browseTemplate = () => html`<section id="browse">
	<header class="pad-large">
		<!-- todo -->
		<!-- <form class="browse-filter">
			<input class="input" type="text" name="query" />
			<select class="input" name="topic">
				<option value="all">All Categories</option>
				${Object.entries(topics).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
			</select>
			<input class="input submit action" type="submit" value="Search" />
		</form> -->
		<h1>All quizzes</h1>
	</header>
	<div class="pad-large alt-page gr">${until(loadQuizzes(), cube())}</div>
</section>`;

async function loadQuizzes() {
	const quizzes = await getQuizzes();
	return html`${quizzes.map(quizPreviewTemplate)}`;
}

export async function browsePage(ctx) {
	ctx.render(browseTemplate());
}
