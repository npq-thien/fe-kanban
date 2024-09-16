import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MdAssignmentInd, MdOutlineSubtitles } from "react-icons/md";
import { BsTextParagraph } from "react-icons/bs";
import { IoMdClose, IoMdImages } from "react-icons/io";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";

import { FaList, FaRegClock } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { Task, UpdateTaskInput } from "src/constants/types";
import {
  useDropTask,
  useGetTaskImages,
  useTakeTask,
  useUpdateTask,
  useUploadImages,
} from "src/api/taskApi";
import { RootState } from "src/store";
import { useEffect, useState } from "react";
import { showNotification } from "src/utils/notificationUtil";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "src/configs/firebase";
import { generateId } from "src/utils/helper";
import TaskImages from "./TaskImage";

type Props = {
  open: boolean;
  handleClose: () => void;

  task: Task;
};

const EditTaskModal = (props: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskInput>();

  const { open, task, handleClose } = props;
  const currentUser = useSelector((state: RootState) => state.auth);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Upload image
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string[]>([]);

  const [taskDescription, setTaskDescription] = useState(
    task.description || ""
  );

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: takeTask } = useTakeTask();
  const { mutate: dropTask } = useDropTask();
  const { mutate: uploadImages } = useUploadImages();

  // console.log("task modal", task);

  useEffect(() => {
    // Create object URLs for each image file
    if (images.length > 0) {
      const previewUrls = images.map((image) => URL.createObjectURL(image));
      setImagePreviewUrl(previewUrls);

      // Clean up object URLs on component unmount or image change
      return () => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [images]);

  // Sync form values with selected task whenever it changes
  useEffect(() => {
    if (task) {
      setValue("name", task.name);
      setValue("description", task.description);
      setTaskDescription(task.description);
      setValue(
        "dateTimeFinish",
        new Date(task.dateTimeFinish).toISOString().split("T")[0]
      );
      setValue("isPublic", task.isPublic);
      setValue("status", task.status);
    }
  }, [task, setValue]);

  const handleDescriptionChange = (content: string) => {
    setTaskDescription(content);
    setValue("description", content);
  };

  const onSubmit: SubmitHandler<UpdateTaskInput> = (data) => {
    // Convert the date to an ISO 8601 string if needed
    const date = new Date(data.dateTimeFinish);
    const isoDate = date.toISOString();
    updateTask(
      { taskId: task.id, updatedTask: { ...data, dateTimeFinish: isoDate } },
      {
        onSuccess: () => {
          handleClose();
          reset();
          setTaskDescription("");
        },
        onError: () => {
          showNotification(
            "warning",
            "Only creator and assignee can edit the task."
          );
          reset();
          setTaskDescription("");
        },
      }
    );

    // Upload image to database
    if (images.length > 0) {
      uploadImages(
        { taskId: task.id, images },
        {
          onSuccess: () => {
            showNotification("success", "Images uploaded!");
            setImages([]); // Empty the current images
          },
          onError: (error) => {
            showNotification("error", "Image upload failed" + error);
          },
        }
      );
    }

    setIsEditingDescription(false);
  };

  const handleCloseModal = () => {
    handleClose();
    setIsEditingDescription(false);
    reset();
  };

  const handleTakeTask = () => {
    takeTask(task.id, {
      onSuccess: () => {
        showNotification("success", "Take task successfully!");
        handleClose();
      },
      onError: (error) => {
        showNotification("error", "Take task failed!" + error);
      },
    });
  };

  const handleDropTask = () => {
    dropTask(task.id, {
      onSuccess: () => {
        showNotification("success", "Drop task successfully!");
        handleClose();
      },
      onError: (error) => {
        showNotification("error", "Drop task failed!" + error);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // setImages([...e.target.files]);
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="sm"
      fullWidth={true}
      PaperProps={{
        sx: { borderRadius: "16px" }, // Custom radius for MUI Dialog Paper
      }}
    >
      <div className="bg-slate-100">
        <DialogTitle className="flex items-center gap-4 border-b-2">
          <p className="h2-semibold mx-auto">Edit task</p>
          <button
            className="absolute right-4 p-1 rounded-md hover:bg-dark-1"
            onClick={handleClose}
          >
            <IoMdClose />
          </button>
        </DialogTitle>

        <DialogContent className="w-full">
          <div className="flex flex-col w-full gap-6 mt-4">
            <div className="flex items-center gap-4">
              <h3 className="flex items-center text-lg font-semibold gap-4 mr-[6%]">
                <MdOutlineSubtitles />
                <div className="flex gap-1">
                  Title
                  <p className="text-red-500">*</p>
                </div>
              </h3>
              <input
                className="font-semibold w-full ml-1 p-1 px-2 rounded-md"
                placeholder="Add a title"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Task title is required",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <h3 className="flex items-center text-lg font-semibold gap-4 mr-[6%]">
                <FaList />
                <div className="flex gap-1">
                  From
                  <p className="text-red-500">*</p>
                </div>
              </h3>
              <select
                className="p-1 px-6 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                {...register("status")}
              >
                <option value={"TO_DO"}>🔘 Open</option>
                <option value={"IN_PROGRESS"}>⏳ In progress</option>
                <option value={"DONE"}>✅ Done</option>
                <option value={"CANCEL"}>🚫 Cancel</option>
              </select>
            </div>

            {/* Due date and checkbox public */}
            <div className="flex gap-12">
              <div className="flex items-center gap-4">
                <h3 className="flex items-center text-lg font-semibold gap-4">
                  <FaRegClock />
                  <div className="flex gap-1">
                    Due date
                    <p className="text-red-500">*</p>
                  </div>
                </h3>

                <input
                  className="p-1 px-2 rounded-md"
                  type="date"
                  {...register("dateTimeFinish", {
                    required: {
                      value: true,
                      message: "Date is required",
                    },
                  })}
                />
                {errors.dateTimeFinish && (
                  <p className="text-red-500">
                    {errors.dateTimeFinish.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publicCheckbox"
                  className="w-5 h-5"
                  disabled={currentUser.role === "MEMBER"}
                  {...register("isPublic")}
                />
                <label
                  htmlFor="publicCheckbox"
                  className="text-md font-semibold "
                >
                  Public
                </label>
              </div>
            </div>

            {/* Assigned user */}
            <div className="flex items-center gap-4">
              <h3 className="flex items-center text-lg font-semibold gap-4">
                <MdAssignmentInd />
                Assignee
              </h3>
              {task.assignedUserId ? (
                <>
                  <div className="font-semibold bg-white p-1 px-2 ml-4 rounded-md">
                    {task.assignedUserDisplayName}
                  </div>
                  {/* Only task's owner can drop the public task in TODO status */}
                  {task.assignedUserId === currentUser.userId &&
                    task.isPublic &&
                    task.status === "TO_DO" && (
                      <button
                        className="btn-primary bg-gold"
                        onClick={handleDropTask}
                      >
                        Drop
                      </button>
                    )}
                </>
              ) : (
                <>
                  <p className="text-red-500">No one assigned</p>
                  <button
                    className="btn-primary bg-gold"
                    onClick={handleTakeTask}
                  >
                    Take
                  </button>
                </>
              )}
            </div>

            {/* Upload image */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-36">
                <h3 className="flex items-center text-lg font-semibold gap-4">
                  <IoMdImages />
                  Images
                </h3>
              </div>

              <input type="file" multiple onChange={handleFileChange} />
            </div>

            {/* {imagePreviewUrl && (
              <div className="flex gap-2">
                {imagePreviewUrl.map((img) => (
                  <img
                    src={img}
                    alt="Preview"
                    className="w-auto h-[100px] rounded-md"
                  />
                ))}
              </div>
            )} */}
            <TaskImages taskId={task.id} />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-36">
                <h3 className="flex items-center text-lg font-semibold gap-4">
                  <BsTextParagraph />
                  Description
                </h3>
              </div>

              {task.description && !isEditingDescription ? (
                <div
                  className="p-1 px-2 bg-white rounded-md formatted-css"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                  onClick={() => setIsEditingDescription(true)}
                ></div>
              ) : (
                <ReactQuill
                  theme="snow"
                  value={taskDescription}
                  onChange={handleDescriptionChange}
                />
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="mr-auto ml-4 flex gap-2">
            <button className="btn-primary" onClick={handleSubmit(onSubmit)}>
              Save
            </button>
            <button
              className="btn-primary bg-red-500"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default EditTaskModal;
