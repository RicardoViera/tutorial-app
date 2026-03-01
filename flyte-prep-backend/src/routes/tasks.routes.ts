import { Router } from "express";
import { getTasksByPatient, updateTask, createTask } from "../services/tasks.service";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";

const router = Router();

router.get(
  "/patients/:patientId/tasks",
  requireAuth,
  requireRole(["provider", "staff"]),
  getTasksByPatient
);

router.patch(
  "/tasks/:taskId/update",
  requireAuth,
  requireRole(["provider", "staff"]),
  updateTask
);

router.post(
    "/patients/:patientId/tasks",
    requireAuth,
    requireRole(["provider", "staff"]),
    createTask
  );

export default router;