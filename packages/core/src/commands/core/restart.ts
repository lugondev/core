import { AbstractRestartCommand } from "../../shared/restart";
import { CommandFlags } from "../../types";
import { BaseCommand } from "../command";

export class RestartCommand extends AbstractRestartCommand {
    public static description: string = "Restart the core";

    public static examples: string[] = [
        `Restart the core
$ qlug core:restart
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
    };

    public getClass() {
        return RestartCommand;
    }

    public getSuffix(): string {
        return "core";
    }
}
