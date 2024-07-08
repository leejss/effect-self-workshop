import { Command, Args, Options } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Console, Effect, pipe } from "effect";

// Running with arguments
// Example, bun run example2.ts "arguments_text"
const text = Args.text({ name: "text" });

// Add option to the cli
const bold = Options.boolean("bold").pipe(Options.withAlias("b"));

// Pass arguments or options to the command
const command = Command.make("echo", { text, bold }, ({ text, bold }) => {
  return Console.log(bold ? `\x1b[1m${text}\x1b[0m` : text);
});

const cli = Command.run(command, {
  name: "Echo CLI",
  version: "0.0.1",
});

pipe(process.argv, cli, Effect.provide(BunContext.layer), BunRuntime.runMain);
