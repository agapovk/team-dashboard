import { config } from "dotenv";
import { minLength, object, parse, pipe, string } from "valibot";

// Next подгружает .env.local сам; для tooling (drizzle-kit, tsx seed) — грузим явно.
// override:false — не затираем уже выставленные переменные.
config({ path: ".env.local", override: false });

const EnvSchema = object({
  DATABASE_URL: pipe(string(), minLength(1, "DATABASE_URL is required")),
});

// Падаем сразу при отсутствии переменной, а не в рантайме запроса.
export const env = parse(EnvSchema, process.env);
