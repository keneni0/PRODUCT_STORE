/**
 * Quick script to set admin user via database
 * 
 * Usage:
 * npx ts-node scripts/setupAdmin.ts
 * OR
 * npm run setup-admin
 * 
 * Make sure DATABASE_URL is set in .env
 */

import dotenv from "dotenv";
dotenv.config();

import { db } from "../src/db/index.js";
import { user } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

async function setupAdmin() {
  try {
    console.log("🔧 Setting up admin user...");
    console.log("Looking for: keneniasefa14@gmail.com\n");
    
    // First check if user exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, "keneniasefa14@gmail.com"),
    });

    if (!existingUser) {
      console.log("❌ User not found with email: keneniasefa14@gmail.com");
      console.log("\n📋 Please follow these steps:");
      console.log("1. Make sure you're signed in with Clerk using keneniasefa14@gmail.com");
      console.log("2. The user will be auto-synced to database when you visit the frontend");
      console.log("3. Run this script again: npm run setup-admin");
      process.exit(1);
    }

    console.log("✅ User found! Updating to admin role...\n");

    // Update user to admin
    const [updated] = await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, "keneniasefa14@gmail.com"))
      .returning();

    if (updated) {
      console.log("✅ Admin user updated successfully!\n");
      console.log("User details:");
      console.log({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
      });
      console.log("\n🎉 You can now:");
      console.log("1. Sign in with keneniasefa14@gmail.com");
      console.log("2. Visit http://localhost:5174/admin/dashboard");
      console.log("3. Access admin features");
    } else {
      console.log("❌ Failed to update user");
      process.exit(1);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("enum") || error.message.includes("user_role")) {
      console.log("\n💡 Tip: Run database migration first:");
      console.log("   cd backend && npm run db:push");
    }
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
