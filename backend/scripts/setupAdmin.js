import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is missing in environment variables.");
  process.exit(1);
}

const email = process.argv[2] || process.env.ADMIN_EMAIL;
if (!email) {
  console.error("Usage: npm run setup-admin -- <email>\nOr set ADMIN_EMAIL in backend/.env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 1,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 10_000,
  keepAlive: true,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `update "users"
       set "role" = 'admin', "updated_at" = now()
       where "email" = $1
       returning "id", "email", "name", "role", "phone_number", "updated_at"`,
      [email]
    );

    if (result.rowCount === 0) {
      console.error(
        `No user found for email "${email}".\n` +
          `Make sure you sign up in Clerk and call /api/users/sync first.`
      );
      process.exit(2);
    }

    console.log("Admin role granted:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(async (err) => {
  console.error("Failed to setup admin:", err);
  try {
    await pool.end();
  } finally {
    process.exit(1);
  }
});

