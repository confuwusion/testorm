import { GUILD } from "@constants";
import { Client, Collection, Guild } from "discord.js";
import { Connection } from "typeorm";

import { Categories, Command } from "./typedefs/Command";

export class SprikeyClient extends Client {

  readonly categories: Collection<Categories, this["commands"]>;

  readonly commands: Collection<string, Command>;

  eventState = false;

  constructor(readonly connection: Connection) {
    super({
      partials: [
        `MESSAGE`,
        `REACTION`,
        `GUILD_MEMBER`,
        `USER`
      ],
      presence: {
        status: `idle`,
        activity: {
          name: `Initiating bot...`
        }
      }
    });

    this.categories = new Collection(
      Object.keys(Categories).map(category => [
        Categories[category as (keyof typeof Categories)],
        new Collection()
      ])
    );
    this.commands = new Collection();
  }

  get MAIN_GUILD(): Guild {
    return this.guilds.cache.get(GUILD.MAIN);
  }

  get TEST_GUILD(): Guild {
    return this.guilds.cache.get(GUILD.TEST);
  }
}
