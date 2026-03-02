import React from "react";
import type { Task } from "./task.types";
import { TaskRow, type TaskRowPayload } from "./TaskRow";

type CreateTaskListProps = {
  tasks: Task[];
  onUpdate: ({ id, status }: TaskRowPayload) => void;
  pendingId: string | null;
};

export const TaskList = React.memo(function TaskList({
  tasks,
  onUpdate,
  pendingId,
}: CreateTaskListProps) {
  return (
    <div>
      {tasks.map((task: Task) => (
        <TaskRow
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          pendingId={pendingId}
        />
      ))}
    </div>
  );
});
