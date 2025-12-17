import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import pkg from "pg";
const { Pool } = pkg;
import type { DB } from "./DBTypes";
import { env } from "../globals/env";

const pool = new Pool({
  connectionString: env.get("DATABASE_URL"),
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: pool,
  }),
  plugins: [new CamelCasePlugin()],
});
