import { useCallback, useMemo, useState } from "react";

type CreateTaskPayload = {
  title: string;
  task_type: string;
  due_at: string | null;
};

type CreateTaskFormProps = {
  createTask: (payload: CreateTaskPayload) => void;
  error: { status?: number } | null;
  isPending: boolean;
};

export default function CreateTaskForm({
  createTask,
  error,
  isPending,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("");
  const [due_at, setDueAt] = useState<string>("");

  const dueAtIso = useMemo(() => {
    if (!due_at) return null;
    return new Date(due_at).toISOString();
  }, [due_at]);

  const canSubmit =
    title.trim().length > 0 &&
    taskType.trim().length > 0 &&
    due_at.trim().length > 0;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    createTask({
      title: title.trim(),
      task_type: taskType.trim(),
      due_at: dueAtIso,
    });
  }, [canSubmit, createTask, title, taskType, dueAtIso]);

  return (
    <div>
      <h2>Create Task</h2>
      <form style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="title">Enter title</label>
        <input
          required
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="type">Enter type</label>
        <input
          required
          type="text"
          name="type"
          onChange={(e) => setTaskType(e.target.value)}
          value={taskType}
        />
        <label htmlFor="due_at">Enter date</label>
        <input
          required
          type="datetime-local"
          name="due_at"
          id="dueat"
          onChange={(e) => setDueAt(e.target.value)}
          value={due_at}
        />
        <button
          disabled={isPending || !canSubmit}
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
      {error && error?.status === 409 && (
        <p style={{ color: "crimson" }}>Task already exists</p>
      )}
      {error && error?.status !== 409 && (
        <p style={{ color: "crimson" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
