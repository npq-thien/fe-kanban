import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MdOutlineSubtitles } from "react-icons/md";
import { BsTextParagraph } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import "react-quill/dist/quill.snow.css";

import { FaList, FaRegClock } from "react-icons/fa";
import ReactQuill from "react-quill";
import { SubmitHandler, useForm } from "react-hook-form";
import { Task, UpdateTaskInput } from "src/constants/types";
import { useUpdateTask } from "src/api/taskApi";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useEffect, useRef, useState } from "react";

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
  const role = useSelector((state: RootState) => state.auth.role);
  const [taskDescription, setTaskDescription] = useState(
    task.description || ""
  );
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // console.log("task modal", task);

  // Sync form values with selected task whenever it changes
  useEffect(() => {
    if (task) {
      setValue("name", task.name);
      setValue("description", task.description);
      setValue(
        "dateTimeFinish",
        new Date(task.dateTimeFinish).toISOString().split("T")[0]
      );
      setValue("isPublic", task.isPublic);
      setValue("status", task.status);
    }
  }, [task, setValue]);

  const { mutate: updateTask } = useUpdateTask();

  const handleDescriptionChange = (content: string) => {
    setTaskDescription(content);
    setValue("description", content);
  };


  const onSubmit: SubmitHandler<UpdateTaskInput> = (data) => {
    // console.log("submit", data);
    // Convert the date to an ISO 8601 string if needed
    const date = new Date(data.dateTimeFinish);
    const isoDate = date.toISOString();
    updateTask(
      { taskId: task.id, updatedTask: { ...data, dateTimeFinish: isoDate } },
      {
        onSuccess: () => {
          handleClose();
          reset();
        },
      }
    );
    setIsEditingDescription(false);
  };

  const handleCloseModal = () => {
    handleClose();
    setIsEditingDescription(false);
    reset();
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
                Title
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
                From
              </h3>
              <select className="p-1 px-6 rounded-md" {...register("status")}>
                <option value={"TO_DO"}>Open</option>
                <option value={"IN_PROGRESS"}>In progress</option>
                <option value={"DONE"}>Done</option>
                <option value={"CANCEL"}>Cancel</option>
              </select>
            </div>

            {/* Due date and checkbox public */}
            <div className="flex gap-12">
              <div className="flex items-center gap-4">
                <h3 className="flex items-center text-lg font-semibold gap-4">
                  <FaRegClock />
                  Due date
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
                  disabled={role === "MEMBER"}
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
                  className="p-1 px-2 bg-white rounded-md"
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
