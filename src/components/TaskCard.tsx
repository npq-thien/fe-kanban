import { MdDeleteForever } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { Id, Task, TaskActivity } from "../constants/types";

type Props = {
  task: Task;
  deleteTask?: (id: Id) => void;
  selectTask: (task: Task) => void;

  taskActivities?: TaskActivity[];
};

const TaskCard = (props: Props) => {
  const { task, deleteTask, selectTask, taskActivities } = props;
  const [openDeleteTask, setOpenDeleteTask] = useState(false);
  const [activityByTask, setActivityByTask] = useState<TaskActivity[]>([]);

  useEffect(() => {
    const filteredActivities = taskActivities?.filter(
      (activity) => activity.taskId === task.id
    );
    setActivityByTask(filteredActivities || []);
  }, [taskActivities, task.id]);

  const handleOpenDeleteTask = (event: any) => {
    event.stopPropagation(); // Prevents the click event from the parent div (openEdit)
    setOpenDeleteTask(true);
  };

  const handleCloseDeleteTask = () => {
    setOpenDeleteTask(false);
  };

  const handleConfirmDeleteTask = () => {
    if (deleteTask) deleteTask(task.id);
    setOpenDeleteTask(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={task.id}
        className="relative overflow-y-auto p-2 rounded-xl bg-white break-words opacity-25 overflow-hidden border-2 border-blue-400"
      >
        {task.title}
        {activityByTask.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <IoChatbubbleEllipsesOutline />
            <p className="text-tiny">{activityByTask.length}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={task.id}
        className="relative overflow-y-auto p-2 rounded-xl bg-white break-words border-2 hover:border-blue-400 overflow-hidden group cursor-grab"
        onClick={() => selectTask(task)}
      >
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-light-2
       hover:bg-light-3 p-1 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleOpenDeleteTask}
        >
          <MdDeleteForever />
        </button>
        <p>{task.title}</p>

        {activityByTask.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <IoChatbubbleEllipsesOutline />
            <p className="text-tiny">{activityByTask.length}</p>
          </div>
        )}
      </div>
      <Dialog open={openDeleteTask} onClose={handleCloseDeleteTask}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete task{" "}
            <span className="text-red-500">{task.title}</span>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="btn-secondary border-gray-500"
            onClick={handleCloseDeleteTask}
          >
            Cancel
          </button>
          <button
            className="btn-primary bg-red-500"
            onClick={handleConfirmDeleteTask}
          >
            Agree
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskCard;
