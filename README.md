# Quizzer
Quizzer is a single-page application - a system for creating, managing, and filling out quizzes.

## Getting started

**You can access the deployed application by clicking here: [Quizzer](https://quizzer-spa.netlify.app/)**

_If you wish to run Quizzer **locally**:_

- No need to install any dependencies! All libraries are imported from CDN.
- Simply open the **root** of the project and start `index.html` using a server of your choice.

## Functionality
* User registration
* Ability to view and solve quizzes created by other users
* Various topics related to quizzes
* Keeping statistics for each user/quiz/question/solution
* Interactive quiz editor
* Pleasant UX

## Technologies
* HTML, CSS, Javascript
* lit-html, page.js - *(libraries)*
* Netlify *(deployment platform)*, Back4app *(BaaS platform)*

## Views
* **Welcome/Home page** - initial screen, info about total quizzes and topics, the most recent quiz is shown
* **Login/Register page** - register with email, username and password
* **Browse quizzes page** - list of all created quizzes, each one can be accessed
* **Quiz Details page** - additional description, quiz statistics, author information and start the quiz button
* **Quiz Contest mode** - answering questions, each question is in a separate view, the ability to move freely from question to question, answers are kept throughout, can restart the quiz, submit answers button appears either on the last question or when the quiz is filled out entirely *(checks and warns about unfilled questions)*
* **Quiz Results page** - results summary, ability to review wrong questions and see correct answers
* **Profile page** - information about user's created quizzes and his solutions *(date, quiz title, score)*
* **Create page** - the ability to create a new quiz prior to the editor, top 3 most popular quizzes are shown *(sorted by solutions count)*
* **Quiz Editor** - integrated editor for quizzes, questions, and answers with proper validation

## Access control
* Guests can register, view the catalog, and quiz details
* Registered users can solve quizzes, view their results, and create/edit quizzes
* Only the creator of a given quiz can edit or delete it
* Any registered user can solve someone else's quiz

## Implementation
#### Data structure & Back4app collections
* Roles *(private)*
```javascript
{
     name: String,
     users: Relation<User>,
     roles: Relation<Role>
}
```
* Sessions *(private)*
```javascript
{
     user: Pointer<User>
}
```
* Users *(private)*
```javascript
{
     email: String,
     username: String,
     password: String(hidden)
}
```
* Questions
```javascript
{
     text: String,
     answers: Array<String>,
     correctIndex: Number,
     quiz: Pointer<Quiz>,
     owner: Pointer<User>
}
```
* Quizzes
```javascript
{
     title: String,
     topic: String,
     description: String,
     questionCount: Number,
     owner: Pointer<User>
}
```
* Solutions
```javascript
{
     title: String,
     correct: Number,
     total: Number,
     quiz: Pointer<Quiz>,
     owner: Pointer<User>
}
```
### Basic app flowchart
![quizzer-spa(1)(1)](https://github.com/danielzlatanov/quizzer-spa/assets/110429874/226877e5-412c-4fdb-b6b6-07c83a5b0b0a)

## Access the app [here](https://quizzer-spa.netlify.app/)
<img width="1424" alt="quizzer-preview" src="https://github.com/danielzlatanov/quizzer-spa/assets/110429874/64d5f81e-74a0-4e69-91f3-c647bf4d2e5b">
