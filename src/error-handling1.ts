import { Effect, Exit, Data, pipe, Console } from "effect";

// Specific error handling with Effect.catchTag and Exit data type.

// Define two possible errors
class NotANumberError extends Data.TaggedError("NotANumberError") {}
class EvenNumberError extends Data.TaggedError("EvenNumberError") {}

// MainProgram may cause two different errors.

const arg = process.argv[2];

// Let's say main function only accepts number as an argument.
// And check the number is even or odd.
// if even, throw error, otherwise, print the number then return

type MainProgram = Effect.Effect<number, NotANumberError | EvenNumberError>;
function main(arg: unknown): MainProgram {
  return Effect.gen(function* () {
    // check args is number type
    const n = yield* valideteNumber(arg);
    const result = yield* validateOdd(n);
    return result;
  });
}

function valideteNumber(arg: unknown): Effect.Effect<number, NotANumberError> {
  return Effect.gen(function* () {
    if (arg !== 0 && !arg) {
      if (typeof Number(arg) !== "number") {
        yield* new NotANumberError();
      }
    }
    if (typeof Number(arg) !== "number") {
      yield* new NotANumberError();
    }
    return arg as number;
  });
}

function validateOdd(n: number): Effect.Effect<number, EvenNumberError> {
  return Effect.gen(function* () {
    if (n % 2 === 0) {
      yield* new EvenNumberError();
    }
    return n;
  });
}

const exit = pipe(
  main(arg),

  // Consume the errors
  // Effect.catchTags({
  //   EvenNumberError: () => Console.error("Even number is not allowed"),
  //   NotANumberError: () => Console.error("Not a number"),
  // }),
  Effect.runSyncExit,
);

Exit.match(exit, {
  onSuccess: (n) => console.log("Success::", n),
  onFailure: (e) => {
    console.error("Error::", e);
    process.exit(1);
  },
});
