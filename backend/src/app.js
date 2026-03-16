import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.use("/api", apiRouter);

export default app;
