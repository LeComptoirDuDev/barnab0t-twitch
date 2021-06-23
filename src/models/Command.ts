import { IMessageDisplay } from "./IMessageDisplay";

export class Command {

    public name: string;
    public action: (messageDisplay: IMessageDisplay, username: string) => void;
    public description: string;

    constructor(
        name: string,
        description: string,
        action: (messageDisplay: IMessageDisplay, username: string) => void,
    ) {
        this.name = name;
        this.action = action;
        this.description = description;
    }



}