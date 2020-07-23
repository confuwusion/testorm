import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class BotDictionary {

  @PrimaryColumn()
  readonly figure: string;

  @Column({ type: `simple-json` })
  readonly list: {

    // Categorization
    [index: string]: string[]
  }
}
