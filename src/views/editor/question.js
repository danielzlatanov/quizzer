import { html, render } from '../../lib.js';
import { createAnswerList } from './answer.js';
import { createQuestion as apiCreateQ, editQuestion as apiUpdateQ } from '../../api/data.js';
import { createOverlay } from '../common/loader.js';

const editorTemplate = (data, index, onSave, onCancel) => html`<div class="layout">
		<div class="question-control">
			<button @click=${onSave} class="input submit action">
				<i class="fas fa-check-double"></i> Save
			</button>
			<button @click=${onCancel} class="input submit action">
				<i class="fas fa-times"></i> Cancel
			</button>
		</div>
		<h3>Question ${index + 1}</h3>
	</div>
	<form>
		<textarea
			class="input editor-input editor-text"
			name="text"
			placeholder="Enter question"
			.value=${data.text}></textarea>

		${createAnswerList(data, index)}
	</form>`;

const viewTemplate = (data, index, onEdit, onDelete) => html`
	<div class="layout">
		<div class="question-control">
			<button @click=${onEdit} class="input submit action">
				<i class="fas fa-edit"></i> Edit
			</button>
			<button @click=${() => onDelete(index)} class="input submit action">
				<i class="fas fa-trash-alt"></i> Delete
			</button>
		</div>
		<h3>Question ${index + 1}</h3>
	</div>
	<div>
		<p class="editor-input q-saved">${data.text}</p>

		${data.answers.map((a, answerIndex) => radioView(a, data.correctIndex == answerIndex))}
	</div>
`;

const radioView = (value, checked) => html`<div class="editor-input">
	<label class="radio">
		<input class="input" type="radio" disabled ?checked=${checked} />
		<i class="fas fa-check-circle"></i>
	</label>
	<span class="q-saved">${value}</span>
</div>`;

export function createQuestion(quizId, question, removeQuestion, updateCount, editOpen) {
	let currentQuestion = copyQuestion(question);
	let index = 0;
	let editorActive = editOpen || false;
	const element = document.createElement('article');
	element.className = 'editor-question';

	showView();

	return update;
	function update(newIndex) {
		index = newIndex;
		if (editorActive) {
			showEditor();
		} else {
			showView();
		}
		return element;
	}

	function onEdit() {
		editorActive = true;
		showEditor();
	}

	async function onSave() {
		const formData = new FormData(element.querySelector('form'));
		const data = [...formData.entries()];

		const questionText = data[0][1];
		if (!questionText) {
			return alert('Please provide your question first');
		}

		const answers = data
			.filter(([k, v]) => k.includes('answer-'))
			.reduce((a, [k, v]) => {
				const index = Number(k.split('-')[1]);
				a[index] = v;
				return a;
			}, []);

		if (data[2] == undefined || data[3] == undefined) {
			return alert('You must provide at least 2 answers to your question');
		}

		const firstAnswerText = data[2][1];
		const secondAnswerText = data[3][1];

		if (!firstAnswerText || !secondAnswerText) {
			return alert('You must provide at least 2 answers to your question');
		}

		if (answers.some(a => a == '')) {
			return alert('Please remove any empty fields first');
		}

		const uniqueAnswers = [...new Set(answers)];
		if (uniqueAnswers.length < 2) {
			return alert('Please remove any duplicate answers, they are not allowed');
		}

		const body = {
			text: formData.get('text'),
			correctIndex: Number(data.find(([k, v]) => k.includes('question-'))[1]),
			answers: uniqueAnswers,
		};

		const loader = createOverlay();
		try {
			element.appendChild(loader);

			if (question.objectId) {
				await apiUpdateQ(question.objectId, body);
			} else {
				const res = await apiCreateQ(quizId, body);
				updateCount();
				question.objectId = res.objectId;
			}

			Object.assign(question, body);
			currentQuestion = copyQuestion(question);
			editorActive = false;
			update(index);
		} catch (err) {
			alert(err.message);
		} finally {
			loader.remove();
		}
	}

	function onCancel() {
		editorActive = false;
		currentQuestion = copyQuestion(question);
		showView();
	}

	function showView() {
		const onDelete = async index => {
			const loader = createOverlay();
			element.appendChild(loader);
			await removeQuestion(index, question.objectId);
		};
		render(viewTemplate(currentQuestion, index, onEdit, onDelete), element);
	}
	function showEditor() {
		render(editorTemplate(currentQuestion, index, onSave, onCancel), element);
	}
}

function copyQuestion(question) {
	const currentQuestion = Object.assign({}, question);
	currentQuestion.answers = currentQuestion.answers.slice();
	return currentQuestion;
}
