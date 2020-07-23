import {Column, Entity, PrimaryColumn} from "typeorm";
import {BaseEntry} from "../BaseEntry";

@Entity()
export class Lockout extends BaseEntry<Lockout> {

  @PrimaryColumn()
  readonly memberID: string;

  @Column({ type: `simple-array` })
  readonly channelIDs: string[];

}
