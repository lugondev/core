import { app } from "@arkecosystem/core-container";
import { flags } from "@oclif/command";
import deepmerge from "deepmerge";
import { CommandFlags } from "../../types";
import { getCliConfig } from "../../utils";
import { BaseCommand } from "../command";

export class RunCommand extends BaseCommand {
    public static description: string = "Run the core (without pm2)";

    public static examples: string[] = [
        `Run core
$ qlug core:run
`,
        `Run core as genesis
$ qlug core:run --networkStart
`,
        `Disable any discovery by other peers
$ qlug core:run --disableDiscovery
`,
        `Skip the initial discovery
$ qlug core:run --skipDiscovery
`,
        `Ignore the minimum network reach
$ qlug core:run --ignoreMinimumNetworkReach
`,
        `Start a seed
$ qlug core:run --launchMode=seed
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
        ...BaseCommand.flagsBehaviour,
        ...BaseCommand.flagsForger,
        suffix: flags.string({
            hidden: true,
            default: "core",
        }),
        env: flags.string({
            default: "production",
        }),
    };

    public async run(): Promise<void> {
        const { flags, paths } = await this.parseWithNetwork(RunCommand);

        await this.buildApplication(
            app,
            flags,
            deepmerge(getCliConfig(flags, paths), {
                exclude: [],
                options: {
                    "@arkecosystem/core-p2p": this.buildPeerOptions(flags),
                    "@arkecosystem/core-blockchain": {
                        networkStart: flags.networkStart,
                    },
                    "@arkecosystem/core-forger": await this.buildBIP38(flags),
                },
            }),
        );
    }
}
