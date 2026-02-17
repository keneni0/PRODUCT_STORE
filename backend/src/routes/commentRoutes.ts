import { Router } from "express";
import * as commentController from "../controllers/commentController.js";
import { requireAuth } from "@clerk/express";


const router = Router();

router.post("/:productId", requireAuth(), commentController.createComment);
router.delete("/:commentId", requireAuth(), commentController.deleteComment);

export default router;