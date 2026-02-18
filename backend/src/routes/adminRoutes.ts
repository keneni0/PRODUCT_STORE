import { Router } from "express";
import {
  getAllSellers,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProductsWithSellers,
  deleteAnyProduct,
} from "../controllers/adminController.js";
import { requireAuth } from "@clerk/express";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth());
router.use(requireAdmin());

router.get("/sellers", getAllSellers);
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);
router.get("/products", getAllProductsWithSellers);
router.delete("/products/:id", deleteAnyProduct);

export default router;
