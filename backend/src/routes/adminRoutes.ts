import { Router } from "express";
import {
  getAllSellers,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProductsWithSellers,
  deleteAnyProduct,
} from "../controllers/adminController.js";
import { requireAuthJson, requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuthJson);
router.use(requireAdmin());

router.get("/sellers", getAllSellers);
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);
router.get("/products", getAllProductsWithSellers);
router.delete("/products/:id", deleteAnyProduct);

export default router;
