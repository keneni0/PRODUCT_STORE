import { Router } from "express";
import  { syncUser } from "../controllers/userController.js";
import { requireAuth } from "@clerk/express";

const router = Router();


router.post("/sync", requireAuth(), syncUser) //sync clerk user to DB IS Protected route


export default router;