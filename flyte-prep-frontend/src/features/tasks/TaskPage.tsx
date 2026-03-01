import type { Task } from "./task.types";
import { useTasks, useUpdateTask, useCreateTask } from "./tasks";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/useAuth";
import { useState } from "react";

const PATIENT_ID = "800dd407-3480-4d3d-b7a9-b54851b3050a";

export default function TasksPage() {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading, error } = useTasks(PATIENT_ID);
  const updateTask = useUpdateTask(PATIENT_ID);
  const createTask = useCreateTask(PATIENT_ID);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [due_at, setDueAt] = useState("");

  function handleSubmit() {
    createTask.mutate({
      title: title,
      task_type: type,
      due_at: new Date(due_at).toISOString(),
    });
  }

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

      {tasks.filter((task: Task) => task.status !== "deleted").map((task: Task) => (
        <div key={task.id} style={{ marginTop: 10 }}>
          <span>
            {task.title} — {task.status}
          </span>

          {task.status !== "completed" && (
            <button
              style={{ marginLeft: 10 }}
              onClick={() => updateTask.mutate({id: task.id, status: "completed"})}
              disabled={updateTask.isPending}
            >
              {updateTask.isPending ? "..." : "Complete"}
            </button>
          )}
          {task.status !== "deleted" && (
            <button
              style={{ marginLeft: 10 }}
              onClick={() => updateTask.mutate({id: task.id, status: "deleted"})}
              disabled={updateTask.isPending}
            >
              {updateTask.isPending ? "..." : "Delete"}
            </button>
          )}
        </div>
      ))}

      <form style={{ display: "flex", flexDirection: "column" }}>
        <h2>Create Task</h2>
        <label htmlFor="title">Enter title</label>
        <input
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="type">Enter type</label>
        <input
          type="text"
          name="type"
          onChange={(e) => setType(e.target.value)}
          value={type}
        />
        <label htmlFor="due_at">Enter date</label>
        <input
          type="datetime-local"
          name="due_at"
          id="dueat"
          onChange={(e) => setDueAt(e.target.value)}
          value={due_at}
        />
        <button
          style={{ width: "fit-content" }}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Submit
        </button>
      </form>
      {createTask?.error?.status === 409 && <p style={{ color: "crimson" }}>Task already exists</p>}
      {createTask?.error && createTask?.error?.status !== 409 && <p style={{ color: "crimson" }}>Something went wrong. Please try again.</p>}
    </div>
  );
}
