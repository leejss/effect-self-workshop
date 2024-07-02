import { Effect, pipe } from "effect";
// Building pipeline

{
  // Accept effect and then transform the value inside
  const numberEffectA = Effect.succeed(1);
  const transformedEffect = pipe(
    numberEffectA,
    Effect.map((n) => n + 1),
    Effect.map((n) => n + 1),
    Effect.map((n) => n + 1),
    Effect.runSync,
  );
  console.log("transformedEffect", transformedEffect);
}
{
  // Flat map
  // const flatMappedEffect = pipe(myEffect, Effect.flatMap(transformation))
  // transformation returns an effect, not a value
  const checkEven = (n: number) =>
    n % 2 === 0 ? Effect.succeed("Even") : Effect.succeed("Not even");

  const result: number = pipe(
    Effect.sync(() => {
      return Math.floor(Math.random() * 100);
    }),
    Effect.flatMap(checkEven),
    Effect.map((s) => (s === "Even" ? 1 : 0)),
    Effect.runSync,
  );

  console.log("result", result);
}

{
  // generators
  const e = Effect.gen(function* () {});
}
