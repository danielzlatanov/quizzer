import { login, register } from '../api/data.js';
import { html } from '../lib.js';
import { notify } from './err.js';

const loginTemplate = onSubmit => html`<section id="login">
	<div class="pad-large">
		<div class="glass narrow">
			<header class="tab layout">
				<h1 class="tab-item active">Login</h1>
				<a class="tab-item" href="/register">Register</a>
			</header>
			<form @submit=${onSubmit} class="pad-med centered">
				<label class="block centered mrg"
					>username <input class="auth-input input" type="text" name="username"
				/></label>
				<label class="block centered"
					>password <input class="auth-input input" type="password" name="password"
				/></label>
				<input class="block action cta" type="submit" value="Sign In" />
			</form>
			<footer class="tab-footer">
				Don't have an account?
				<a class="invert" href="/register">Sign Up</a>
			</footer>
		</div>
	</div>
</section>`;

export async function loginPage(ctx) {
	ctx.render(loginTemplate(onSubmit));

	async function onSubmit(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) {
			return notify('All fields are required');
		}

		await login(username, password);
		ctx.setNav();
		ctx.page.redirect('/browse');
	}
}

const registerTemplate = onSubmit => html`<section id="register">
	<div class="pad-large">
		<div class="glass narrow">
			<header class="tab layout">
				<a class="tab-item" href="/login">Login</a>
				<h1 class="tab-item active">Register</h1>
			</header>
			<form @submit=${onSubmit} class="pad-med centered">
				<label class="block centered mrg"
					>username <input class="auth-input input" type="text" name="username"
				/></label>
				<label class="block centered"
					>email <input class="auth-input input" type="text" name="email"
				/></label>
				<label class="block centered"
					>password <input class="auth-input input" type="password" name="password"
				/></label>
				<label class="block centered"
					>repeat <input class="auth-input input" type="password" name="repass"
				/></label>
				<input class="block action cta" type="submit" value="Create Account" />
			</form>
			<footer class="tab-footer">
				Already have an account?
				<a class="invert" href="/login">Sign In</a>
			</footer>
		</div>
	</div>
</section>`;

export async function registerPage(ctx) {
	ctx.render(registerTemplate(onSubmit));

	async function onSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');
		const repass = formData.get('repass');

		if (!username || !email || !password) {
			return notify('All fields are required');
		}
		if (password != repass) {
			return notify('Passwords are not the same');
		}

		await register(email, username, password);
		ctx.setNav();
		ctx.page.redirect('/browse');
	}
}
