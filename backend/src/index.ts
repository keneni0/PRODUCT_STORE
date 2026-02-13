import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(clerkMiddleware()); //auth object will be attached to the request object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});