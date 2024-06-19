// Define schema
import { Effect, Console, Either } from "effect";
import { Schema } from "@effect/schema";

console.log("# Parsing ====================");

const Config = Schema.Struct({
  prefixUrl: Schema.String,
});

// Inferred type from the schema
type Config = typeof Config.Type;

// decode unknown

// decode from unknown values

const decodeConfigSync = Schema.decodeUnknownSync(Config); // Throw error when invalid

const result = decodeConfigSync({
  prefixUrl: "https://example.com",
});

console.log("result", result);

try {
  const result2 = decodeConfigSync({
    prefixUrl: undefined,
  });
  console.log("result2", result2);
} catch (error) {
  console.log("e::", error);
}

const decodeConfigEither = Schema.decodeUnknownEither(Config); // Return Either type. Either represents a value of one of two possible types (a disjoint union).
// Either<A, ParseError>

const result3 = decodeConfigEither({
  prefixUrl: undefined,
});

const program = Effect.gen(function* () {
  // if (Either.isLeft(result3)) {
  //   Console.error("Left::", result3.left);
  //   return null;
  // } else {
  //   return result3.right.prefixUrl;
  // }

  const res = yield* Effect.match(result3, {
    onFailure: (error) => {
      console.error("Left::", error);
      return null;
    },
    onSuccess: (val) => {
      console.log("Right::", val);
      return val;
    },
  });
  return res;
});

Effect.runSync(program);

// Handling extra properties -> when input has more properties than schema
// ignore, error, preserve

console.log("========================");
