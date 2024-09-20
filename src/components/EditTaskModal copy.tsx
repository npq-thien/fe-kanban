import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MdOutlineSubtitles } from "react-icons/md";
import { BsFillCalendar2DateFill, BsTextParagraph } from "react-icons/bs";
import { RxActivityLog } from "react-icons/rx";
import { IoIosAttach, IoMdClose, IoMdPricetags } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";

import { Id, Task, TaskActivity } from "../constants/types";
import TaskActivityItem from "./TaskActivityItem";
import { FaArchive, FaArrowRight, FaCopy, FaUser } from "react-icons/fa";

type Props = {
  task: Task;
  addTaskActivity: (activityContent: string) => void;

  open: boolean;
  handleClose: () => void;
  editTaskTitle?: (id: Id, title: string) => void;

  taskActivities: TaskActivity[];
};

const addToCard = [
  {
    title: "Members",
    icon: <FaUser />,
  },
  {
    title: "Labels",
    icon: <IoMdPricetags />,
  },
  {
    title: "Dates",
    icon: <BsFillCalendar2DateFill />,
  },
  {
    title: "Attachment",
    icon: <IoIosAttach />,
  },
];

const actions = [
  {
    title: "Move",
    icon: <FaArrowRight />,
  },
  {
    title: "Copy",
    icon: <FaCopy />,
  },
  {
    title: "Archive",
    icon: <FaArchive />,
  },
];

const EditTaskModal = (props: Props) => {
  const {
    task,
    taskActivities: initTaskActivities,
    addTaskActivity,
    open,
    handleClose,
    editTaskTitle,
  } = props;
  const [taskActivities, setTaskActivities] = useState(initTaskActivities);
  const [isAddingTaskActivity, setIsAddingTaskActivity] = useState(false);
  const [activityContent, setActivityContent] = useState("");

  const [taskTitle, setTaskTitle] = useState(task.name);
  const [isEditTaskTitle, setIsEditTaskTitle] = useState(false);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [isEditTaskDescription, setIsEditTaskDescription] = useState(false);

  // Sync data from Board to Modal
  useEffect(() => {
    setTaskTitle(task.name);
    setTaskDescription(task.description);
    setTaskActivities(initTaskActivities);
  }, [task.name, task.description, initTaskActivities]);

  const handleEditTaskTitle = () => {
    if (editTaskTitle) editTaskTitle(task.id, taskTitle);
    if (taskTitle.trim() !== "") {
      setIsEditTaskTitle(false);
    }
    task.name = taskTitle;
  };

  const handleAddingTaskActivity = () => {
    addTaskActivity(activityContent);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true}>
      <div className="bg-slate-100">
        <DialogTitle className="flex items-center gap-4 border-b-2">
          <MdOutlineSubtitles />
          {!isEditTaskTitle ? (
            <h2
              className="text-2xl font-semibold p-1 w-full"
              onClick={() => setIsEditTaskTitle(true)}
            >
              {task.name}
            </h2>
          ) : (
            <input
              autoFocus
              className="text-2xl font-semibold w-full p-1 px-2 rounded-md mr-8"
              placeholder="Add a description"
              defaultValue={taskTitle}
              //    TODO: handle empty case
              onBlur={handleEditTaskTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditTaskTitle();
                }
              }}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          )}
          <button
            className="absolute right-4 p-1 rounded-md hover:bg-dark-1"
            onClick={handleClose}
          >
            <IoMdClose />
          </button>
        </DialogTitle>
        <DialogContent className="grid grid-cols-4 w-full mt-4">
          <div className="flex flex-col gap-4 col-span-3">
            {/* Description */}
            <div className="flex justify-between">
              <h3 className="flex items-center text-lg font-semibold gap-4">
                <BsTextParagraph />
                Description
              </h3>
              <button
                className="btn-primary bg-gray-300 text-black"
                onClick={() => setIsEditTaskDescription(true)}
              >
                Edit
              </button>
            </div>

            {isEditTaskDescription ? (
              <div>
                <ReactQuill
                  theme="snow"
                  value={taskDescription}
                  onChange={setTaskDescription}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setIsEditTaskDescription(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setIsEditTaskDescription(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-xl p-2"
                dangerouslySetInnerHTML={{ __html: taskDescription }}
              />
            )}

            {/* Activities (comments) */}
            <div>
              <h3 className="flex items-center text-lg font-semibold gap-4 mb-4">
                <RxActivityLog />
                Activity
              </h3>
              {/* Write new comment */}
              <div className="mt-4">
                {isAddingTaskActivity ? (
                  <div>
                    <ReactQuill
                      theme="snow"
                      value={activityContent}
                      onChange={setActivityContent}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          handleAddingTaskActivity();
                          setActivityContent("");
                          setIsAddingTaskActivity(false);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setIsAddingTaskActivity(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    className="w-full p-1 rounded-md hover:bg-slate-200 "
                    placeholder="Leave a comment for this task"
                    onClick={() => setIsAddingTaskActivity(true)}
                  />
                )}
              </div>

              {/* Render exist activities */}
              <div className="flex flex-col gap-4 mt-4">
                {taskActivities.map(
                  (item: TaskActivity) =>
                    item.taskId === task.id && (
                      <TaskActivityItem key={item.id} taskActivity={item} />
                    )
                )}
              </div>
            </div>
          </div>

          {/* Card features */}
          <div className="col-span-1 ml-4">
            <p className="text-dark-2 text-tiny mb-2">Add to card</p>
            <div className="flex flex-col gap-2">
              {addToCard.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-2 w-full btn-primary py-1 rounded-md bg-slate-300 text-black"
                >
                  {item.icon}
                  {item.title}
                </button>
              ))}
            </div>

            <p className="text-dark-2 text-tiny mt-8 mb-2">Actions</p>
            <div className="flex flex-col gap-2">
              {actions.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-2 w-full btn-primary py-1 rounded-md bg-slate-300 text-black"
                >
                  {item.icon}
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default EditTaskModal;
