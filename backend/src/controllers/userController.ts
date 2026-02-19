import type { Request,Response } from "express";
import * as queries from "../db/queries.js";
import { getAuth } from "@clerk/express";

export async function syncUser(req:Request,res:Response){
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const  { email, name, imageUrl, role, phoneNumber } = req.body;
        if (!email || !name ||!imageUrl) {
            return res.status(400).json({error:"Email, name and imageUrl are required"});
        }

        const userPayload: any = {
            id: userId,
            email,
            name,
            imageUrl,
            role: role || "customer",
        };

        if (phoneNumber) {
            userPayload.phoneNumber = phoneNumber;
        }

        const userData = await queries.upsertUser(userPayload);
        res.status(200).json(userData);
    }
catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}