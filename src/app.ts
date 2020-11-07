import Server from './Server';
import SocketsHolder from './SocketsHolder';
import QuestionsList from './QuestionsList';
import { Question } from './models/Question.model';
import config from './config/config.json';
import Bot from './Bot';

const serveur = new Server(config.server.port);
const io = SocketsHolder.getInstance(serveur.http);
const bot = new Bot(config.botTwitch);


serveur.addRouteGet('/actions', (req, res) => {
  res.send(JSON.stringify(bot.getActions().map(a => a.actionName)));
});

serveur.addRouteGet('/overlay-question/:position?', (req, res) => {
  res.render('overlay_question.ejs', {
    position: req.params.position || 'bottom',
  });
});

serveur.addRouteGet('/flush', (req, res) => {
  QuestionsList.flush();
  res.send('done.');
});

serveur.addRouteGet('/action/:actionName', (req, res) => {
  bot.doAction(req.params.actionName);
  res.send('done.');
});

io.onConnection((socket) => {
  socket.emit('UpdateListeQuestion', QuestionsList.getQuestionsList());
  socket.emit('UpdateQuestionActive', QuestionsList.getActiveQuestion());
});

/// Events from remote
io.onEvent('addQuestion', (question: Question) => {
  QuestionsList.addQuestion(question);
});
io.onEvent('displayQuestion', (question: Question) => {
  QuestionsList.setActiveQuestion(question.id);
});
io.onEvent('hideQuestion', () => {
  QuestionsList.setActiveQuestion(QuestionsList.DESACTIVATE_ALL);
});

/// Events from store
QuestionsList.subscribeListUpdate((liste) => {
  io.emit('UpdateListeQuestion', liste);
});
QuestionsList.subscribeActive((question) => {
  io.emit('UpdateQuestionActive', question);
});

/// Events from twitch bot

bot.onMessageReceived(
  (message) => message.startsWith('?'),
  (message, tags, channel) => {
    QuestionsList.addQuestion({
      author: tags['display-name'],
      content: message.substring(1),
    });
    bot.sendMessage(
      channel,
      `@${tags['display-name']} Question prise en compte`, 
      true
    );
  }
);

/// Start server and enjoy !

serveur.start();
