import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import { Id, Task, TaskActivity } from "../constants/types";
import { formatDueDate } from "src/utils/helper";
import { FaRegClock, FaUserCircle } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { BsTextParagraph } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";

type Props = {
  task: Task;
  deleteTask?: (id: Id) => void;
  selectTask: (task: Task) => void;

  taskActivities?: TaskActivity[];
};

const TaskCard = (props: Props) => {
  const { task, selectTask } = props;

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

  // if (task) console.log("in task", task.imageIds);

  const dateTimeColor = () => {
    if (task.status === "DONE") {
      return "bg-green-400";
    } else if (task.status === "CANCEL") {
      return "bg-gray-300";
    } else if (new Date(task.dateTimeFinish) < new Date()) {
      return "bg-red-300";
    } else {
      return "bg-yellow-300";
    }
  };

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
          <p className={`flex-center gap-2 p-1 rounded-md ${dateTimeColor()}`}>
            <FaRegClock />
            {formatDueDate(task.dateTimeFinish.toString())}
          </p>
          {task.isPublic &&
            task.isPublic &&
            (task.assignedUserDisplayName ? (
              <HiUserGroup className="text-orange-500" />
            ) : (
              <HiUserGroup className="text-gray-500" />
            ))}

          {task.description &&
            task.description !== "<p><br></p>" &&
            task.description !== "<p></p>" && <BsTextParagraph />}

          {task.imageIds.length > 0 && <p>co image</p>}
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
        className="overflow-y-auto p-2 rounded-lg bg-white break-words border-2 hover:border-blue-400 group cursor-grab"
        onClick={() => selectTask(task)}
      >
        <p className="line-clamp-2">{task.name}</p>

        <div className="flex-between">
          <div className="flex items-center gap-2 mt-2">
            <p
              className={`flex-center items-center gap-2 py-0.5 px-1.5 text-sm rounded-md ${dateTimeColor()}`}
            >
              <FaRegClock />
              {formatDueDate(task.dateTimeFinish.toString())}
            </p>
            {/* Show public task icon */}
            {task.isPublic &&
              (task.assignedUserDisplayName ? (
                <HiUserGroup className="text-orange-500" />
              ) : (
                <HiUserGroup className="text-gray-500" />
              ))}
            {/* "<p><br></p>" is the default string will save into DB if nothing in the rich text provider */}
            {task.description && task.description !== "<p><br></p>" && (
              <BsTextParagraph />
            )}
            {/* Show image icon */}
            {task.imageIds.length > 0 && <IoMdImages />}
          </div>

          {task.assignedUserDisplayName && task.isPublic && (
            <Tooltip title={task.assignedUserDisplayName} placement="top">
              <IconButton>
                <FaUserCircle className="text-orange-500 text-xl" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
