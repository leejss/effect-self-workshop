import { Context, Effect, Layer, pipe } from "effect";
import ky, { type KyInstance } from "ky";

class AppConfig extends Context.Tag("AppConfig")<
  AppConfig,
  {
    readonly prefixUrl: string;
  }
>() {}
class HttpClient extends Context.Tag("HttpClient")<HttpClient, KyInstance>() {}

export const HttpClientLive = Layer.effect(
  HttpClient,
  Effect.gen(function* () {
    const config = yield* AppConfig;
    return ky.create({
      prefixUrl: config.prefixUrl,
    });
  }),
);

const main = Effect.gen(function* () {
  const client = yield* HttpClient;
  const result = yield* Effect.promise(() => client.get("todos").json());
  return result;
});

const program = pipe(
  main,
  Effect.provide(HttpClientLive),
  Effect.provideService(AppConfig, {
    prefixUrl: "https://jsonplaceholder.typicode.com",
  }),
);

Effect.runPromise(program).then(console.log);
