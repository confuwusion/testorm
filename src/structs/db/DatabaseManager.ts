import {Repository, Connection, createConnection, getConnectionOptions} from "typeorm";
import {LogChannel} from "./entities/LogChannels";
import {CacheManager} from "./CacheHandler";

interface Entries {
  LogChannels: LogChannel
}

type EntryRepositories = {
 [ Entry in keyof Entries ]: Repository<Entries[Entry]>;
}

type EntryCacheInstances = {
  [ Entry in keyof Entries ]: CacheManager<Entries[Entry]>;
}

export async function initiateManager() {

  const connectionOptions = {
    cache: {
      duration: 0

      /* provider(connection: Connection) {
        return new CacheProvider(connection);
      } */
    },
    entities: [
      LogChannel.Entity
    ]
  };

  // CONNECTION OPTIONS
  const mainOptions = Object.assign(
    await getConnectionOptions(`main`),
    connectionOptions
  );
  const cacheOptions = Object.assign(
    await getConnectionOptions(`cache`),
    connectionOptions
  );

  // CONNECTIONS
  const [ mainConnection, cacheConnection ] = await Promise.all([
    createConnection(mainOptions),
    createConnection(cacheOptions)
  ]);
  const connections = {
    main: mainConnection,
    cache: cacheConnection
  } as const;

  // REPOSITORIES
  const mainRepositories: EntryRepositories = Object.freeze({
    LogChannels: mainConnection
      .getRepository(LogChannel.Entity)
  });
  const cacheRepositories: EntryRepositories = Object.freeze({
    LogChannels: cacheConnection
      .getRepository(LogChannel.Entity)
  });
  const repositories = {
    cache: cacheRepositories,
    main: mainRepositories
  };

  // CACHE MANAGERS
  const cache: EntryCacheInstances = Object.freeze({
    LogChannels: new CacheManager(
      connections,
      repositories.main.LogChannels,
      repositories.cache.LogChannels
    )
  });

  async function loadAll() {
    return Promise.all(
      Object.values(cache)
        .map(entryCache => entryCache.find())
    );
  }

  const loadedEntries = await loadAll();

  return { cache, loadAll, loadedEntries, repositories };
}
