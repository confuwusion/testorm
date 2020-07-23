import {Column, Entity, PrimaryColumn} from "typeorm";
import {BaseEntry} from "../BaseEntry";

interface Options {
  lastActive: number,
  uptime: number,
  pingRecord: { memberID: string, time: number },
  restartMessage?: { channelID: string, messageID: string }
}

@Entity()
export class BotOption extends BaseEntry<BotOption> {

  @PrimaryColumn({ type: `varchar`, length: 255 })
  readonly option: keyof Options;

  @Column({ type: `simple-json` })
  data: Options[this["option"]];

}
