import express from "express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server ใช้ได้ ");
});

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(` Server : http://localhost:${env.PORT}`);
  });
};

start();