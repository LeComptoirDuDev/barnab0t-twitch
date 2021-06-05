import { IMessageDisplay } from "./IMessageDisplay";

export class Command {

    public name: string;
    public action: Function;
    public description: string;

    constructor(
        name: string,
        description: string,
        action: (messageDisplay: IMessageDisplay) => void,
    ) {
        this.name = name;
        this.action = action;
        this.description = description;
    }



}