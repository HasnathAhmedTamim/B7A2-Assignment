import { Pool } from "pg";
import { envVars } from "./env.js";

export const pool = new Pool({
  connectionString: envVars.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});
