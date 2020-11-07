const socket = io();

let questionsDOM = document.querySelector('#questionsList');
let tagDOM = document.querySelector('#tag');
let contentDOM = document.querySelector('#content');
let activeQuestionId = -1;
  

socket.on('UpdateListeQuestion', (liste) => {
  console.log(liste);
  questionsDOM.innerHTML = '';
  liste.forEach((q) => generateQuestionDOM(q));
  questionsDOM.scrollTo(0, questionsDOM.scrollHeight);
  setLiActive();

});

socket.on('UpdateQuestionActive', (question) => {
  document
    .querySelectorAll('[data-id-question]')
    .forEach((li) => li.classList.remove('active'));
  activeQuestionId = question.id;
  setLiActive();
});

function setLiActive() {
  let li = document.querySelector(`[data-id-question='${activeQuestionId}']`);
  if (li) {
    li.classList.add('active');
  }
}


function generateQuestionDOM(question) {
  let li = document.createElement('li');
  li.dataset.idQuestion = question.id;
  let texte = document.createElement('div');
  let tag = document.createElement('span');
  tag.classList.add('tag');
  tag.innerHTML = question.author;
  let content = document.createElement('span');
  content.classList.add('content');
  content.innerHTML = question.content;

  texte.addEventListener('click', () => {
    if (!li.classList.contains('active'))
      socket.emit('displayQuestion', question);
    else socket.emit('hideQuestion', question);
  });

  texte.appendChild(tag);
  texte.appendChild(content);
  li.appendChild(texte);

  questionsDOM.appendChild(li);
}



/// Génération des actions

let actionsDOM = document.querySelector('#actionsList');


fetch('/actions').then((actions) => {
  return actions.json();
}).then((actions) => {
  console.log(actions);
  actions.forEach(action => {
    let li = document.createElement('li');
    li.innerHTML = action;
    li.addEventListener('click', () => {
      li.classList.add('active');
      fetch(`/action/${action}`).then(() => {
        li.classList.remove('active');
      })
    })
    actionsDOM.appendChild(li);
  })
})