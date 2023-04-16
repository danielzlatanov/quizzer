import { deleteQuestion } from '../../api/data.js';
import { html, render } from '../../lib.js';
import { createQuestion } from './question.js';

export const questionList = (questions, addQuestion) => html`
	<header class="q-pad-med">
		<h2>Questions</h2>
	</header>

	${questions}

	<article class="editor-question">
		<div class="editor-input">
			<button @click=${addQuestion} class="input submit action">
				<i class="fas fa-plus-circle"></i>
				Add question
			</button>
		</div>
	</article>
`;

export function createList(quizId, questions, updateCount) {
	const currentQuestions = questions.map(q =>
		createQuestion(quizId, q, removeQuestion, updateCount)
	);
	const element = document.createElement('div');
	element.className = 'pad-large alt-page gr';
	update();

	return element;

	function addQuestion() {
		questions.push({ text: '', answers: [], correctIndex: 0 });
		currentQuestions.push(
			createQuestion(
				quizId,
				{
					text: '',
					answers: [],
					correctIndex: 0,
				},
				removeQuestion,
				updateCount,
				true
			)
		);
		update();
	}

	function update() {
		render(
			questionList(
				currentQuestions.map((c, i) => c(i)),
				addQuestion
			),
			element
		);
	}

	async function removeQuestion(index, questionId) {
		const confirmed = confirm('Are you sure you want to delete this question?');
		if (confirmed) {
			if (questionId) {
				await deleteQuestion(questionId);
				updateCount(-1);
			}

			questions.splice(index, 1);
			currentQuestions.splice(index, 1);
			update();
		} else {
			const loader = document.querySelector('.loading-overlay.working');
			loader.remove();
		}
	}
}
