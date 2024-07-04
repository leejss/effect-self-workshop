import { Context, Effect, pipe, Layer } from "effect";
// pipe(
//   main,
//   Effect.provide(CliOptionsLive),
//   Effect.provide(Http.client.layer),
//   Effect.provide(BunContext.layer),
//   BunRuntime.runMain
// );

// const runnable = Effect.provideService(program, Random, {
//   next: Effect.sync(() => Math.random()),
// });

// Entry point
// definition of a service and its implementation

// # Basic process of provide service

// define a service
class Formatter extends Context.Tag("Formatter")<
  Formatter,
  { formatNumber: (n: number) => Effect.Effect<string> }
>() {}

// using the service
const program = Effect.gen(function* () {
  const formatter = yield* Formatter;
  const result = yield* formatter.formatNumber(10);

  // Using result - side effect with result
  console.log("result::", result);
});

// Provide service and then run
pipe(
  program,
  Effect.provideService(Formatter, {
    formatNumber: (n: number) => Effect.succeed(`${n} Point`),
  }),
  Effect.runSync,
);

{
  // constructing a service with layer -> use layer to create a service
  // const ConfigLive = Layer.succeed(Config, ...)

  class Config extends Context.Tag("Config")<
    Config,
    {
      getConfig: () => Effect.Effect<Record<"url", string>>;
    }
  >() {}

  // const ConfigLive = pipe(
  //   Config.of({
  //     getConfig: () =>
  //       Effect.succeed({
  //         key: "value",
  //       }),
  //   }),
  //   Layer.succeed(Config),
  // );

  const ConfigLive: Layer.Layer<Config, never, never> = Layer.succeed(
    Config,
    Config.of({
      getConfig: () =>
        Effect.succeed({
          url: "file://config.json",
        }),
    }),
  );

  class Db extends Context.Tag("Db")<
    Db,
    {
      connect: () => Effect.Effect<void>;
    }
  >() {}

  const DbLive: Layer.Layer<Db, never, Config> = Layer.effect(
    Db,
    Effect.gen(function* () {
      const config = yield* Config;
      const { url } = yield* config.getConfig();
      return {
        connect: () => Effect.sync(() => console.log("Connected to", url)),
      };
    }),
  );

  // Composing layers
  const AppLive = DbLive.pipe(Layer.provide(ConfigLive));

  // Layer to effect

  const program = pipe(
    Effect.gen(function* () {
      const db = yield* Db;
      yield* db.connect();
      return yield* Effect.succeed("done");
    }),
    Effect.provide(AppLive),
  );

  Effect.runPromise(program).then(console.log);
}
