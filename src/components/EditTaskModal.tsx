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

import { FaList, FaRegClock, FaRegImage } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { Task, UpdateTaskInput } from "src/constants/types";
import {
  useDropTask,
  useTakeTask,
  useUpdateTask,
  useUploadImages,
} from "src/api/taskApi";
import { RootState } from "src/store";
import { useEffect, useState } from "react";
import { showNotification } from "src/utils/notificationUtil";
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
  const { mutateAsync: uploadImages } = useUploadImages();

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

  const onSubmit: SubmitHandler<UpdateTaskInput> = async (data) => {
    // Convert the date to an ISO 8601 string if needed
    const date = new Date(data.dateTimeFinish);
    const isoDate = date.toISOString();

    try {
      updateTask({
        taskId: task.id,
        updatedTask: { ...data, dateTimeFinish: isoDate },
      });

      // If there are images, upload them
      if (images.length > 0) {
        await uploadImages({ taskId: task.id, images });
      }

      showNotification("success", "Updated successfully!");

      // Reset images and preview URLs
      setImages([]);
      setImagePreviewUrl([]);

      // Close the modal and reset the form
      handleClose();
      reset();
    } catch (error) {
      showNotification("error", "Failed to update task or upload images.");
      console.error("Error: ", error);
    }
    setIsEditingDescription(false);
  };

  const handleCloseModal = () => {
    handleClose();
    setIsEditingDescription(false);
    reset();

    setImages([]);
    setImagePreviewUrl([]);
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

              {/* <input
                type="file"
                className="p-2 border-2 border-dashed border-gray-400 rounded-md"
                multiple
                onChange={handleFileChange}
              />

              {imagePreviewUrl.length > 0 && (
                <div>
                  <p>Preview images</p>
                  <div className="flex gap-2">
                    {imagePreviewUrl.map((img) => (
                      <img
                        key={img}
                        src={img}
                        alt="Preview"
                        className="w-auto h-[100px] rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )} */}

              <div>
                <label className="file-label cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="flex gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center text-center bg-white hover:bg-gray-50">
                    <FaRegImage className="text-xl" />
                    <p className="text-gray-600">Click to upload images</p>
                  </div>
                </label>

                {imagePreviewUrl.length > 0 && (
                  <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-700">
                      Preview images
                    </p>
                    <div className="flex gap-4 mt-2 overflow-x-auto">
                      {imagePreviewUrl.map((img, index) => (
                        <div
                          key={index}
                          className="preview-container flex flex-col items-center"
                        >
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            className="w-auto h-[100px] rounded-md shadow-md"
                          />
                          <p className="file-name text-sm mt-2 text-gray-500">
                            {images[index].name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* To show the image of task */}
              <TaskImages taskId={task.id} />
            </div>
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
