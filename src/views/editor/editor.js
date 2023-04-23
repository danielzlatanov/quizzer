import { editQuiz, createQuiz, getQuestionsByQuizId, getQuizById } from '../../api/data.js';
import { html, render } from '../../lib.js';
import { getUserData, topics } from '../../util.js';
import { createList } from './list.js';

const editorTemplate = (quiz, quizEditor, updateCount) => html`<section id="editor">
	<header class="pad-large">
		<h1>${quiz ? 'Edit Your Quiz' : 'New Quiz'}</h1>
	</header>

	${quizEditor} ${quiz ? createList(quiz.objectId, quiz.questions, updateCount) : ''}
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
				<option value="0">* Select category</option>
				${Object.entries(topics).map(
					([k, v]) =>
						html`<option ?selected=${quiz && quiz.topic == k} value=${k}>${v}</option>`
				)}
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

	${animation ? html`<div class="loading-overlay working"></div>` : ''}`;

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
		[quiz, questions] = await Promise.all([
			getQuizById(quizId),
			getQuestionsByQuizId(quizId, getUserData().id),
		]);
		quiz.questions = questions;
	}

	const { editor, updateEditor } = createQuizEditor(quiz, onSave);
	ctx.render(editorTemplate(quiz, editor, updateCount));

	async function updateCount(change = 0) {
		const count = questions.length + change;
		await editQuiz(quizId, { questionCount: count });
	}

	async function onSave(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const title = formData.get('title');
		const topic = formData.get('topic');
		const description = formData.get('description');

		if (!title || topic == '0' || !description) {
			return alert('Please fill in all fields for your quiz!');
		}

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
