export const topics = {
	it: 'Information Technology',
	languages: 'Languages',
	hardware: 'Hardware',
	software: 'Software',
	frameworks: 'Frameworks',
};

export function setUserData(userData) {
	localStorage.setItem('userData', JSON.stringify(userData));
}

export function getUserData() {
	return JSON.parse(localStorage.getItem('userData'));
}

export function clearUserData() {
	localStorage.removeItem('userData');
}
