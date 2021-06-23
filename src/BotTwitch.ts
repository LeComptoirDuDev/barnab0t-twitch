
import tmi, { ChatUserstate, Client } from 'tmi.js';
import bot_actions from './config/bot_actions.json';
import { CommandDispatcher } from './models/CommandDispatcher';
import { IMessageDisplay } from './models/IMessageDisplay';

interface Action {
  actionName: string;
  messages: string[];
}

interface ConfigBot {
  botname: string;
  oauth: string;
  channels: string[];
  endWords?: string[];
  debug?: boolean;
}

export default class BotTwitch implements IMessageDisplay {
  private client: Client;
  private actions: Action[] = [];
  private mainRoom: string;
  private endWords: string[];

  constructor(
    config: ConfigBot,
  ) {
    this.mainRoom = config.channels[0];
    this.client = tmi.Client({
      options: { debug: config.debug || false },
      connection: {
        secure: true,
        reconnect: true,
      },
      identity: {
        username: config.botname,
        password: config.oauth,
      },
      channels: config.channels,
    });

    this.client.connect().then(() => {
      console.log('Bot connecté avec succès');
    });

    this.actions = bot_actions;
    this.endWords = config.endWords || [];

  }

  public startListening(dispatcher: CommandDispatcher) {
    this.client.on('message', (channel, tags, message, self) => {
      if (self) return;
      dispatcher.handleMessage(message, tags['display-name'] || tags.username || '');
    });
  }

  displayMessage(message: string, room?: string) {

    let messages = message.split('\n');

    this.sendMultipleMessages(messages, room);
  }

  private sendMessage(message: string, room?: string) {
    room = room || this.mainRoom;

    this.client.say(
      room,
      '🤖 ' + message
    );
  }

  private sendMultipleMessages(messages: string[], room?: string) {
    let message = messages.shift();
    if (!message) return;
    if (messages.length === 0) {
      //Dernier message
      this.sendMessage(message + this.getEndWord(), room);
      return;
    }

    this.sendMessage(message, room);
    setTimeout(() => {
      this.sendMultipleMessages(messages, room);
    }, 100);
  }

  private getEndWord(): string {
    if (this.endWords.length === 0) return '';
    return ' ' + this.endWords[Math.floor(Math.random() * this.endWords.length)];
  }

  getActions(): Action[] {
    return this.actions;
  }


  doAction(actionName: string) {
    const action = this.actions.filter((a) => a.actionName === actionName)[0];
    if (!action) return;
    this.sendMultipleMessages([...action.messages]);
  }
}
