import { Command } from "./Command";
import { IMessageDisplay } from "./IMessageDisplay";

export class CommandDispatcher {

    private commands: Map<String, Command> = new Map();
    private prefix: string | undefined;
    private messageDisplay: IMessageDisplay;

    constructor(messageDisplay: IMessageDisplay, prefix?: string) {
        if (prefix) this.prefix = prefix;
        this.messageDisplay = messageDisplay;
    }

    public get commandsCount() {
        return this.commands.size;
    };

    public get commandList() {
        return Array.from(this.commands.values());
    }

    public add(command: Command) {
        if (this.commands.has(command.name)) {
            throw "Commande existante";
        }
        this.commands.set(command.name, command);
    }

    public handleMessage(message: string) {
        if (!this.isCorrectlyFormattedCommandName(message)) {
            return;
        }

        const commandName = this.extractCommandName(message);

        this.execute(commandName);
    }

    private execute(commandName: string) {
        if (!this.commands.has(commandName)) {
            return;
        }

        this.commands.get(commandName)?.action(this.messageDisplay);
    }

    private extractCommandName(message: string) {
        return message.slice(this.prefix?.length);
    }

    private isCorrectlyFormattedCommandName(message: string) {
        return !this.prefix || message.startsWith(this.prefix)
    }

}