import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DATABASE_URL);

export default defineConfig({
  schema: "../../packages/models/src/index.ts", // Pokazuje na deljeni paket
  out: "./drizzle", // Gde se generišu SQL migracioni fajlovi
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
