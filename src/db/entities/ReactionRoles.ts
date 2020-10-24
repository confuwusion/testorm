import { Column, Entity, PrimaryColumn } from "typeorm";

class ReactionRoleValue {

  // Search key
  @Column()
  readonly messageID: string;

  @Column({ type: `simple-json` })
  readonly reactionRoles: readonly {
    readonly name: string;
    readonly roleID: string;
  }[];

}

@Entity()
export class ReactionRole extends ReactionRoleValue {

  @PrimaryColumn()
  readonly code: string = process.hrtime.bigint().toString(36);

}
