import { app } from "@arkecosystem/core-container";
import { flags } from "@oclif/command";
import deepmerge from "deepmerge";
import { CommandFlags } from "../../types";
import { getCliConfig } from "../../utils";
import { BaseCommand } from "../command";

export class RunCommand extends BaseCommand {
    public static description: string = "Run the relay (without pm2)";

    public static examples: string[] = [
        `Run a relay
$ qlug relay:run
`,
        `Run a genesis relay
$ qlug relay:run --networkStart
`,
        `Disable any discovery by other peers
$ qlug relay:run --disableDiscovery
`,
        `Skip the initial discovery
$ qlug relay:run --skipDiscovery
`,
        `Ignore the minimum network reach
$ qlug relay:run --ignoreMinimumNetworkReach
`,
        `Start a seed
$ qlug relay:run --launchMode=seed
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
        ...BaseCommand.flagsBehaviour,
        suffix: flags.string({
            hidden: true,
            default: "relay",
        }),
        env: flags.string({
            default: "production",
        }),
    };

    public async run(): Promise<void> {
        const { flags, paths } = await this.parseWithNetwork(RunCommand);

        await super.buildApplication(
            app,
            flags,
            deepmerge(getCliConfig(flags, paths), {
                exclude: ["@arkecosystem/core-forger"],
                options: {
                    "@arkecosystem/core-p2p": this.buildPeerOptions(flags),
                    "@arkecosystem/core-blockchain": {
                        networkStart: flags.networkStart,
                    },
                },
            }),
        );
    }
}
