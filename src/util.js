export function setUserData(userData) {
	localStorage.setItem('userData', JSON.stringify(userData));
}

export function getUserData() {
	return JSON.parse(localStorage.getItem('userData'));
}

export function clearUserData() {
	localStorage.removeItem('userData');
}

export function formHandler(callback) {
	return function (e) {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.trim()]));

		callback(data, form);
	};
}
