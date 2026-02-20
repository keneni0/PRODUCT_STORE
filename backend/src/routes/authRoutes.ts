import { Router } from "express";
import { registerAsSeller, getMyRole } from "../controllers/authController.js";
import { requireAuthJson } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/register-seller", requireAuthJson, registerAsSeller);
router.get("/my-role", requireAuthJson, getMyRole);

export default router;
