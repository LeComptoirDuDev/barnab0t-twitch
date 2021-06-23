import { ImessageDisplayer } from "./ImessageDisplayer";

export class Command {

    public name: string;
    public action: Function;
    public description: string;

    constructor(
        name: string,
        description: string,
        action: (messageDisplayer: ImessageDisplayer) => void,
    ) {
        this.name = name;
        this.action = action;
        this.description = description;
    }



}