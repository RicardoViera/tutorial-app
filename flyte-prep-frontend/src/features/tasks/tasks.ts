import { api } from "../../lib/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type { Task } from "./task.types";

export const useTasks = (patientId: string) =>
  useQuery({
    queryKey: ["tasks", patientId],
    queryFn: async () => {
      const { data } = await api.get(`/patients/${patientId}/tasks`);
      return data;
    },
  });

export const useUpdateTask = (patientId: string) => {
  const qc = useQueryClient();
  const key = ["tasks", patientId] as const;
  // const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  return useMutation({
    mutationFn: async (taskUpdate: any) => {
      // await sleep(1500)
      const { data } = await api.patch(`/tasks/${taskUpdate.id}/update`, { status: taskUpdate.status });
      return data;
    },

    onMutate: async (taskUpdate: any) => {
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<Task[]>(key);

      qc.setQueryData<Task[]>(key, (old = []) =>
        old.map((t) => (t.id === taskUpdate.id ? { ...t, status: taskUpdate.status } : t)),
      );

      return { prev };
    },

    onError: (_err, _taskId, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });
};

export const useCreateTask = (patientId: string) => {
  const qc = useQueryClient();
  const key = ["tasks", patientId] as const;

  return useMutation({
    mutationFn: async (payload: any) => {
    
      const { data } = await api.post(`/patients/${patientId}/tasks`, payload);
      return data;
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
    },

    onError: (err: any) => {
      return err;
    },
  });
};
