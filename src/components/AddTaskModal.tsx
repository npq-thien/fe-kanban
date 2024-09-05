import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MdOutlineSubtitles } from "react-icons/md";
import { BsTextParagraph } from "react-icons/bs";
import { RxActivityLog } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";

import { Id, Task, TaskActivity } from "../constants/types";
import TaskActivityItem from "./TaskActivityItem";

type Props = {
  task: Task;
  addTaskActivity: (activityContent: string) => void;

  open: boolean;
  handleClose: () => void;
  editTaskTitle?: (id: Id, title: string) => void;

  taskActivities: TaskActivity[];
};

const AddTaskModal = (props: Props) => {
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

  const [taskTitle, setTaskTitle] = useState(task.title);
  const [isEditTaskTitle, setIsEditTaskTitle] = useState(false);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [isEditTaskDescription, setIsEditTaskDescription] = useState(false);

  // Sync data from Board to Modal
  useEffect(() => {
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskActivities(initTaskActivities);
  }, [task.title, task.description, initTaskActivities]);

  const handleEditTaskTitle = () => {
    if (editTaskTitle) editTaskTitle(task.id, taskTitle);
    if (taskTitle.trim() !== "") {
      setIsEditTaskTitle(false);
    }
    task.title = taskTitle;
  };

  const handleAddingTaskActivity = () => {
    addTaskActivity(activityContent);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true}>
      <div className="bg-slate-100">
        <DialogTitle className="flex items-center gap-4 border-b-2">
          <p className="h2-semibold mx-auto">Add task</p>
          <button
            className="absolute right-4 p-1 rounded-md hover:bg-dark-1"
            onClick={handleClose}
          >
            <IoMdClose />
          </button>
        </DialogTitle>
        <DialogContent className="w-full mt-4">
          <div className="flex items-center gap-4">
            <MdOutlineSubtitles />
            {!isEditTaskTitle ? (
              <h2
                className="text-2xl font-semibold p-1 w-full"
                onClick={() => setIsEditTaskTitle(true)}
              >
                {task.title}
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
          </div>

          <div className="flex flex-col gap-4">
            {/* Description */}
            <div className="flex justify-between">
              <h3 className="flex items-center text-lg font-semibold gap-4">
                <BsTextParagraph />
                Content
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
                className="formatted-css bg-white rounded-xl p-2"
                dangerouslySetInnerHTML={{ __html: taskDescription }}
              />
            )}

            {/* Activities (comments) */}
            <div>
              <h3 className="flex items-center text-lg font-semibold gap-4 mb-4">
                <RxActivityLog />
                Comments
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
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default AddTaskModal;
