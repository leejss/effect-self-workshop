import { Console, Effect, Option, pipe } from "effect";
// Checking nullable with Option and match

const arg = process.argv[2] ?? null;

// Option to Effect. Folding
const program = Effect.match(Option.fromNullable(arg), {
  onSuccess: (v) => v,
  onFailure: () => {
    Console.log("No argument provided");
    return null;
  },
});

Effect.runSync(program);
