import Server from './Server';
import SocketsHolder from './SocketsHolder';
import QuestionsList from './QuestionsList';
import { Question } from './models/Question.model';
import config from './config/config.json';
import BotTwitch from './BotTwitch';
import { Request, Response } from 'express';
import { CommandDispatcher } from './models/CommandDispatcher';
import { Command } from './models/Command';
import { IMessageDisplay } from './models/IMessageDisplay';

const serveur = new Server(config.server.port);
const io = SocketsHolder.getInstance(serveur.http);


// serveur.addRouteGet('/actions', (req: Request, res: Response) => {
//   res.send(JSON.stringify(bot.getActions().map(a => a.actionName)));
// });

serveur.addRouteGet('/overlay-question/:position?', (req: Request, res: Response) => {
  res.render('overlay_question.ejs', {
    position: req.params.position || 'bottom',
  });
});

serveur.addRouteGet('/flush', (req: Request, res: Response) => {
  QuestionsList.flush();
  res.send('done.');
});

// serveur.addRouteGet('/action/:actionName', (req: Request, res: Response) => {
//   bot.doAction(req.params.actionName);
//   res.send('done.');
// });

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



/// Register commands for twitch

const botTwitch = new BotTwitch(config.botTwitch);


const commandDispatcherTwitch = new CommandDispatcher(botTwitch, "!");



const commandCoucou = new Command("coucou", "", (messageDisplay) => {
  messageDisplay.displayMessage("Hey mais salut toi !")
});

const commandDiscord = new Command("discord", "donne le lien vers discord", (messageDisplay) => {
  messageDisplay.displayMessage(`https://comptoirdudev.fr/discord
  Rejoignez nous !`)
});

const commandHelp = new Command("help", "Affiche les commandes disponibles", (messageDisplay) => {
  let message = commandDispatcherTwitch
    .commandList
    .filter(command => command.description)
    .reduce((acc, command) => {
      return acc += `!${command.name} - ${command.description}\n`
    }, "Liste des commandes : \n")

  messageDisplay.displayMessage(message);
})

commandDispatcherTwitch.add(commandCoucou);
commandDispatcherTwitch.add(commandDiscord);
commandDispatcherTwitch.add(commandHelp);

botTwitch.startListening(commandDispatcherTwitch);














/// Events from twitch bot

// bot.onMessageReceived(
//   (message) => message.startsWith('?'),
//   (message, tags, channel) => {
// QuestionsList.addQuestion({
//   author: tags['display-name'],
//   content: message.substring(1),
// });
//     bot.sendMessage(
//       channel,
//       `@${tags['display-name']} Question prise en compte`,
//       true
//     );
//   }
// );



/// Start server and enjoy !

serveur.start();
