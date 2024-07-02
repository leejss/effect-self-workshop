import { Effect } from "effect";

{
  // Unit of computation
  const success: Effect.Effect<number> = Effect.succeed(1);
  const easyProgram = (str: string) => {
    return Effect.succeed(str);
  };
  // Running effect
  const result = Effect.runSync(easyProgram("hello"));
  console.log("result::", result);
}

{
  // modeling syncronous effect
  // Effect.sync(thunk)
  const easyProgram = (str: string) => {
    return Effect.sync(() => str);
  };
  const result = Effect.runSync(easyProgram("hello"));
  // Side effect example
  const sideEffect = Effect.sync(() => {
    console.log("Inside Effect.sync");
    return "Hello";
  });

  const result2 = Effect.runSync(sideEffect);
  console.log("result2::", result2);
}

// function may return effect
const mayFail = (n: number): Effect.Effect<number, string> => {
  if (n === 1) {
    return Effect.fail("error");
  }
  return Effect.succeed(n);
};

{
  const falsySyncEffect = Effect.sync(() => {
    return false;
  });
  // same as
  const falsyEffect = Effect.succeed(false);
  const syncEffect = (n: number) => Effect.sync(() => n % 2 === 0);
  const resultA = Effect.runSync(syncEffect(2));
  console.log("resultA::", resultA);
}
{
  type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };
  // Async effect
  const fetchEffect = Effect.promise(() => {
    return fetch("https://jsonplaceholder.typicode.com/todos/1").then(
      (response) => response.json() as Promise<Todo>,
    );
  });
  // or fetch function
  const get = (url: string) => {
    return Effect.promise(() => {
      return fetch(url).then((response) => response.json() as Promise<Todo>);
    });
  };

  // Handling error in async effect
}
