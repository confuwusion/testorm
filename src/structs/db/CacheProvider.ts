import {QueryResultCache} from "typeorm/cache/QueryResultCache";
import {Connection, QueryRunner} from "typeorm";
import {QueryResultCacheOptions} from "typeorm/cache/QueryResultCacheOptions";

export class CacheProvider implements QueryResultCache {

  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async connect() {
    return;
  }

  async disconnect() {
    return;
  };

  async synchronize(queryRunner?: QueryRunner) {
    this;
    console.log(`\n> cache.synchronize`);
    return void queryRunner;
  };

  async clear(queryRunner: QueryRunner) {
    this;
    console.log(`\n> cache.clear`);
  }

  async remove(
    identifiers: string[]
  ) {
    console.log(`\n> cache.remove`);
    console.log(`Identifiers`, identifiers);
  }

  async getFromCache(
    options: QueryResultCacheOptions
  ) {
    this;
    console.log(`\n> cache.getFromCache`);
    console.log(`Options`, options);

    const [ querySelection, queryArgs ] = options.query.split(`WHERE`);

    const argPieces = [
      /"(?<entity>\w+)"\."(?<param>\w+)" = \? LIMIT (?<limit>\d+) -- PARAMETERS: \[(?<params>[^\]]+)\]/
    ].map(pattern => queryArgs && queryArgs.match(pattern));

    console.log(`Arg Matches`, argPieces);

    return Object.assign(options, { result: `[{}, {}]` });
  };

  async storeInCache(
    options: QueryResultCacheOptions,
    savedCache?: QueryResultCacheOptions
  ) {
    this;
    console.log(`\n> cache.storeInCache`);
    console.log(`Options`, options);
    console.log(`Saved Cache`, savedCache);
  }

  isExpired(savedCache: QueryResultCacheOptions) {
    this;
    console.log(`\n> cache.isExpired`);
    console.log(`Saved Cache`, savedCache);
    return false;
  }

  protected getQueryRunner(
    queryRunner: QueryRunner | undefined
  ): QueryRunner {
    if (queryRunner) return queryRunner;

    return this.connection.createQueryRunner("master");
  }
}
