import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, BASE_URL } from "src/configs/AxiosConfig";
import { QUERY_KEYS } from "./queryKey";
import { CreateTaskInput } from "src/constants/types";

export const useGetAllTasks = () => {
  const fetchData = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/task`);
      console.log('i fetched')
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

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: CreateTaskInput) => {
      const response = await api.post(`${BASE_URL}/api/task`, newTask);
      return response.data;
    },
    onSuccess: () => {
      console.log("Create task success");
      queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_TASKS]);
    },
    onError: (error) => {
      console.log("Create task failed", error);
    },
  });
};
