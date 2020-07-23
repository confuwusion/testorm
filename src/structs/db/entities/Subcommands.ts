import {Entity, PrimaryColumn, Column} from "typeorm";
import {BaseEntry} from "../BaseEntry";

//import {SprikeyClient} from "../../SprikeyClient";
import {Command} from "../../typedefs/Command";

@Entity()
class SubcommandEntry extends BaseEntry<SubcommandEntry> {

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

export class Subcommand extends SubcommandEntry {

  static entity = SubcommandEntry;

  constructor(
    inheritor: Command,
    {
      name,
      exclusive,
      hierarchy = inheritor.permission.hierarchy,
      trend = inheritor.permission.trend,
      channelIDs = inheritor.permission.channels,
      fillers = inheritor.args.fillers
    }: SubcommandEntry
  ) {
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

