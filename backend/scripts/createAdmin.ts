import { db } from "../src/db/index.js";
import { user } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

/**
 * Script to create or update admin user
 * 
 * Usage:
 * 1. First, sign up with Clerk using merkatoadmin@gmail.com
 * 2. Get the Clerk user ID from Clerk dashboard or after signup
 * 3. Run this script with: npx ts-node scripts/createAdmin.ts <clerk_user_id>
 * 
 * Or update existing user:
 * npx ts-node scripts/createAdmin.ts <clerk_user_id>
 */

async function createAdmin(clerkUserId: string) {
  try {
    // First, check if user exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, clerkUserId),
    });

    if (existingUser) {
      // Update existing user to admin
      const [updated] = await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.id, clerkUserId))
        .returning();

      console.log("✅ User updated to admin:");
      console.log({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
      });
    } else {
      // Create new admin user (you'll need to sync with Clerk first)
      console.log("❌ User not found in database.");
      console.log("Please sync the user first by:");
      console.log("1. Signing up with Clerk using merkatoadmin@gmail.com");
      console.log("2. Calling POST /api/users/sync with user data");
      console.log("3. Then run this script again with the Clerk user ID");
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Get Clerk user ID from command line argument
const clerkUserId = process.argv[2];

if (!clerkUserId) {
  console.log("Usage: npx ts-node scripts/createAdmin.ts <clerk_user_id>");
  console.log("\nTo get Clerk user ID:");
  console.log("1. Sign up with Clerk using merkatoadmin@gmail.com");
  console.log("2. Check Clerk dashboard or use Clerk API to get user ID");
  console.log("3. Or sign up via frontend and check the user sync response");
  process.exit(1);
}

createAdmin(clerkUserId);
