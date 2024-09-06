import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { MdOutlineSubtitles } from "react-icons/md";
import { BsTextParagraph } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";

import { Id, Task, TaskActivity } from "../constants/types";
import { FaList, FaRegClock } from "react-icons/fa";
import ReactQuill from "react-quill";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const AddTaskModal = (props: Props) => {
  const { open, handleClose } = props;
  const [taskTitle, setTaskTitle] = useState("");
  const [columnTitle, setColumnTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [taskDescription, setTaskDescription] = useState("");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            {/* Title */}
            <div className="flex items-center gap-4">
              <h3 className="flex items-center text-lg font-semibold gap-4">
                <MdOutlineSubtitles />
                Title
              </h3>
              <input
                autoFocus
                className="font-semibold w-full ml-1 p-1 px-2 rounded-md"
                placeholder="Add a title"
                defaultValue={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-between">
              {/* Status */}
              <div className="flex items-center gap-4">
                <h3 className="flex items-center text-lg font-semibold gap-4">
                  <FaList />
                  From
                </h3>
                <select
                  className="p-1 px-2 rounded-md"
                  value={columnTitle}
                  // onChange={(e) => setColumnTitle(e.target.value)}
                >
                  <option value={10}>Open</option>
                  <option value={20}>In progress</option>
                  <option value={30}>Done</option>
                  <option value={30}>Cancel</option>
                </select>
              </div>

              {/* Due date */}
              <div className="flex items-center gap-4">
                <h3 className="flex items-center text-lg font-semibold gap-4">
                  <FaRegClock />
                  Due date
                </h3>

                <input className="p-1 px-2 rounded-md" type="date" />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-36">
                <h3 className="flex items-center text-lg font-semibold gap-4">
                  <BsTextParagraph />
                  Description
                </h3>

                <div className="flex items-center gap-2">
                  {/* checkbox here */}
                  <input
                    type="checkbox"
                    id="publicCheckbox"
                    className="w-5 h-5"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <label
                    htmlFor="publicCheckbox"
                    className="text-md font-semibold "
                  >
                    Public
                  </label>
                </div>
              </div>
              <ReactQuill
                theme="snow"
                value={taskDescription}
                onChange={setTaskDescription}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="btn-primary mr-auto ml-4">Add task</button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default AddTaskModal;
