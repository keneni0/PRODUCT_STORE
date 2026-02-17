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
        const product = await queries.getProductById(id);

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

        const { title, description, imageUrl} = req.body;

        if (!title || !description || !imageUrl) {
            return res.status(400).json({ error: "Title, description and imageUrl are required" });
        }

        const newProduct = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId
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
        //check if product exists
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        //check if the user is the owner of the product
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: "Forbidden.You can only update your own products." });
        }

        const { title, description, imageUrl } = req.body;
        const updatedProduct = await queries.updateProduct(id, {
            title,
            description,
            imageUrl
        });

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
        //check if product exists
        const existingProduct = await queries.getProductById(id);
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