import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./db";
import tasksRoutes from "./routes/tasks.routes";
import authRoutes from "./routes/auth.routes";




const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(tasksRoutes);
app.use(authRoutes);

app.get("/health", async (_req, res) => {
    try {
      const result = await pool.query("select now()");
      res.json({ ok: true, time: result.rows[0] });
    } catch (err: any) {
      console.error("DB error:", err);
      res.status(500).json({
        ok: false,
        message: err?.message ?? "DB error",
        code: err?.code,
        detail: err?.detail,
      });
    }
  });

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
