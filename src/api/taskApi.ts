import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, BASE_URL } from "src/configs/AxiosConfig";
import { QUERY_KEYS } from "./queryKey";
import {
  CreateTaskInput,
  MoveTaskInput,
  SearchTaskInput,
  UpdateTaskInput,
} from "src/constants/types";
import { AxiosRequestConfig } from "axios";

export const useGetAllTasks = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/task`);
      return response.data;
    } catch (error) {
      console.log("Fetch data all tasks failed: ", error);
    }
  };

  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_TASKS],
    queryFn: fetchData,
    onError: (error) => console.log("Get all tasks failed: ", error),
    refetchOnWindowFocus: false,
  });
};

export const useGetUserTasks = (userId: string) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/task/${userId}`);
      return response.data;
    } catch (error) {
      console.log("Fetch data user tasks failed: ", error);
    }
  };

  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_TASKS, userId],
    queryFn: fetchData,
    onError: (error) => console.log("Get user tasks failed: ", error),
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};

export const useSearchTask = (
  searchTaskInput: AxiosRequestConfig<SearchTaskInput>
) => {
  const fetchData = async () => {
    try {
      const response = await api.get(
        `${BASE_URL}/api/task/search`,
        searchTaskInput
      );
      return response.data;
    } catch (error) {
      console.log("Search tasks failed: ", error);
    }
  };

  return useQuery({
    queryKey: [QUERY_KEYS.GET_SEARCHED_TASKS, searchTaskInput.params?.taskName],
    queryFn: fetchData,
    onError: (error) => console.log("Search tasks failed: ", error),
    refetchOnWindowFocus: false,
    enabled: !!searchTaskInput.params?.taskName,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: CreateTaskInput) => {
      const response = await api.post(`${BASE_URL}/api/task`, newTask);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_USER_TASKS]);
    },
    onError: (error) => {
      console.log("Create task failed", error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      updatedTask,
    }: {
      taskId: string;
      updatedTask: UpdateTaskInput;
    }) => {
      const response = await api.put(
        `${BASE_URL}/api/task/${taskId}`,
        updatedTask
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_USER_TASKS]);
    },
    onError: (error) => {
      console.log("Update task failed", error);
    },
  });
};

export const useTakeTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.put(`${BASE_URL}/api/task/take/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_USER_TASKS]);
    },
    onError: (error) => {
      console.log("Take task failed", error);
    },
  });
};

export const useDropTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await api.put(`${BASE_URL}/api/task/drop/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_USER_TASKS]);
    },
    onError: (error) => {
      console.log("Take task failed", error);
    },
  });
};

export const useMoveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MoveTaskInput) => {
      const response = await api.put(`${BASE_URL}/api/task/move`, request);
      return response.data;
    },
    onSuccess: () => {
      console.log("move task ok");
      queryClient.invalidateQueries([QUERY_KEYS.GET_USER_TASKS]);
    },
    onError: (error) => {
      console.log("Take task failed", error);
    },
  });
};
