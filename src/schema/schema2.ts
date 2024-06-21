import { Effect, Context, Either, pipe, Console } from "effect";
import { Schema } from "@effect/schema";
import type { KyInstance } from "ky";
import ky from "ky";

// 1. Create a service that can fetch data from the server
// 2. Define a schema for the data that the service will return
// 3. Apply the schema to the data that the service returns

// Tag for identifying the service
class HttpClient extends Context.Tag("HttpClient")<HttpClient, KyInstance>() {
  // Implementation of the service
  static live = ky.create({});
}

// Define the schema for the data that the service will return
const TodoSchema = Schema.Struct({
  userId: Schema.Number,
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Boolean,
});

// Create a effect that contain the service
const main = Effect.gen(function* () {
  // get client service
  const client = yield* HttpClient;

  // run promise
  const result = yield* Effect.promise(() =>
    client.get("https://jsonplaceholder.typicode.com/todos/1").json(),
  );

  // decode the result using the schema
  const todoEither = Schema.decodeUnknownEither(TodoSchema)(result);

  if (Either.isLeft(todoEither)) {
    return yield* Effect.fail(todoEither.left);
  }

  return todoEither.right;
});

const program = pipe(
  main,
  Effect.provideService(HttpClient, HttpClient.live),
  Effect.catchTag("ParseError", (err) => Console.error("ParseError::", err)),
);

Effect.runPromise(program).then(console.log);
