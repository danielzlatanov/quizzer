import { page, render } from './lib.js';
import { getUserData } from './util.js';
import { editorPage } from './views/editor/editor.js';
import { browsePage } from './views/browse.js';
import { loginPage, registerPage } from './views/auth.js';
import { getQuestionsByQuizId, getQuizById, logout } from './api/data.js';
import { quizPage } from './views/quiz/quiz.js';
import { cube } from './views/common/loader.js';
import { resultPage } from './views/quiz/result.js';

const state = {};
const root = document.getElementById('content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateCtx);

page('/create', editorPage);
page('/edit/:id', editorPage);
page('/browse', browsePage);
page('/login', loginPage);
page('/register', registerPage);
page('/quiz/:id', getQuiz, quizPage);
page('/result/:id', getQuiz, resultPage);
// page('/details/:id', detailsPage);

setNav();
page.start();

async function getQuiz(ctx, next) {
	const quizId = ctx.params.id;

	if (!state[quizId]) {
		ctx.render(cube());
		state[quizId] = await getQuizById(quizId);
		const ownerId = state[quizId].owner.objectId;
		state[quizId].questions = await getQuestionsByQuizId(quizId, ownerId);
		state[quizId].answers = state[quizId].questions.map(q => undefined);
	}

	ctx.clearCache = clearCache;
	ctx.quiz = state[quizId];
	next();
}

function clearCache(quizId) {
	if (state[quizId]) {
		delete state[quizId];
	}
}

function decorateCtx(ctx, next) {
	ctx.render = content => render(content, root);
	ctx.setNav = setNav;
	next();
}

function setNav() {
	const userData = getUserData();
	if (userData) {
		document.querySelector('#user-nav').style.display = 'block';
		document.querySelector('#guest-nav').style.display = 'none';
	} else {
		document.querySelector('#user-nav').style.display = 'none';
		document.querySelector('#guest-nav').style.display = 'block';
	}
}

async function onLogout() {
	await logout();
	setNav();
	page.redirect('/');
}
