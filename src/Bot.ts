// import { client } from 'tmi.js';
// const tmi = require('tmi.js');
import tmi, { ChatUserstate, Client } from 'tmi.js';
import bot_actions from './config/bot_actions.json';

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

export default class Bot {
  private client: Client;
  private actions: Action[] = [];
  private mainChannel: string;
  private endWords: string[];

  constructor(
    config: ConfigBot
  ) {
    this.mainChannel = config.channels[0];
    this.client = tmi.Client({
      options: { debug: config.debug || false  },
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
  

  onMessageReceived(
    filter: (message: string) => boolean,
    action: (message: string, tags: ChatUserstate, channel: string) => void
  ) {
    this.client.on('message', (channel, tags, message, self) => {
      if (self) return; // éviter les boucles de messages
      if (!filter(message)) return;
      action(message, tags, channel);
    });
  }

  sendMessage(channel: string, message: string, endWord = false) {
    this.client.say(
      channel,
      '🤖 ' + message + (endWord ? this.getEndWord() : '')
    );
  }

  doAction(actionName: string) {
    const action = this.actions.filter((a) => a.actionName === actionName)[0];
    if (!action) return;
    this.sendMultipleMessages([...action.messages]);
  }

  private sendMultipleMessages(messages: string[]) {
    let message = messages.shift();
    if (!message) return;
    if(messages.length === 0) {
      //Dernier message
      this.sendMessage(this.mainChannel, message + this.getEndWord());
      return;
    }

    this.sendMessage(this.mainChannel, message);
    setTimeout(() => {
      this.sendMultipleMessages(messages);
    }, 2000);
  }

  private getEndWord(): string {
    if(this.endWords.length === 0) return '';
    return ' ' + this.endWords[Math.floor(Math.random() * this.endWords.length)];
  }

  getActions(): Action[] {
    return this.actions;
  }
}
