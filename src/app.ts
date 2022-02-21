import { accessToken, clientId } from './config/config_twurple.json';
import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { Command } from './models/Command';
import { CommandDispatcher } from './models/CommandDispatcher';
import BotTwitchTwurple from './BotTwitchTwurple';


const authTwurpleProvider = new StaticAuthProvider(
  clientId,
  accessToken
);

const apiClient = new ApiClient({ authProvider: authTwurpleProvider });
apiClient.users.getUserByName('LeComptoirDuDev_').then((payload) => console.log(payload));




const botTwitch = new BotTwitchTwurple(authTwurpleProvider, "LeComptoirDuDev_")


const commandDispatcherTwitch = new CommandDispatcher(botTwitch, "!");


const commandCoucou = new Command("coucou", "", (messageDisplay, username) => {
  messageDisplay.displayMessage(`Hey mais salut @${username} !`)
});

const commandCoucouille = new Command("coucouille", "", (messageDisplay, username) => {
  if (username !== "Encoore")
    return;
  messageDisplay.displayMessage(`Coucouille à toi aussi @${username}`);
})

const commandDiscord = new Command("discord", "donne le lien vers discord", (messageDisplay) => {
  messageDisplay.displayMessage(`https://comptoirdudev.fr/discord
  Rejoignez nous !`)
});

const commandSocials = new Command("socials", "liste des réseaux sociaux", (messageDisplay) => {
  messageDisplay.displayMessage(`Followez Nous ! 🐦 twitter.com/comptoirdudev_
  Suivez Nous ! 🤝 https://www.linkedin.com/company/le-comptoir-du-dev
  Pour les replays ! ▶ comptoirdudev.fr/youtube
  La communauté ! 🖐 comptoirdudev.fr/discord`)
});

const commandGithub = new Command("github", "obtenir le lien vers le github du Comptoir du dev_", (messageDisplay) => {
  messageDisplay.displayMessage("https://github.com/LeComptoirDuDev")
});

const commandTeam = new Command("team", "obtenir des infos sur les tenanciers du Comptoir !", (messageDisplay) => {
  messageDisplay.displayMessage(`Pierre: dev full stack
  Virgil: dev front
  Sylvain : chef de projet mais technique
  `);
})

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
commandDispatcherTwitch.add(commandSocials);
commandDispatcherTwitch.add(commandGithub);
commandDispatcherTwitch.add(commandCoucouille);
commandDispatcherTwitch.add(commandTeam);

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

// serveur.start();