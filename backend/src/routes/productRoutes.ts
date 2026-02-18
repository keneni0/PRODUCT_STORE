import { Router } from "express";
import {
  getAllProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByTera,
} from "../controllers/productController.js";
import { requireAuth } from "@clerk/express";
import { requireSellerOrAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/tera/:teraId", getProductsByTera);
router.get("/my", requireAuth(), getMyProducts);
router.get("/:id", getProductById);
router.post("/", requireAuth(), requireSellerOrAdmin(), createProduct);
router.put("/:id", requireAuth(), updateProduct);
router.delete("/:id", requireAuth(), deleteProduct);

export default router;