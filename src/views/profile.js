import { html } from '../lib.js';
import { deleteQuiz, getQuizzes, getSolutionsByUserId } from '../api/data.js';
import { getUserData } from '../util.js';

const profileTemplate = (
	user,
	level,
	solved,
	showSolved,
	created,
	onDelete
) => html`<section id="profile">
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
				solved.length || 0
			}</span>] <a @click=${showSolved} class="action cta showBtn" href="javascript:void(0)">Show</a></h2>
			<table class="quiz-results" hidden>
				${
					solved.length > 0
						? solved.map(solvedQuizTemplate)
						: html`<p>You have not solved any quizzes yet.</p>`
				}
			</table>
		</article>
	</div>

	<header class="pad-large">
		<h2>Quizzes created by you</h2>
	</header>

	<div class="pad-large alt-page gr" id="created-q">
				${
					created.length > 0
						? created.map(c => createdQuizTemplate(c, onDelete))
						: html`<p id="no-own-q">You have not created any quizzes yet.</p>`
				}
	</div>
</section>`;

const solvedQuizTemplate = solved => html`
	<tbody>
		<tr class="results-row">
			<td class="cell-1">${new Date(solved.createdAt).toLocaleString()}</td>
			<td class="cell-2">${solved.title}</td>
			<td class="cell-3 s-correct">${((solved.correct / solved.total) * 100).toFixed(0)}%</td>
			<td class="cell-4 s-correct">${solved.correct}/${solved.total} correct answers</td>
		</tr>
	</tbody>
`;

const createdQuizTemplate = (quiz, onDelete) => html`<article class="preview layout">
	<div class="right-col">
		<a class="action cta" href="/quiz/${quiz.objectId}">View</a>
		<a class="action cta" href="/edit/${quiz.objectId}"><i class="fas fa-edit"></i></a>
		<a @click=${onDelete.bind(null, quiz.objectId)} class="action cta" href="javascript:void(0)"
			><i class="fas fa-trash-alt"></i
		></a>
	</div>
	<div class="left-col">
		<h3>
			<a class="quiz-title-link" href="/quiz/${quiz.objectId}">${quiz.title}</a>
		</h3>
		<span class="quiz-topic">Topic: ${quiz.topic}</span>
		<div class="quiz-meta">
			<span><span id="descCount">${quiz.questionCount}</span> questions</span>
			<span>|</span>
			<span>Solved <span id="descCount">${quiz.taken || 0}</span> times</span>
		</div>
	</div>
</article>`;

export async function profilePage(ctx) {
	let solved = await getUserSolutions();
	solved = solved.filter(x => x.title);
	const created = await getOwnQuizzes();
	update();

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

	async function onDelete(quizId, e) {
		e.preventDefault();

		let target = e.target;
		while (target.tagName != 'ARTICLE') {
			target = target.parentNode;
		}

		const confirmed = confirm('Are you sure you want to delete this quiz?');
		if (confirmed) {
			target.remove();
			if (quizId) {
				await deleteQuiz(quizId);
			}
		}
		update();
	}

	async function update() {
		ctx.render(
			profileTemplate(getUserData(), await getLevel(), solved, showSolved, created, onDelete)
		);
	}
}

async function getOwnQuizzes() {
	const quizzes = await getQuizzes();
	const userId = getUserData().id;
	const created = quizzes.filter(x => x.owner.objectId == userId);
	return created;
}

async function getLevel() {
	let res = await getUserSolutions();
	res = res.filter(x => x.title);
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
