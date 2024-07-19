import { Command, Options } from "@effect/cli";
import { FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";

// Save program using effect
// const program = (msg: string) => Effect.promise(async () => {});
const program = (msg: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;

    yield* fs.writeFileString(
      `${process.cwd()}/message.json`,
      JSON.stringify({ message: msg }),
    );
  });

const message = Options.text("message").pipe(Options.withAlias("m"));
// Create top level comand
const command = Command.make(
  "root",
  {
    message,
  },
  ({ message }) => {
    console.log("?");
    return program(message);
  },
);

// Create cli application
const cli = Command.run(command, {
  name: "Json App",
  version: "1.0.0",
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
