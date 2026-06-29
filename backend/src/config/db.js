import mysql from "mysql2/promise";
import { env } from "./env.js";

export let db;

export const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
    });

    console.log(" Database Connected");
  } catch (err) {
    console.log(" DB Connection Failed");
    console.log(err.message);
    process.exit(1); 
  }
};