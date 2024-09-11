import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

import { Column, Id, Task, TaskActivity } from "../constants/types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import TaskCard from "./TaskCard";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

type Props = {
  isPublic: boolean;
  column: Column;

  tasks: Task[];
  openAddTask: () => void;
  selectTask: (task: Task) => void;
  editTaskTitle?: (taskId: Id, newTaskTitle: string) => void;

  taskActivities: TaskActivity[];
};

const ColumnContainer = (props: Props) => {
  const { isPublic, column, tasks, selectTask, openAddTask, taskActivities } =
    props;

  const role = useSelector((state: RootState) => state.auth.role);

  // console.log('in column', tasks)

  const sortedTasks = useMemo(() => {
    return tasks.slice().sort((a, b) => a.position - b.position);
  }, [tasks]);
  // Create an array of task IDs in the sorted order
  const taskIds = useMemo(() => {
    return sortedTasks.map((task) => task.id);
  }, [sortedTasks]);

  // console.log('sorted tasks', sortedTasks)
  // console.log('sorted ids', taskIds)

  const [openMenu, setOpenMenu] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const [openDeleteColumn, setOpenDeleteColumn] = useState(false);
  const { setNodeRef, transform, transition } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  // Confirm delete
  const handleOpenDeleteColumn = () => {
    setOpenDeleteColumn(true);
  };

  const handleCloseDeleteColumn = () => {
    setOpenDeleteColumn(false);
    setOpenMenu(false);
  };

  const handleConfirmDeleteColumn = () => {
    setOpenDeleteColumn(false);
    setOpenMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[250px] h-[500px] overflow-y-auto flex flex-col gap-4 bg-gradient-to-b from-cream-4 to-[rgba(255,255,255,0.1)] rounded-lg p-2"
      id={column.id.toString()}
    >
      <header className="sticky top-0 flex-between gap-2 font-bold">
        <div className="flex gap-2 items-center">
          {column.title}
          <p className="rounded-full bg-light-1 px-2">{tasks.length}</p>
        </div>
      </header>
      <div className="flex flex-col gap-2 overflow-auto">
        <SortableContext items={taskIds} id={column.status}>
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              selectTask={selectTask}
              taskActivities={taskActivities}
            />
          ))}
        </SortableContext>
      </div>

      {/* Only admin and board isPublic show button to add public task */}
      {column.title === "Open 🔘" && (role === "ADMIN" || !isPublic) && (
        <button
          className="flex-center py-1 gap-2 btn-primary w-full"
          onClick={openAddTask}
        >
          <FaPlus />
          Add a task
        </button>
      )}

      {/* Dialog confirm */}
      <Dialog open={openDeleteColumn}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete column{" "}
            <span className="text-red-500">{column.title}</span>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="btn-secondary border-gray-500"
            onClick={handleCloseDeleteColumn}
          >
            Cancel
          </button>
          <button
            className="btn-primary bg-red-500"
            onClick={handleConfirmDeleteColumn}
          >
            Agree
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ColumnContainer;