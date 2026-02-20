import { Router } from "express";
import  { syncUser } from "../controllers/userController.js";
import { requireAuthJson } from "../middleware/roleMiddleware.js";

const router = Router();


router.post("/sync", requireAuthJson, syncUser) //sync clerk user to DB IS Protected route


export default router;