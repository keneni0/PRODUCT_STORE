import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import * as queries from "../db/queries.js";

// Register as seller - updates user role to seller
export async function registerAsSeller(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user exists
    const user = await queries.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found. Please sync your account first." });
    }

    // Update user role to seller
    const updatedUser = await queries.updateUserRole(userId, "seller");

    res.status(200).json({ 
      message: "Successfully registered as seller",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Register as seller error:", error);
    res.status(500).json({ error: "Failed to register as seller" });
  }
}

// Get current user's role
export async function getMyRole(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await queries.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      role: user.role,
      userId: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error("Get role error:", error);
    res.status(500).json({ error: "Failed to get user role" });
  }
}
