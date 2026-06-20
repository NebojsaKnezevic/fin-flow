import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DATABASE_URL);
export default defineConfig({
  schema: "./src/db/schemas/*", // Gde stoje definicije tabela
  out: "./drizzle", // Gde se generise SQL migracioni fajlovi
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
