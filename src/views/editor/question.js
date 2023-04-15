import { html, render } from '../../lib.js';

const editQuestionTemplate = (data, index) => html`<div class="layout">
		<div class="question-control">
			<button class="input submit action"><i class="fas fa-check-double"></i> Save</button>
			<button class="input submit action"><i class="fas fa-times"></i> Cancel</button>
		</div>
		<h3>Question ${index}</h3>
	</div>
	<form>
		<textarea
			class="input editor-input editor-text"
			name="text"
			placeholder="Enter question"
			.value=${data.text}></textarea>

		${data.answers.map((a, answerIndex) =>
			radioEdit(index, answerIndex, a, data.correctIndex == answerIndex)
		)}
		<div class="editor-input">
			<button class="input submit action">
				<i class="fas fa-plus-circle"></i>
				Add answer
			</button>
		</div>
	</form>`;

const radioEdit = (questionIndex, answerIndex, value, checked) => html`<div class="editor-input">
	<label class="radio">
		<input
			class="input"
			type="radio"
			name=${`question-${questionIndex}`}
			value=${answerIndex}
			?checked=${checked} />
		<i class="fas fa-check-circle"></i>
	</label>

	<input class="input" type="text" name=${`answer-${answerIndex}`} .value=${value} />
	<button class="input submit action">
		<i class="fas fa-trash-alt"></i>
	</button>
</div>`;

const viewTemplate = (data, index) => html`
	<div class="layout">
		<div class="question-control">
			<button class="input submit action"><i class="fas fa-edit"></i> Edit</button>
			<button class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
		</div>
		<h3>Question ${index}</h3>
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

export function createQuestion(question, index, editActive) {
	const element = document.createElement('article');
	element.className = 'editor-question';

	if (editActive) {
		render(editQuestionTemplate(question, index), element);
	} else {
		render(viewTemplate(question, index), element);
	}

	return element;
}
