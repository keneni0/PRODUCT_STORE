import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import { ENV } from "../config/env.js";

if(!ENV.DATABASE_URL){
    throw new Error("Database URL is not defined in environment variables");
}
// Create a connection pool to the PostgreSQL database
const pool = new Pool({
    connectionString: ENV.DATABASE_URL
});

pool.on("connect",() =>{
    console.log("Connected to the database");
})

pool.on("error", (err) => {
    console.error("Database connection error:", err);
})

export const db = drizzle({client:pool,schema})