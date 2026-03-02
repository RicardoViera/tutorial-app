import React from "react";
import type { Task } from "./task.types";

export type TaskRowPayload = {
  id: string;
  status: string;
};

type CreateTaskRowProps = {
  task: Task;
  onUpdate: ({ id, status }: TaskRowPayload) => void;
  pendingId: string | null;
};

export const TaskRow = React.memo(function TaskRow({
  task,
  onUpdate,
  pendingId,
}: CreateTaskRowProps) {
  return (
    <div key={task.id} style={{ marginTop: 10 }}>
      <span>
        {task.title} — {task.status}
      </span>

      {task.status !== "completed" && (
        <button
          style={{ marginLeft: 10 }}
          onClick={() => onUpdate({ id: task.id, status: "completed" })}
          disabled={pendingId === task.id}
        >
          {pendingId === task.id ? "..." : "Complete"}
        </button>
      )}
      {task.status !== "deleted" && (
        <button
          style={{ marginLeft: 10 }}
          onClick={() => onUpdate({ id: task.id, status: "deleted" })}
          disabled={pendingId === task.id}
        >
          {pendingId === task.id ? "..." : "Delete"}
        </button>
      )}
    </div>
  );
});
