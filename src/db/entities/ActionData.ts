import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
class ActionEntity {

  // Search key
  @PrimaryColumn()
  readonly code: string = process.hrtime.bigint().toString(36);

  @Column()
  readonly name: string;

  @Column({ type: `simple-json` })
  readonly data: (string | number | boolean)[];

}

export class ActionData extends ActionEntity {

  static readonly Entity = ActionEntity;

  constructor(
    readonly name: ActionEntity["name"],
    readonly data: ActionEntity["data"]
  ) {
    super();
  }

}
