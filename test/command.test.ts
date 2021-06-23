import { Command } from '../src/models/Command';
import { CommandDispatcher } from '../src/models/CommandDispatcher';
import { IMessageDisplay } from '../src/models/IMessageDisplay';

describe('Command', () => {

    it('should be created', () => {
        let actionResult = 0;
        const messageDisplay: IMessageDisplay = {
            displayMessage: (message: string, room?: string) => { }
        }
        const command = new Command('discord', '', (messageDisplay, username) => {
            actionResult = 1;
            messageDisplay.displayMessage(`hello ${username}`);
        });
        expect(command.name).toBe('discord');
        command.action(messageDisplay, 'minus');
        expect(actionResult).toBe(1);
    });

})

describe('Command Dispatcher without prefix', () => {

    let dispatcher: CommandDispatcher;
    let command1, command2: Command;
    let action1Result: number;
    let action2Result: number;
    let action1Username: string;
    const messageDisplay: IMessageDisplay = {
        displayMessage: (message, room) => { }
    }

    beforeEach(() => {
        action1Result = 0;
        action2Result = 0;
        action1Username = undefined;
        dispatcher = new CommandDispatcher(messageDisplay);
        command1 = new Command('aze', '', (messageDisplay, username) => {
            messageDisplay.displayMessage('aze');
            action1Username = username;
            action1Result++
        })
        command2 = new Command('azeaze', '', (messageDisplay, username) => {
            messageDisplay.displayMessage('azeaze');
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
        const command3 = new Command('aze', '', (messageDisplay) => { })
        expect(dispatcher.commandsCount).toBe(2);
        expect(() => {
            dispatcher.add(command3)
        }).toThrow("Commande existante");
    })

    it('can execute Command', () => {

        const myUsername = "minus";

        dispatcher.add(command1);
        dispatcher.add(command2);

        dispatcher.handleMessage("coucou", myUsername);
        expect(action1Result).toBe(0);
        expect(action2Result).toBe(0);

        dispatcher.handleMessage(command1.name, myUsername);
        expect(action1Result).toBe(1);
        expect(action2Result).toBe(0);
        expect(action1Username).toBe(myUsername);

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
    const messageDisplay: IMessageDisplay = {
        displayMessage: (room, message) => { }
    }

    beforeEach(() => {
        action1Result = 0;
        action2Result = 0;
        dispatcher = new CommandDispatcher(messageDisplay, PREFIX);
        command1 = new Command('aze', '', (messageDisplay) => {
            messageDisplay.displayMessage('Coucou c est aze');
            action1Result++
        })
        command2 = new Command('azeaze', '', (messageDisplay) => {
            messageDisplay.displayMessage('azeaze');
            action2Result++
        })
    })

    it('shouldn\'t execute Command without prefix', () => {
        dispatcher.add(command1);
        dispatcher.handleMessage(command1.name, '');
        expect(action1Result).toBe(0);
    })

    it('should execute Command with prefix', () => {
        dispatcher.add(command1);
        dispatcher.handleMessage(PREFIX + command1.name, '');
        expect(action1Result).toBe(1);
    })

    it('should execute Command with different case', () => {
        dispatcher.add(command1);
        dispatcher.handleMessage(PREFIX + command1.name.toUpperCase(), '');
        expect(action1Result).toBe(1);
    });


})