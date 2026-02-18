/**
 * Standalone script to set admin user via raw SQL.
 * No project imports - only pg + dotenv.
 *
 * Usage: node scripts/setupAdmin.js
 * Make sure DATABASE_URL is set in backend/.env
 */

import dotenv from "dotenv";
import pg from "pg";

// Load .env (run from backend dir: npm run setup-admin)
dotenv.config();

const { Pool } = pg;

async function setupAdmin() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set. Add it to backend/.env");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log("🔧 Setting up admin user...");
    console.log("Looking for: keneniasefa14@gmail.com\n");

    // Check if user exists
    const check = await pool.query(
      "SELECT id, email, name, role FROM users WHERE email = $1",
      ["keneniasefa14@gmail.com"]
    );

    if (check.rows.length === 0) {
      console.log("❌ User not found with email: keneniasefa14@gmail.com");
      console.log("\n📋 Sign in once via the frontend so the user is synced, then run this again.");
      process.exit(1);
    }

    // Update to admin
    const update = await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, email, name, role",
      ["keneniasefa14@gmail.com"]
    );

    const row = update.rows[0];
    console.log("✅ Admin user updated successfully!\n");
    console.log("User details:", row);
    console.log("\n🎉 Sign in with keneniasefa14@gmail.com and visit /admin/dashboard");
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.message.includes("role") || err.message.includes("enum")) {
      console.log("\n💡 Run migration first: cd backend && npm run db:push");
    }
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setupAdmin();
