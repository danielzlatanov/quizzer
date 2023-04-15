import { page, render } from './lib.js';
import { getUserData } from './util.js';
import { editorPage } from './views/editor/editor.js'

const root = document.getElementById('content');

page(decorateCtx);

page('/', editorPage);
// page('/login', loginPage);
// page('/register', registerPage);
// page('/catalog', catalogPage);
// page('/create', createPage);
// page('/details/:id', detailsPage);
// page('/edit/:id', editPage);

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

// function onLogout() {
// 	logout();
// 	setNav();
// 	page.redirect('/');
// }

// import * as api from './api/data.js';
// window.api = api;
