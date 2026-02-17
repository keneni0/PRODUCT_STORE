import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import { getAuth } from "@clerk/express";



export async function createComment(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { productId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        // verify product exists
        const product = await queries.getProductById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const comment = await queries.createComment({
            content,
            userId,
            productId,
        });

        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create comment" });
    }
}

export async function deleteComment(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { commentId } = req.params;
        const existingComment = await queries.getCommentsById(commentId);
        if (!existingComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (existingComment.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const deleted = await queries.deleteComment(commentId);
        res.status(200).json(deleted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete comment" });
    }
}