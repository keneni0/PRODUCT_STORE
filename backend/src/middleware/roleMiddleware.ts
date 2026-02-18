import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import * as queries from "../db/queries.js";

type Role = "customer" | "seller" | "admin";

export function requireRole(...allowedRoles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get user from database to check role
      const user = await queries.getUserById(userId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found. Please sync your account first." });
      }

      if (!allowedRoles.includes(user.role as Role)) {
        return res.status(403).json({ 
          error: "Forbidden", 
          message: `This action requires one of the following roles: ${allowedRoles.join(", ")}` 
        });
      }

      // Attach user to request for use in controllers
      (req as any).user = user;
      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export function requireSellerOrAdmin() {
  return requireRole("seller", "admin");
}

export function requireAdmin() {
  return requireRole("admin");
}
