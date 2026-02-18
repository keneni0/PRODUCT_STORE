import { Router } from "express";
import { registerAsSeller, getMyRole } from "../controllers/authController.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/register-seller", requireAuth(), registerAsSeller);
router.get("/my-role", requireAuth(), getMyRole);

export default router;
