import { DatabaseManager } from "@db/lib/managers/Relational";
import { ActionData } from "@entities/ActionData";
import { BotOption } from "@entities/BotOptions";
import { IFTTTWebhook } from "@entities/IFTTTWebhooks";
import { LogChannel } from "@entities/LogChannels";
import { join } from "path";
import { Connection, ConnectionOptions, Repository } from "typeorm";

const DATA_FOLDER = join(__dirname, `../../data`);
const MAIN_DATABASE_FILENAME = `main`;
const DRIVER_NAME = `sqlite3`;

const MODE = process.env.MODE as keyof typeof dbPaths || `development`;

const dbPaths = {
  test: `:memory:` as string,
  development: generateDBPath(`dev`),
  production: generateDBPath(`main`)
} as const;

const entities = {
  ActionData,
  BotOptions: BotOption,
  IFTTTWebhooks: IFTTTWebhook,
  LogChannels: LogChannel
} as const;

const entityConfigs = Object.fromEntries(
  Object.entries(entities)
    .map(([ entityGroup, groupEntity ]) => [
      entityGroup as keyof typeof entities,
      {
        Entity: groupEntity.Entity
      }
    ])
) as EntityConfigs;

const baseConnctionConfig: Partial<ConnectionOptions> = {
  type: `sqlite`,
  cache: { duration: 0 },
  entities: Object.values(entityConfigs)
    .map(enityConfig => enityConfig.Entity),
  synchronize: true,
  logging: false,
  migrations: [ `src/migration/**/*.ts` ],
  subscribers: [ `src/subscriber/**/*.ts` ],
  cli: {
    entitiesDir: ``,
    migrationsDir: `src/migration`,
    subscribersDir: `src/subscriber`
  }
};

export namespace ConnectionConfig {

  export const main = {
    name: `main`,
    database: dbPaths[MODE],
    ...baseConnctionConfig
  } as ConnectionOptions;

  export const cache = {
    name: `cache`,
    database: `:memory:`,
    ...baseConnctionConfig
  } as ConnectionOptions;

}

/**
 * @param state
 *
 * @returns - Database path for selected state
 */
function generateDBPath(state: string): string {
  return `${DATA_FOLDER}/${state}/${DRIVER_NAME}-${MAIN_DATABASE_FILENAME}.sql`;
}

type EntityConfigs = {
  [K in keyof typeof entities]: {
    Entity: (typeof entities[K])["Entity"];
  }
};

export namespace EntityGroups {

  export const config = entityConfigs;

  export interface TypeE {
    ActionData: ActionData;
    LogChannels: LogChannel;
  }

  export type Type = {
    [ EntityGroup in keyof typeof entities]:
    InstanceType<(typeof entities)[EntityGroup]>
  };

  export type Managers = {
    [ EntityGroup in keyof Omit<EntityConfigs, "BotOptions"> ]:
    DatabaseManager<InstanceType<EntityConfigs[EntityGroup]["Entity"]>>
  };

  export type Repositories = {
    [ EntityGroup in keyof EntityConfigs ]: EntityRepository<EntityGroup>;
  };

  export interface EntityRepository<EntityGroup extends keyof EntityConfigs> {
    cache: Repository<InstanceType<EntityConfigs[EntityGroup]["Entity"]>>;
    main: Repository<InstanceType<EntityConfigs[EntityGroup]["Entity"]>>;
  }

}

export interface ConfiguredConnections {
  readonly main: Connection;
  readonly cache: Connection;
}
