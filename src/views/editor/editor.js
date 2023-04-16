import { editQuiz, createQuiz, getQuestionsByQuizId, getQuizById } from '../../api/data.js';
import { html, render } from '../../lib.js';
import { createList } from './list.js';

const editorTemplate = (quiz, quizEditor) => html`<section id="editor">
	<header class="pad-large">
		<h1>${quiz ? 'Edit Your Quiz' : 'New Quiz'}</h1>
	</header>

	${quizEditor} ${quiz ? createList(quiz.objectId, quiz.questions) : ''}
</section>`;

const quizEditor = (quiz, onSave, animation) => html`<form @submit=${onSave}>
		<label class="editor-label layout">
			<span class="label-col">Title</span>
			<input
				class="input i-med"
				type="text"
				name="title"
				.value=${quiz ? quiz.title : ''}
				?disabled=${animation}
		/></label>
		<label class="editor-label layout">
			<span class="label-col">Topic</span>
			<select
				class="input i-med"
				name="topic"
				.value=${quiz ? quiz.topic : '0'}
				?disabled=${animation}>
				<option value="0"><span class="quiz-meta">* Select category</span></option>
				<option value="it">Languages</option>
				<option value="hardware">Hardware</option>
				<option value="software">Tools and Software</option>
			</select>
		</label>
		<label class="editor-label layout">
			<span class="label-col">Description</span>
			<textarea
				class="input i-med"
				type="text"
				name="description"
				.value=${quiz ? quiz.description : ''}
				?disabled=${animation}></textarea>
		</label>
		<input
			class="input submit action"
			type="submit"
			value=${quiz ? 'Save' : 'Continue'}
			?disabled=${animation} />
	</form>

	${animation ? html`` : ''}`;

function createQuizEditor(quiz, onSave) {
	const editor = document.createElement('div');
	editor.className = 'pad-large alt-page gr';
	update();

	return { editor, updateEditor: update };

	function update(animation) {
		render(quizEditor(quiz, onSave, animation), editor);
	}
}

export async function editorPage(ctx) {
	const quizId = ctx.params.id;
	let quiz = null;
	let questions = [];
	if (quizId) {
		[quiz, questions] = await Promise.all([getQuizById(quizId), getQuestionsByQuizId(quizId)]);
		quiz.questions = questions;
	}

	const { editor, updateEditor } = createQuizEditor(quiz, onSave);
	ctx.render(editorTemplate(quiz, editor));

	async function onSave(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const title = formData.get('title');
		const topic = formData.get('topic');
		const description = formData.get('description');
		const data = {
			title,
			topic,
			description,
			questionCount: questions.length,
		};

		try {
			updateEditor(true);
			if (quizId) {
				await editQuiz(quizId, data);
			} else {
				const res = await createQuiz(data);
				ctx.page.redirect('/edit/' + res.objectId);
			}
		} catch (err) {
			alert(err.message);
		} finally {
			updateEditor(false);
		}
	}
}
