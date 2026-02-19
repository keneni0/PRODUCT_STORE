import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import { getAuth } from "@clerk/express";



//GET ALL PRODUCTS(public route)
export async function getAllProducts(req: Request, res: Response) {
    try {
        const products = await queries.getAllProducts();
        res.status(200).json(products);
    }catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get products" });
    }
}

//GET PRODUCTS BY TERA/CATEGORY (public route)
export async function getProductsByTera(req: Request, res: Response) {
    try {
        const { teraId } = req.params;
        const products = await queries.getProductsByTeraId(teraId);
        res.status(200).json(products);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get products by category" });
    }
}

//GET PRODUCTS OF CURRENT USER(private route)
export async function getMyProducts(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get user products" });
    }
}


//GET PRODUCT BY ID(public route)
export async function getProductById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        let product;
        try {
            product = await queries.getProductById(id);
        } catch (err: any) {
            // Handle invalid UUIDs (e.g. legacy ids like "p8") gracefully
            if (err && typeof err === "object" && (err as any).code === "22P02") {
                return res.status(400).json({ error: "Invalid product id" });
            }
            throw err;
        }

        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    }catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get product" });
     }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { title, description, imageUrl, priceETB, stock, section, teraId, popular, rating } = req.body;

        if (!title || !description || !imageUrl || !priceETB || !section || !teraId) {
            return res.status(400).json({ error: "Title, description, imageUrl, priceETB, section, and teraId are required" });
        }

        const newProduct = await queries.createProduct({
            title,
            description,
            imageUrl,
            priceETB: parseInt(priceETB),
            stock: stock ? parseInt(stock) : 0,
            section,
            teraId,
            userId,
            popular: popular ? "true" : "false",
            rating: rating ? String(rating) : null,
        });

        res.status(201).json(newProduct);

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create product" });
    }
}


//Update product (private route - only owner can update)
export async function updateProduct(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        // check if product exists + ownership (lightweight query)
        const existingProduct = await queries.getProductOwnerById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        //check if the user is the owner of the product
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: "Forbidden.You can only update your own products." });
        }

        const { title, description, imageUrl, priceETB, stock, section, teraId, popular, rating } = req.body;
        
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (priceETB !== undefined) updateData.priceETB = parseInt(priceETB);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (section) updateData.section = section;
        if (teraId) updateData.teraId = teraId;
        if (popular !== undefined) updateData.popular = popular ? "true" : "false";
        if (rating !== undefined) updateData.rating = String(rating);

        const updatedProduct = await queries.updateProduct(id, updateData);

        res.status(200).json(updatedProduct);

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update product" });
    }
}


//Delete product (private route - only owner can delete)
export async function deleteProduct(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        // check if product exists + ownership (lightweight query)
        const existingProduct = await queries.getProductOwnerById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        //check if the user is the owner of the product
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: "Forbidden.You can only delete your own products." });
        }

        await queries.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete product" });
    }
}
