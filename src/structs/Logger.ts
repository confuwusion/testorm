import * as chalk from "chalk";

type SprikeyLoggerKeys = "ClientError" | "DatabaseError" | "DiscordAPIError";

export class Logger {

  constructor(
    readonly title: string
  ) {
  }

  print(
    ...args: readonly unknown[]
  ): void {
    console.log(
      chalk.gray.bold(`[${this.title}] › `),
      ...args
    );
  }

}
