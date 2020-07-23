import {Connection, Repository} from "typeorm"

export class CacheManager<CacheEntity> {

  constructor(
    readonly connection: {
      main: Connection,
      cache: Connection
    },
    readonly mainRepository: Repository<CacheEntity>,
    readonly cacheRepository: Repository<CacheEntity>
  ) {}

  async find(
    options: Parameters<
      Repository<CacheEntity>["find"]
    >[number] = {}
  ) {
    const finds = await this.cacheRepository.find(options);

    return finds.length
      ? finds
      : this.mainRepository.find(options);
  }

  async findOne(
    options: Parameters<
      Repository<CacheEntity>["findOne"]
    >[number]
  ) {
    return (await this.cacheRepository.findOne(options))
      || this.mainRepository.findOne(options);
  }

  async save(
    entities: CacheEntity[] = [],
    options: Parameters<
      Repository<CacheEntity>["save"]
    >[number] = {}
  ) {
    return Promise.all([
      this.mainRepository.save(entities, options),
      this.cacheRepository.save(entities, options)
    ]);
  }

  async update(
    criteria: Parameters<
      Repository<CacheEntity>["update"]
    >[0],
    partialEntity: Parameters<
      Repository<CacheEntity>["update"]
    >[1]
  ) {
    return Promise.all([
      this.mainRepository.update(criteria, partialEntity),
      this.cacheRepository.update(criteria, partialEntity)
    ]);
  }

  async remove(
    entities: CacheEntity,
    options: Parameters<
      Repository<CacheEntity>["remove"]
    >[1] = {}
  ) {
    return Promise.all([
      this.mainRepository.remove(entities, options),
      this.cacheRepository.remove(entities, options)
    ]);
  }

  async delete(
    criteria: Parameters<
      Repository<CacheEntity>["delete"]
    >[0]
  ) {
    return Promise.all([
      this.mainRepository.delete(criteria),
      this.cacheRepository.delete(criteria)
    ]);
  }

/*
  async find(
    entityOptions: Partial<CacheEntity>
  ): Promise<CacheEntity> {
    return this.repository.findOne({
      cache: true,
      where: entityOptions
    });
  }

  async findMany(
    entityOptions: Partial<CacheEntity> = {}
  ): Promise<CacheEntity[]> {
    const optionKeys = Object.keys(entityOptions);

    return Array.from(this.cachePool.values())
      .filter(entry =>
        optionKeys.every(optionKey =>
          optionKeys[optionKey] === entry[optionKey]
        )
      )
      || this.repository.find({
        cache: true,
        where: entityOptions
      });
  }

  async set(
    entityOptions: CacheEntity
  ): Promise<CacheEntity> {
    return this.repository.save(entityOptions);
  }

  async delete(
    entity: CacheEntity
  ): Promise<CacheEntity> {
    return this.repository.remove(entity);
  }

  async deleteMany(
    entityOptions: CacheEntity
  ): Promise<DeleteResult> {
    return this.repository.delete(entityOptions);
  }
*/
}
