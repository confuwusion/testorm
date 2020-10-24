import { DBDeserializers, DBSerializers } from "@db/lib/serialization";
import { Column, Entity, PrimaryColumn } from "typeorm";

interface Options {
  lastActive: number;
  uptime: number;
  pingRecord: { memberID: string; time: number };
  restartMessage?: { channelID: string; messageID: string };
}

type OptionKeys = keyof Options;

@Entity()
class BotOptionEntity<K extends OptionKeys = OptionKeys> {

  // Search key
  @PrimaryColumn({ type: `varchar`, length: 255 })
  readonly option: K;

  @Column({
    type: `varchar`,
    length: 255,
    transformer: {
      from:DBDeserializers.nullish,
      to: DBSerializers.absolute
    }
  })
  data: Options[K];

}

export class BotOption<K extends OptionKeys = OptionKeys> extends BotOptionEntity<K> {

  static readonly Entity = BotOptionEntity;

  constructor(
    readonly option: K,
    public data: Options[K]
  ) {
    super();
  }

}
