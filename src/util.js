export const topics = {
	IT: 'Information Technology',
	Languages: 'Languages',
	Hardware: 'Hardware',
	Software: 'Software',
	Frameworks: 'Frameworks',
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

