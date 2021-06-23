import { Command } from "./Command";
import { ImessageDisplayer } from "./ImessageDisplayer";

export class CommandDispatcher {

    private commands: Map<String, Command> = new Map();
    private prefix: string | undefined;
    private messageDisplayer: ImessageDisplayer;

    constructor(messageDisplayer: ImessageDisplayer, prefix?: string) {
        if (prefix) this.prefix = prefix;
        this.messageDisplayer = messageDisplayer;
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
        this.commands.set(this.normalizeCommandName(command.name), command);
    }

    public handleMessage(message: string) {
        if (!this.isCorrectlyFormattedCommandName(message)) {
            return;
        }

        const commandName = this.extractCommandName(message);

        this.execute(commandName);
    }

    private execute(commandName: string) {
        const normalizedCommandName = this.normalizeCommandName(commandName);

        if (!this.commands.has(normalizedCommandName)) {
            return;
        }

        this.commands.get(normalizedCommandName)?.action(this.messageDisplayer);
    }

    private normalizeCommandName(commandName: string) {
        return commandName.toLowerCase();
    }

    private extractCommandName(message: string) {
        return message.slice(this.prefix?.length);
    }

    private isCorrectlyFormattedCommandName(message: string) {
        return !this.prefix || message.startsWith(this.prefix)
    }

}