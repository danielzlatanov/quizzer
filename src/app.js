import { page, render } from './lib.js';
import { getUserData } from './util.js';
import { editorPage } from './views/editor/editor.js';
import { browsePage } from './views/browse.js';
import { loginPage, registerPage } from './views/auth.js';
import { logout } from './api/data.js';

const root = document.getElementById('content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateCtx);

page('/create', editorPage);
page('/edit/:id', editorPage);
page('/browse', browsePage);
page('/login', loginPage);
page('/register', registerPage);
// page('/details/:id', detailsPage);

setNav();
page.start();

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
