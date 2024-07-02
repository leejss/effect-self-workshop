import { Match } from "effect";

// matcher. type and value

{
  const match = Match.type<string | boolean>().pipe(
    Match.when(Match.string, (str) => `result::${str}`),
    Match.when(Match.boolean, (bool) => `result::${bool}`),
    Match.exhaustive,
  );

  console.log(match("hello"));
  console.log(match(true));
}
