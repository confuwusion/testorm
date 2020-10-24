import { Command } from "@typedefs/Command";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
class SubcommandEntity {

  // Search key
  // All entries are fetched in the beginning
  @PrimaryColumn()
  readonly name: string;

  @Column()
  readonly inherits: string;

  @Column()
  readonly hierarchy: number;

  @Column()
  readonly trend: number;

  @Column()
  readonly exclusive: boolean;

  @Column({ type: `simple-json` })
  readonly channelIDs: string[];

  @Column({ type: `simple-json` })
  readonly fillers: string[];

}

export class Subcommand extends SubcommandEntity {

  static Entity = SubcommandEntity;

  constructor(
    inheritor: Command,
    {
      name,
      exclusive,
      hierarchy = inheritor.permission.hierarchy,
      trend = inheritor.permission.trend,
      channelIDs = inheritor.permission.channels,
      fillers = inheritor.args.fillers
    }: SubcommandEntity
  ) {
    // @ts-ignore
    super({
      name,
      inherits: inheritor.name,
      hierarchy,
      trend,
      exclusive,
      channelIDs,
      fillers
    });
  }

}

