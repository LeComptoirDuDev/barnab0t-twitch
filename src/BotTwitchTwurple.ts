
import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { CommandDispatcher } from './models/CommandDispatcher';
import { IMessageDisplay } from './models/IMessageDisplay';

export default class BotTwitchTwurple implements IMessageDisplay {
  private chatClient: ChatClient
  private channel: string;

  constructor(staticAuthProvider: StaticAuthProvider, channel: string) {
    this.chatClient = new ChatClient({
      authProvider: staticAuthProvider,
      channels: [channel],
      isAlwaysMod: true
    });
    this.channel = channel;

    this.chatClient.connect().then(() => {
      console.log("twurple connecté");
    }).catch((e) => console.log('GROSSE ERREUR', e));
  }

  displayMessage(message: string, room?: string): void {
    let lines = message.split("\n");
    lines.forEach(line => this.chatClient.say(this.channel, line))
  }

  startListening(dispatcher: CommandDispatcher) {
    this.chatClient.onMessage((channel, user, message) => {
      dispatcher.handleMessage(message, user || '')
    })
    this.chatClient.onJoin((channel, user) => {
      console.log('Joining', user);
    })
  }


}
