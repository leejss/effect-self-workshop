// https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md#filters

// Filter is for custom validation logic
// if predicate returns false, the value is considered invalid, and throw an error

import { Schema } from "@effect/schema";

const dirtyEmailList = [
  "example@example.com",
  "example2@example.com",
  "1234",
  "example3@example.com",
  "example4@example.com",
  "djaksdjskd",
];

const cleanEmailList = [
  "example@example.com",
  "example2@example.com",
  "example3@example.com",
  "example4@example.com",
];

// Example. Validate, and transformation
// Construct schema using pipe
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const schema = Schema.Array(Schema.String).pipe(
  Schema.filter((arr) => {
    return arr.every((v) => emailRegex.test(v));
  }),
  Schema.transform(Schema.Array(Schema.String), {
    decode: (arr) => arr.map((v) => v.split("@")[0]),
    encode: (arr) => arr,
  }),
);

// const result = Schema.decode(schema)(dirtyEmailList);
const result = Schema.decode(schema)(cleanEmailList);
console.log("result", result);
