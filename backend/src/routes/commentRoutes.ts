import { Router } from "express";
import * as commentController from "../controllers/commentController.js";
import { requireAuthJson } from "../middleware/roleMiddleware.js";


const router = Router();

router.post("/:productId", requireAuthJson, commentController.createComment);
router.delete("/:commentId", requireAuthJson, commentController.deleteComment);

export default router;