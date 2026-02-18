import type { Request, Response } from "express";
import * as queries from "../db/queries.js";

// Get all sellers
export async function getAllSellers(req: Request, res: Response) {
  try {
    const sellers = await queries.getUsersByRole("seller");
    res.status(200).json(sellers);
  } catch (error) {
    console.error("Get sellers error:", error);
    res.status(500).json({ error: "Failed to get sellers" });
  }
}

// Get all users (admin only)
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await queries.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
}

// Update user role (admin only)
export async function updateUserRole(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["customer", "seller", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be customer, seller, or admin" });
    }

    const updatedUser = await queries.updateUserRole(userId, role);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
}

// Delete user (admin only)
export async function deleteUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await queries.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

// Get all products with seller info (admin view)
export async function getAllProductsWithSellers(req: Request, res: Response) {
  try {
    const products = await queries.getAllProductsWithUsers();
    res.status(200).json(products);
  } catch (error) {
    console.error("Get products with sellers error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
}

// Delete any product (admin only)
export async function deleteAnyProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await queries.deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
}
