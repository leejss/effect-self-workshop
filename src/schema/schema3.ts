import { Schema } from "@effect/schema";
// Example. Validate, and transformation
// Construct schema using pipe
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EmailSchema = Schema.String.pipe(
  Schema.filter((v) => {
    return emailRegex.test(v);
  }),
);

const result1 = Schema.decode(EmailSchema)("12345");
const result2 = Schema.decode(EmailSchema)("example@example.com");

console.log("resul1", result1);
console.log("result2", result2);
