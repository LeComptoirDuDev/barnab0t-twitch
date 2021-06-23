import { Command } from '../src/models/Command';
import { CommandDispatcher } from '../src/models/CommandDispatcher';
import { ImessageDisplayer } from '../src/models/ImessageDisplayer';

describe('Command', () => {

    it('should be created', () => {
        let actionResult = 0;
        const command = new Command('discord', '', () => { actionResult = 1 });
        expect(command.name).toBe('discord');
        command.action();
        expect(actionResult).toBe(1);
    });

})

describe('Command Dispatcher without prefix', () => {

    let dispatcher: CommandDispatcher;
    let command1, command2: Command;
    let action1Result: number;
    let action2Result: number;
    const messageDisplayer: ImessageDisplayer = {
        displayMessage: (message, room) => { }
    }

    beforeEach(() => {
        action1Result = 0;
        action2Result = 0;
        dispatcher = new CommandDispatcher(messageDisplayer);
        command1 = new Command('aze', '', (messageDisplayer) => {
            messageDisplayer.displayMessage('aze');
            action1Result++
        })
        command2 = new Command('azeaze', '', (messageDisplayer) => {
            messageDisplayer.displayMessage('azeaze');
            action2Result++
        })
    })

    it('should be created', () => {
        expect(dispatcher.commandsCount).toBe(0);
    });

    it('can add Commands', () => {
        dispatcher.add(command1);
        expect(dispatcher.commandsCount).toBe(1);
        dispatcher.add(command2);
        const command3 = new Command('aze', '', (messageDisplayer) => { })
        expect(dispatcher.commandsCount).toBe(2);
        expect(() => {
            dispatcher.add(command3)
        }).toThrow("Commande existante");
    })

    it('can execute Command', () => {
        dispatcher.add(command1);
        dispatcher.add(command2);

        dispatcher.handleMessage("coucou");
        expect(action1Result).toBe(0);
        expect(action2Result).toBe(0);

        dispatcher.handleMessage(command1.name);
        expect(action1Result).toBe(1);
        expect(action2Result).toBe(0);
    })

    it('should list all registered Commands', () => {
        dispatcher.add(command1);
        dispatcher.add(command2);

        const commands = [
            command1,
            command2
        ]

        expect(dispatcher.commandList).toEqual(commands);
    })

})

describe('Command Dispatcher with prefix', () => {

    let dispatcher: CommandDispatcher;
    let command1, command2: Command;
    let action1Result: number;
    let action2Result: number;
    const PREFIX = '!';
    const messageDisplayer: ImessageDisplayer = {
        displayMessage: (room, message) => { }
    }

    beforeEach(() => {
        action1Result = 0;
        action2Result = 0;
        dispatcher = new CommandDispatcher(messageDisplayer, PREFIX);
        command1 = new Command('aze', '', (messageDisplayer) => {
            messageDisplayer.displayMessage('Coucou c est aze');
            action1Result++
        })
        command2 = new Command('azeaze', '', (messageDisplayer) => {
            messageDisplayer.displayMessage('azeaze');
            action2Result++
        })
    })

    it('shouldn\'t execute Command without prefix', () => {
        dispatcher.add(command1);
        dispatcher.handleMessage(command1.name);
        expect(action1Result).toBe(0);
    })

    it('should execute Command with prefix', () => {
        dispatcher.add(command1);
        dispatcher.handleMessage(PREFIX + command1.name);
        expect(action1Result).toBe(1);
    })

    it('should execute Command with different case', () => {
        dispatcher.add(command1);
        dispatcher.handleMessage(PREFIX + command1.name.toUpperCase());
        expect(action1Result).toBe(1);
    })




})