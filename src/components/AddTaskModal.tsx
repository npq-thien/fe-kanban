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
import { CreateTaskInput } from "src/constants/types";
import { useCreateTask } from "src/api/taskApi";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const AddTaskModal = (props: Props) => {
  const { open, handleClose } = props;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    defaultValues: {
      name: "",
      description: "",
      dateTimeFinish: new Date().toISOString().split("T")[0],
      isPublic: false,
      status: "TO_DO",
    },
  });

  // dispatch redux
  const role = useSelector((state: RootState) => state.auth.role);

  const { mutate: createTask } = useCreateTask(); // Hook is called outside onSubmit

  const handleDescriptionChange = (content: string) => {
    setValue("description", content); // Manually set value in the form
  };

  const onSubmit: SubmitHandler<CreateTaskInput> = (data) => {
    // Convert the date to an ISO 8601 string if needed
    const date = new Date(data.dateTimeFinish);
    const isoDate = date.toISOString();
    createTask(
      { ...data, dateTimeFinish: isoDate },
      {
        onSuccess: () => {
          handleClose();
          reset();
        },
      }
    );
  };

  const handleCloseModal = () => {
    handleClose();
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
          <p className="h2-semibold mx-auto">Add new task</p>
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
                autoFocus
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
              <ReactQuill theme="snow" onChange={handleDescriptionChange} />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="btn-primary mr-auto ml-4"
            onClick={handleSubmit(onSubmit)}
          >
            Add task
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default AddTaskModal;
