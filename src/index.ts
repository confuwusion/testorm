import "dotenv";
import "reflect-metadata";

import { MAIN_CHANNELS } from "@constants";
import { initiateConnection } from "@db/connection";
import { DatabaseManager } from "@db/lib/managers/Relational";
import { LogChannel } from "@entities/LogChannels";
import { Benchmark } from "@util/Benchmark";

import { Logger } from "./structs/Logger";

const logger = new Logger(`Database`);
const modChannel = new LogChannel(`bruh`, MAIN_CHANNELS.MAIN);

main()
  .catch(console.error);

/**
 * Program's entry point
 */
async function main(): Promise<void> {
  const { db, botOptions } = await initiateConnection();

  const logs = db.LogChannels;

  // Run benchmarks twice to check for corresponding queries
  for (let i = 0; i < 2; ++i) {
    await benchmarkQueries(logs);
  }

  logger.print(await botOptions.get(`pingRecord`));
  logger.print(await botOptions.get(`lastActive`));
  logger.print(await botOptions.update(`lastActive`, Date.now()));
}


/**
 * @param logs - The log repository
 * @param modChannel
 *
 * @returns
 */
async function benchmarkQueries(logs: LogChannelManager): Promise<void> {
  await benchmark(`INSERT`, `bruh LogChannel`, insertLogChannel)(logs);

  await benchmark(`FIND`, `all LogChannel`, getAllLogChannels)(logs);

  await benchmark(`UPDATE`, `bruh LogChannel`, updateLogChannel)(logs);

  await benchmark(`FIND`, `bruh LogChannel`, findLogChannel)(logs);

  await benchmark(`DELETE`, `bruh LogChannel`, deleteLogChannel)(logs);
}

/**
 * @param title
 * @param description
 * @param functionToBenchmark
 * @returns - Function being benchmarked
 */
function benchmark(
  title: string,
  description: string,
  functionToBenchmark: LogQueries
): typeof functionToBenchmark {
  const benchmarker = new Benchmark(title);

  return async function(logs: Parameters<typeof functionToBenchmark>[0]) {
    benchmarker.start();
    await functionToBenchmark(logs);
    benchmarker
      .stop()
      .display(`${description} took:`);
  };
}

/**
 * @param logs
 */
async function deleteLogChannel(logs: LogChannelManager) {
  await logs.delete({ type: `bruh` });
}

/**
 * @param logs
 */
async function findLogChannel(logs: LogChannelManager) {
  const bruhLog = await logs.find({ type: `bruh` });
  logger.print(bruhLog);
}

/**
 * @param logs
 */
async function updateLogChannel(logs: LogChannelManager) {
  await logs.update({ type: `bruh` }, { channelID: MAIN_CHANNELS.QOTD });
}

/**
 * @param logs
 * @param modChannel
 */
async function insertLogChannel(logs: LogChannelManager) {
  await logs.save(modChannel);
}

/**
 * @param logs
 */
async function getAllLogChannels(logs: LogChannelManager) {
  const allEntries = await logs.find();
  logger.print(allEntries);
}

type LogQueries = typeof insertLogChannel | typeof getAllLogChannels | typeof updateLogChannel | typeof findLogChannel | typeof deleteLogChannel;
type LogChannelManager = DatabaseManager<LogChannel>;
