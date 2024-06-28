import { Schema } from "@effect/schema";
import { pipe } from "effect";

// https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md#transformations

// Pipeline of schemas
// Transformation

// Schema.transform(
//   inputSchema,
//   outputSchema,
//   decodeFunction,
//   encodeFunction
// )

// Validate it first and then transform it
// Bidrectional transformation

const TemperatureSchema = pipe(
  Schema.Number,
  Schema.transform(Schema.Number, {
    decode: (fahrenheit) => (fahrenheit - 32) * (5 / 9), // Fahrenheit to Celsius
    encode: (celsius) => (celsius * 9) / 5 + 32, // Celsius to Fahrenheit
  }),
  Schema.brand("Temperature"),
);

const WeatherSchema = Schema.Struct({
  location: Schema.String,
  temperature: TemperatureSchema,
  humidity: pipe(Schema.Number, Schema.between(0, 100)),
});

type Temperature = Schema.Schema.Type<typeof TemperatureSchema>;
type Weather = Schema.Schema.Type<typeof WeatherSchema>;

const decodeWeather = Schema.decodeUnknownSync(WeatherSchema);
const encodeWeather = Schema.encodeSync(WeatherSchema);
const incomingWeatherData = {
  location: "New York",
  temperature: 77, // 77°F
  humidity: 65,
};

try {
  // Decode the incoming data (converts Fahrenheit to Celsius internally)
  const decodedWeather = decodeWeather(incomingWeatherData);
  console.log("Decoded Weather:", decodedWeather);

  // Perform some operation with the Celsius temperature
  const adjustedTemp = decodedWeather.temperature + 5; // Adjust by 5°C
  const adjustedWeather: Weather = {
    ...decodedWeather,
    temperature: adjustedTemp as Temperature,
  };
  console.log("Adjusted Weather:", adjustedWeather);
  // Encode the weather data back (converts Celsius to Fahrenheit for display)
  const encodedWeather = encodeWeather(adjustedWeather);
  console.log("Encoded Weather (for display):", encodedWeather);
} catch (error) {
  console.error("Validation Error:", error);
}
