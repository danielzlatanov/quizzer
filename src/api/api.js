import { clearUserData, setUserData, getUserData } from '../util.js';
import { notify } from '../views/err.js';

const host = 'https://parseapi.back4app.com';

async function request(url, options) {
	try {
		const res = await fetch(host + url, options);

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message);
		}

		try {
			const data = await res.json();
			return data;
		} catch (e) {
			return res;
		}
	} catch (err) {
		notify(err.message);
		throw err;
	}
}

function createOptions(method = 'get', data) {
	const options = {
		method,
		headers: {
			'X-Parse-Application-Id': 'CJYFOXtDO8dBBlBkuvfWV2w51nft8RlZ6wrbeqZV',
			'X-Parse-REST-API-Key': 'SvdX3Pl5LmXQ6qxUeQuKnJWKEbmzmD5BbGtZvBzr',
		},
	};

	if (data != undefined) {
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify(data);
	}

	const userData = getUserData();
	if (userData) {
		options.headers['X-Parse-Session-Token'] = userData.token;
	}

	return options;
}

export async function get(url) {
	return await request(url, createOptions());
}

export async function post(url, data) {
	return await request(url, createOptions('post', data));
}

export async function put(url, data) {
	return await request(url, createOptions('put', data));
}

export async function del(url) {
	return await request(url, createOptions('delete'));
}

export async function login(username, password) {
	const res = await post('/login', { username, password });

	const userData = {
		username,
		id: res.objectId,
		token: res.sessionToken,
	};
	setUserData(userData);
	return res;
}

export async function register(email, username, password) {
	const res = await post('/users', { email, username, password });

	const userData = {
		username,
		id: res.objectId,
		token: res.sessionToken,
	};
	setUserData(userData);
	return res;
}

export async function logout() {
	const res = await post('/logout', {});
	clearUserData();
	return res;
}
