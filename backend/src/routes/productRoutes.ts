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
import { requireAuthJson, requireSellerOrAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/tera/:teraId", getProductsByTera);
router.get("/my", requireAuthJson, getMyProducts);
router.get("/:id", getProductById);
router.post("/", requireAuthJson, requireSellerOrAdmin(), createProduct);
router.put("/:id", requireAuthJson, updateProduct);
router.delete("/:id", requireAuthJson, deleteProduct);

export default router;