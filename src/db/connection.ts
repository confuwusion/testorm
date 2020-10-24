import { ConfiguredConnections, ConnectionConfig, EntityGroups } from "@db/config";
import { OptionsManager } from "@db/lib/managers/Options";
import { DatabaseManager } from "@db/lib/managers/Relational";
import { createConnection } from "typeorm";

/**
 * Connects to the database and prepares repositories and their cache
 *
 * @returns - The connection, repositories and database managers
 */
export async function initiateConnection(): Promise<InitiatedConnection> {
  const connections = await createConnections();
  const repositories = getEntityRepositories(connections);
  const db = createDatabaseManagers(connections, repositories);
  const botOptions = new OptionsManager(connections, repositories.BotOptions);

  await loadAllEntries(db);
  await botOptions.loadAllEntries();

  return { botOptions, db, repositories };
}

/**
 * @returns - Main and Cache connections
 */
async function createConnections(): Promise<ConfiguredConnections> {
  const [ mainConnection, cacheConnection ] = await Promise.all([
    createConnection(ConnectionConfig.main),
    createConnection(ConnectionConfig.cache)
  ]);

  return { main: mainConnection, cache: cacheConnection };
}

/**
 * Fetch repositories of registered Entities from the provided connection
 *
 * @param connection - The connection to fetch repositories from
 * @param connections
 * @returns - The repositories of the provided connection
 */
function getEntityRepositories(connections: ConfiguredConnections): EntityGroups.Repositories {
  const repoEntries = Object.entries(EntityGroups.config)
    .map(([ entityName, EntityClass ]) => [
      entityName,
      {
        main: connections.main.getRepository(EntityClass.Entity),
        cache: connections.cache.getRepository(EntityClass.Entity)
      }
    ]);

  return Object.fromEntries(repoEntries) as EntityGroups.Repositories;
}

/**
 * @param connections
 * @param repositories
 *
 * @returns - Database Managers
 */
function createDatabaseManagers(
  connections: ConfiguredConnections,
  repositories: EntityGroups.Repositories
): EntityGroups.Managers {
  return {
    ActionData: new DatabaseManager(
      connections,
      repositories.ActionData
    ),
    IFTTTWebhooks: new DatabaseManager(
      connections,
      repositories.IFTTTWebhooks
    ),
    LogChannels: new DatabaseManager(
      connections,
      repositories.LogChannels
    )
  } as const;
}

/**
 * @param db
 */
async function loadAllEntries(db: EntityGroups.Managers): Promise<void> {
  const entityEntries = Object.values(db)
    .map(async manager => manager.find());
  await Promise.all(entityEntries);
}


interface InitiatedConnection {
  botOptions: OptionsManager;
  db: EntityGroups.Managers;
  repositories: EntityGroups.Repositories;
}
