import { Response, NextFunction } from "express";
import { AuthedRequest } from "./auth";

export const requireRole = (allowed: string[]) => {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const roles = req.user?.roles ?? [];
    const ok = allowed.some((r) => roles.includes(r));
    if (!ok) return res.status(403).json({ error: "Forbidden" });
    next();
  };
};