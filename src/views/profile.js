import { html, until } from '../lib.js';
import { quizPreviewTemplate } from './common/quizPreview.js';
import { getQuizById, getSolutionsByUserId } from '../api/data.js';
import { getUserData } from '../util.js';

const profileTemplate = (user, level, solved, showSolved) => html`<section id="profile">
	<header class="pad-large">
		<h1>Profile Page</h1>
	</header>

	<div class="hero-prof pad-large">
		<article class="glass pad-large profile">
			<h2>Personal Info</h2>
			<p>
				<span class="profile-info">Username:</span>
				${user.username}
			</p>
			<p>
				<span class="profile-info">Level: ${level}</span>
				<p id="levelInfo">* Your level is determined by the count of your solutions:</p>
			<table id="levelTable">
				<tr>
					<th>Newbie &#127774;</th>
					<th>Advanced &#128142;</th>
					<th>Pro &#127775</th>
				</tr>
				<tr>
					<td>0 - 10 solutions</td>
					<td>11 - 99 solutions</td>
					<td>100+ solutions</td>
				</tr>
			</table> 
			</p>
			<h2 id="solved-txt">Solved Quizzes [<span id="descCount">${
				solved.length
			}</span>] <a @click=${showSolved} class="action cta showBtn" href="javascript:void(0)">Show</a></h2>
			<table class="quiz-results" hidden>
			${solved.map(solvedQuizTemplate)}
			</table>
		</article>
	</div>

	<header class="pad-large">
		<h2>Quizzes created by you</h2>
	</header>

	<div class="pad-large alt-page gr">
		<article class="preview layout">
			<div class="right-col">
				<a class="action cta" href="#">View</a>
				<a class="action cta" href="#"><i class="fas fa-edit"></i></a>
				<a class="action cta" href="#"><i class="fas fa-trash-alt"></i></a>
			</div>
			<div class="left-col">
				<h3>
					<a class="quiz-title-link" href="#">Extensible Markup Language</a>
				</h3>
				<span class="quiz-topic">Topic: Languages</span>
				<div class="quiz-meta">
					<span><span id="descCount">15</span> questions</span>
					<span>|</span>
					<span>Solved <span id="descCount">15</span> times</span>
				</div>
			</div>
		</article>

	</div>
</section>`;

const solvedQuizTemplate = solved => html`
	<tbody>
		<tr class="results-row">
			<td class="cell-1">${new Date(solved.createdAt).toLocaleString()}</td>
			${until(getQuizInfo(solved.quiz.objectId), html`<p>Loading...</p>`)}
			<td class="cell-3 s-correct">${((solved.correct / solved.total) * 100).toFixed(0)}%</td>
			<td class="cell-4 s-correct">${solved.correct}/${solved.total} correct answers</td>
		</tr>
	</tbody>
`;

export async function profilePage(ctx) {
	const solved = await getUserSolutions();
	ctx.render(profileTemplate(getUserData(), await getLevel(), solved, showSolved));

	function showSolved(e) {
		e.preventDefault();
		if (e.target.textContent == 'Show') {
			document.querySelector('.quiz-results').style.display = 'table';
			e.target.textContent = 'Hide';
		} else {
			document.querySelector('.quiz-results').style.display = 'none';
			e.target.textContent = 'Show';
		}
	}
}

async function getQuizInfo(quizId) {
	const quiz = await getQuizById(quizId);
	return html`<td class="cell-2">
		<a href="/quiz/${quizId}">Title - ${quiz.title}<br />Topic - ${quiz.topic}</a>
	</td>`;
}

async function getLevel() {
	const res = await getUserSolutions();
	const solutions = res.length;
	if (solutions >= 0 && solutions <= 10) {
		return html`Newbie &#127774;`;
	} else if (solutions >= 11 && solutions <= 99) {
		return html`Advanced &#128142;`;
	} else {
		return html`Pro &#127775`;
	}
}

async function getUserSolutions() {
	const userId = getUserData().id;
	const result = await getSolutionsByUserId(userId);
	return result;
}
