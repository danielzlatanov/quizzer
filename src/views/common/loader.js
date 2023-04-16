import { html } from '../../lib.js';

export const overlay = () => html`<div class="loading-overlay working"></div>`;

export function createOverlay() {
	const element = document.createElement('div');
	element.className = 'loading-overlay working';
	return element;
}
