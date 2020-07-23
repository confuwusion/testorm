import { Column, Entity, PrimaryColumn } from "typeorm";
import {BaseEntry} from "../BaseEntry";

@Entity()
class LogChannelEntity extends BaseEntry<LogChannelEntity> {

  @PrimaryColumn()
  readonly type: string;

  @Column()
  readonly channelID: string;

}

export class LogChannel extends LogChannelEntity {

  static readonly Entity = LogChannelEntity;

  constructor(channelType: string, channelID: string) {
    super({ type: channelType, channelID });
  }

}
