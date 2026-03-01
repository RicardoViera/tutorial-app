export type Task = {
    id: string;
    title: string;
    task_type: string;
    status: "active" | "completed" | "deleted";
    due_at: string | null;
    completed_at: string | null;
  };