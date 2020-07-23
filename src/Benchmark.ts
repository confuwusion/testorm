import { displayBigIntTime } from "./displayTime";

export class Benchmark {

  startTime: bigint = BigInt(0);
  stopTime: bigint = BigInt(0);
  timeTaken: bigint = BigInt(0);

  constructor(start?: boolean) {
    if (start) this.start();
  }

  start(): bigint {
    return this.startTime = process.hrtime.bigint();
  }

  stop(): Benchmark {
    const stopTime = process.hrtime.bigint();

    this.timeTaken = stopTime - this.startTime;
    this.stopTime = stopTime;

    return this;
  }

  readable(): string {
    return displayBigIntTime(this.timeTaken);
  }

  display(description: string = ``): string {
    const readable = this.readable();
    console.log(description, readable);

    return readable;
  }
}
