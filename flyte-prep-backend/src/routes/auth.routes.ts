import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

const Body = z.object({
  sub: z.string().min(1).default("demo-user"),
  roles: z.array(z.enum(["provider", "staff"])).min(1).default(["provider"]),
});

router.post("/auth/dev-token", (req, res) => {
  const parsed = Body.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const { sub, roles } = parsed.data;

  const token = jwt.sign({ sub, roles }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({ token });
});

export default router;