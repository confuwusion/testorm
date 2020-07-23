import "reflect-metadata";
import {LogChannel} from "./structs/db/entities/LogChannels";
import {Connection, createConnection, getConnectionOptions} from "typeorm";
import {Subcommand} from "./structs/db/entities/Subcommands";
import {CacheProvider} from "./structs/db/CacheProvider";
import {Benchmark} from "./Benchmark";
import {initiateManager} from "./structs/db/DatabaseManager";

const lBr = `-`.repeat(50);

/**
 * Powers a number by 2
 *
 * @param param - Number to power by 2
 * @returns - Number powered by 2
 **/
function powTwo(param: number): number {
  return param ** 2;
}

console.log(`2 squared is`, powTwo(2));

(async function() {

  // const { cache } = await initiateManager();

  const opts = [ {
    name: `main`,
    type: `sqlite`,
    database: `./data/main.sql`,
    synchronize: true,
    logging: false,
    cache: true,
    migrations: [
      `src/migration/**/*.ts`
    ],
    subscribers: [
      `src/subscriber/**/*.ts`
    ],
    cli: {
      migrationsDir: `src/migration`,
      subscribersDir: `src/subscriber`
    }
  }, {
    name: `cache`,
    type: `sqlite`,
    database: `:memory:`,
    synchronize: true,
    logging: false,
    cache: true,
    migrations: [
      `src/migration/**/*.ts`
    ],
    subscribers: [
      `src/subscriber/**/*.ts`
    ],
    cli: {
      migrationsDir: `src/migration`,
      subscribersDir: `src/subscriber`
    }
  } ];

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

  const mainOptions = Object.assign(
    opts[0],
    connectionOptions
  );

  // CONNECTIONSi
  const mainConnection = await createConnection(mainOptions);


  console.log(`Create bruh LogChannel`, lBr);
  const modChannel = new LogChannel(`bruh`, `49398393`);

  const logRepo = mainConnection.getRepository(LogChannel.Entity);

  // console.log(`Log repository metadata`, logRepo.metadata);

  // console.log(`Clear all entries`);
  // await logRepo.clear();
  for (let i = 0; i < 2; ++i) {

    console.log(`Insert bruh LogChannel`, lBr);
    const insertBench = new Benchmark(true);
    await logRepo.save([ modChannel ]);
    insertBench
      .stop()
      .display(`Insertion took:`);


    console.log(`Get all LogChannels`, lBr);
    const allBench = new Benchmark(true);
    const allEntries = await logRepo.find();
    allBench
      .stop()
      .display(`Find all took:`);
    console.log(allEntries);

    console.log(`Update bruh LogChannel`, lBr);
    const updateBench = new Benchmark(true);
    await logRepo.update(
      { type: `bruh` },
      { channelID: `48848383` }
    );
    updateBench
      .stop()
      .display(`Update bruh took:`);

    console.log(`Get bruh LogChannel`, lBr);
    const bruhBench = new Benchmark(true);
    const bruhLog = await logRepo.findOne({
      where: { type: `bruh` },
      cache: true
    });
    bruhBench
      .stop()
      .display(`Find bruh took:`);
    console.log(bruhLog);

    console.log(`Delete bruh LogChannel`, lBr);
    const deleteBench = new Benchmark(true);
    await logRepo.delete({ type: `bruh` });
    deleteBench
      .stop()
      .display(`Delete bruh took:`);

  }
})();
