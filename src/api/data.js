import { getUserData } from '../util.js';
import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoints = {
	quizClass: '/classes/Quiz',
	questionClass: '/classes/Question',
	solutionClass: '/classes/Solution',
};

function createPointer(name, id) {
	return {
		__type: 'Pointer',
		className: name,
		objectId: id,
	};
}

function setOwner(object) {
	const userId = getUserData().id;
	const res = Object.assign({}, object);
	res.owner = createPointer('_User', userId);
	return res;
}

//! Quiz Collection
export async function getQuizById(id) {
	return await api.get(endpoints.quizClass + '/' + id + '?include=owner');
}

export async function getQuizzes() {
	const response = await api.get(endpoints.quizClass);
	return response.results;
}

export async function getMostRecentQuiz() {
	const quiz = (await api.get(endpoints.quizClass + '?order=-createdAt&limit=1')).results[0];
	if (quiz) {
		const taken = await getSolutionsByQuizId(quiz.objectId);
		quiz.taken = taken.length;
	}
	return quiz;
}

export async function createQuiz(quiz) {
	const body = setOwner(quiz);
	return await api.post(endpoints.quizClass, body);
}

export async function editQuiz(id, quiz) {
	return await api.put(endpoints.quizClass + '/' + id, quiz);
}

export async function deleteQuiz(id) {
	return await api.del(endpoints.quizClass + '/' + id);
}

//! Question Collection
export async function getQuestionById(id) {
	return await api.get(endpoints.questionClass + '/' + id + '?include=owner');
}

export async function getQuestionsByQuizId(id, ownerId) {
	const query = JSON.stringify({
		quiz: createPointer('Quiz', id),
		owner: createPointer('_User', ownerId),
	});
	const response = await api.get(endpoints.questionClass + '?where=' + encodeURIComponent(query));
	return response.results;
}

export async function createQuestion(quizId, question) {
	const body = setOwner(question);
	body.quiz = createPointer('Quiz', quizId);
	return await api.post(endpoints.questionClass, body);
}

export async function editQuestion(id, question) {
	return await api.put(endpoints.questionClass + '/' + id, question);
}

export async function deleteQuestion(id) {
	return await api.del(endpoints.questionClass + '/' + id);
}

//! Solution Collection
export async function getSolutionsByUserId(userId) {
	const query = JSON.stringify({
		owner: createPointer('_User', userId),
	});
	const response = await api.get(endpoints.solutionClass + '?where=' + encodeURIComponent(query));
	return response.results;
}

export async function getSolutionsByQuizId(quizId) {
	const query = JSON.stringify({
		quiz: createPointer('Quiz', quizId),
	});
	const response = await api.get(endpoints.solutionClass + '?where=' + encodeURIComponent(query));
	return response.results;
}

export async function submitSolution(quizId, solution) {
	const body = setOwner(solution);
	body.quiz = createPointer('Quiz', quizId);
	return await api.post(endpoints.solutionClass, body);
}
