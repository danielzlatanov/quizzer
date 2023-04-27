const element = document.getElementById('errorBox');
const output = element.querySelector('span');

export function notify(msg) {
	if (msg) {
		output.textContent = msg;
	} else {
		output.textContent = 'An error occurred';
	}
	element.style.display = 'block';

	setTimeout(() => (element.style.display = 'none'), 3000);
}
