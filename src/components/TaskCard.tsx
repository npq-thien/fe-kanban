import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import { Id, Task, TaskActivity } from "../constants/types";
import { formatDueDate } from "src/utils/helper";
import { FaRegClock } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

type Props = {
  task: Task;
  deleteTask?: (id: Id) => void;
  selectTask: (task: Task) => void;

  taskActivities?: TaskActivity[];
};

const TaskCard = (props: Props) => {
  const { task, selectTask, taskActivities } = props;
  // const [openDeleteTask, setOpenDeleteTask] = useState(false);
  const [activityByTask, setActivityByTask] = useState<TaskActivity[]>([]);

  // console.log('in task', task)

  useEffect(() => {
    const filteredActivities = taskActivities?.filter(
      (activity) => activity.taskId === task.id
    );
    setActivityByTask(filteredActivities || []);
  }, [taskActivities, task.id]);

  // const handleOpenDeleteTask = (event: any) => {
  //   event.stopPropagation(); // Prevents the click event from the parent div (openEdit)
  //   setOpenDeleteTask(true);
  // };

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
    transform: CSS.Translate.toString(transform),
  };

  console.log("task here", task.assignedUserDisplayName);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={task.id}
        className="overflow-y-auto p-2 rounded-xl bg-white break-words opacity-25 border-2 border-blue-400 flex-col justify-center"
      >
        <p className="line-clamp-2">{task.name}</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="flex-center gap-2 p-1 bg-yellow-300 rounded-md">
            <FaRegClock />
            {formatDueDate(task.dateTimeFinish.toString())}
          </p>
          {task.isPublic &&
            (task.assignedUserDisplayName ? (
              <HiUserGroup className="text-orange-500" />
            ) : (
              <HiUserGroup className="text-gray-500" />
            ))}

          {activityByTask.length > 0 && (
            <div className="flex items-center gap-1">
              <IoChatbubbleEllipsesOutline />
              <p className="text-tiny">{activityByTask.length}</p>
            </div>
          )}
        </div>
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
        className="overflow-y-auto p-2 rounded-xl bg-white break-words border-2 hover:border-blue-400 group cursor-grab"
        onClick={() => selectTask(task)}
      >
        {/* <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-light-2
       hover:bg-light-3 p-1 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleOpenDeleteTask}
        >
          <MdDeleteForever />
        </button> */}
        <p className="line-clamp-2">{task.name}</p>

        <div className="flex items-center gap-2 mt-2">
          <p className="flex-center gap-2 py-0.5 px-1.5 bg-yellow-300 rounded-md">
            <FaRegClock />
            {formatDueDate(task.dateTimeFinish.toString())}
          </p>
          {task.isPublic &&
            (task.assignedUserDisplayName ? (
              <HiUserGroup className="text-orange-500" />
            ) : (
              <HiUserGroup className="text-gray-500" />
            ))}

          {activityByTask.length > 0 && (
            <div className="flex items-center gap-1">
              <IoChatbubbleEllipsesOutline />
              <p className="text-tiny">{activityByTask.length}</p>
            </div>
          )}
        </div>
      </div>

      {/* modal delete task confirm */}
      {/* <Dialog open={openDeleteTask} onClose={handleCloseDeleteTask}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete task{" "}
            <span className="text-red-500">{task.name}</span>?
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
      </Dialog> */}
    </div>
  );
};

export default TaskCard;
