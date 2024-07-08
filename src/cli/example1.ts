import { Command } from "@effect/cli";
import { Console, Effect } from "effect";
import { BunContext, BunRuntime } from "@effect/platform-bun";

const commnad = Command.make("hello-world", {}, () => {
  return Console.log("Hello, World!");
});

const cli = Command.run(commnad, {
  name: "hello-world",
  version: "0.0.1",
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
