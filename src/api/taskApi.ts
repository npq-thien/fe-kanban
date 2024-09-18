import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, BASE_URL } from "src/configs/AxiosConfig";
import { QUERY_KEYS } from "./queryKey";
import {
  CreateTaskInput,
  MoveTaskInput,
  UpdateTaskInput,
} from "src/constants/types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "src/configs/firebase";

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

export const useGetTaskImages = (taskId: string) => {
  const fetchData = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/task/${taskId}/images`);
      return response.data;
    } catch (error) {
      console.log("Fetch images url for task failed: ", error);
    }
  };

  return useQuery({
    queryKey: [QUERY_KEYS.GET_IMAGE_URL_FOR_TASK],
    queryFn: fetchData,
    onError: (error) => console.log("Get task images failed: ", error),
    refetchOnWindowFocus: false,
  });
};

export const useDeleteTaskImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageId,
      imageUrl,
    }: {
      imageId: string;
      imageUrl: string;
    }) => {
      try {
        // Step 1: Delete the image from Firebase Storage
        // const imagePath = `images/${imageId}`;
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        // Step 2: Call API to remove the image record in DB
        const response = await api.delete(`/api/task/images/${imageId}`);
        return response.data;
      } catch (error) {
        console.error("Delete image failed", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.GET_IMAGE_URL_FOR_TASK]);
    },
    onError: (error) => {
      console.log("Delete image failed", error);
    },
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

export const useUploadImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      images,
    }: {
      taskId: string;
      images: File[];
    }) => {
      // Step 1: Upload all images to Firebase and get their URLs
      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `images/${image.name}_${Date.now()}`);
          await uploadBytes(imageRef, image);
          const url = await getDownloadURL(imageRef);
          return url;
        })
      );
      // Step 2: Send image URLs to the backend to associate them with the task
      const response = await api.post(
        `/api/task/${taskId}/images`,
        uploadedImageUrls
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the task query to refetch data and show updated images
      console.log("upload done");
      queryClient.invalidateQueries([QUERY_KEYS.GET_USER_TASKS]);
    },
    onError: (error) => {
      console.log("Image upload failed", error);
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
      queryClient.invalidateQueries([QUERY_KEYS.GET_USER_TASKS]);
    },
    onError: (error) => {
      console.log("Take task failed", error);
    },
  });
};
