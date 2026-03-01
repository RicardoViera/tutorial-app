import { Request, Response, NextFunction } from "express";
import { pool } from "../db";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),

  task_type: z.string().min(1, "Task type is required"),

  due_at: z.iso.datetime().nullable().optional(),
});

export const getTasksByPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { patientId } = req.params;

    const result = await pool.query(
      `
      select id, title, task_type, status, due_at, completed_at
      from care_plan_tasks
      where patient_id = $1
      order by due_at asc nulls last
      `,
      [patientId],
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await pool.connect();

  try {
    const { taskId } = req.params;
    const { status } = req.body;
    console.log(req.body, req.params, status, taskId)

    const actorId = (req as any).user.sub;

    await client.query("BEGIN");

    // get current task (for audit before state)
    const currentTask = await client.query(
      `select * from care_plan_tasks where id = $1 for update`,
      [taskId],
    );

    if (currentTask.rowCount === 0) {
      throw new Error("Task not found");
    }

    const task = currentTask.rows[0];

    // update task
    const updated = await client.query(
      `
        update care_plan_tasks
        set status = $1,
            completed_at = now(),
            completed_by = $2,
            updated_at = now()
        where id = $3
        returning *
        `,
      [status, actorId, taskId],
    );

    // insert audit log
    await client.query(
      `
        insert into audit_events (
          patient_id,
          entity_type,
          entity_id,
          action,
          actor_id,
          before_json,
          after_json
        )
        values ($1, 'care_plan_task', $2, 'TASK_UPDATED', $3, $4, $5)
        `,
      [task.patient_id, taskId, actorId, task, updated.rows[0]],
    );

    await client.query("COMMIT");

    res.json(updated.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

export const createTask = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { patientId } = req.params;

    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten(),
      });
    }

    const { title, task_type, due_at } = parsed.data;

    const result = await pool.query(
      `
      insert into care_plan_tasks (patient_id, title, task_type, due_at)
      values ($1, $2, $3, $4)
      returning *
      `,
      [patientId, title, task_type, due_at ?? null],
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Task already exists" });
    }

    next(err);
  }
};
