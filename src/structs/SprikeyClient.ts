import { Client, Collection, Guild } from "discord.js";
import { Categories, Command } from "./typedefs/Command";
import {Connection, Repository} from "typeorm";
import {LogChannel} from "./db/entities/LogChannels";
import {ActionData} from "./db/entities/ActionData";
import {BotOption} from "./db/entities/BotOptions";
import {Lockout} from "./db/entities/Lockouts";
import {MAIN_GUILD_ID, TEST_GUILD_ID} from "../constants";

interface DataInstanceTypes {
  ActionData: Repository<ActionData>,
  BotOptions: Repository<BotOption>,
  Lockouts: Repository<Lockout>,
  LogChannels: Repository<LogChannel>
}

export class SprikeyClient extends Client {

  readonly client: Client = this;
  readonly data: DataInstanceTypes;

  readonly categories: Collection<Categories, this["commands"]>;
  readonly commands: Collection<string, Command>;

  eventState: boolean = false;

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

    this.data = {
      ActionData: connection.getRepository(ActionData),
      BotOptions: connection.getRepository(BotOption),
      Lockouts: connection.getRepository(Lockout),
      LogChannels: connection.getRepository(LogChannel)
    };

    this.categories = new Collection(
      Object.keys(Categories).map(category => [
        Categories[category as (keyof typeof Categories)],
        new Collection()
      ])
    );
    this.commands = new Collection();
  }

  get MAIN_GUILD(): Guild {
    return this.guilds.cache.get(MAIN_GUILD_ID);
  }

  get TEST_GUILD(): Guild {
    return this.guilds.cache.get(TEST_GUILD_ID);
  }
}
