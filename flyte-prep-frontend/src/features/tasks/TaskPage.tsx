import { useTasks, useUpdateTask, useCreateTask } from "./tasks";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/useAuth";
import { useCallback, useState } from "react";
import CreateTaskForm from "./CreateTaskForm";
import { TaskList } from "./TaskList";

const PATIENT_ID = "800dd407-3480-4d3d-b7a9-b54851b3050a";

export default function TasksPage() {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading, error } = useTasks(PATIENT_ID);
  const updateTask = useUpdateTask(PATIENT_ID);
  const createTask = useCreateTask(PATIENT_ID);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleUpdateTask = useCallback(
    (payload: { id: string; status: string }) => {
      setPendingId(payload.id);
      updateTask.mutate(payload, {
        onSettled: () => setPendingId(null),
      });
    },
    [updateTask],
  );

  const handleCreateTask = useCallback(
    (payload: { title: string; task_type: string; due_at: string | null }) => {
      createTask.mutate(payload);
    },
    [createTask],
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Care Plan Tasks</h1>
        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          Logout
        </button>
      </div>

      <TaskList
        tasks={tasks}
        onUpdate={handleUpdateTask}
        pendingId={pendingId}
      />
      <CreateTaskForm
        createTask={handleCreateTask}
        error={createTask.error}
        isPending={createTask.isPending}
      />
    </div>
  );
}
