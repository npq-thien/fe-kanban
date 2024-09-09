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
  const {
    isPublic,
    column,
    tasks,
    selectTask,
    openAddTask,
    taskActivities,
  } = props;

  const role = useSelector((state: RootState) => state.auth.role);

  // console.log('in column', tasks)

  const [isEditTitle, setIsEditTitle] = useState(false);
  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

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
      className="w-[250px] h-full flex flex-col gap-4 bg-gradient-to-b from-cream-4 to-[rgba(255,255,255,0.1)] rounded-lg p-2"
      id={column.id.toString()}
    >
      <Menu
        open={openMenu}
        onClose={handleCloseMenu}
        anchorEl={anchorMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="border-b border-1 border-b-black mb-2">
          <p className="text-center">Column actions</p>
        </div>
        <div>
          <MenuItem>Copy column</MenuItem>
          <MenuItem>Move all cards in this list</MenuItem>
          <MenuItem onClick={handleOpenDeleteColumn}>
            <p className="text-red-500 font-semibold">Delete column</p>
          </MenuItem>
        </div>
      </Menu>
      <header
        // {...listeners}
        // {...attributes}
        className="sticky top-0 flex-between gap-2 font-bold"
      >
        <div
          className="flex gap-2 items-center"
          onClick={() => setIsEditTitle(true)}
        >
          {!isEditTitle ? (
            <>
              {column.title}
              <p className="rounded-full bg-light-1 px-2">{tasks.length}</p>
            </>
          ) : (
            <input
              className="rounded-md max-w-48 p-1 focus:border-blue-500 outline-none border"
              autoFocus
              value={column.title}
              onBlur={() => setIsEditTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditTitle(false);
              }}
            />
          )}
        </div>
        <button
          className="p-1 rounded-md hover:bg-light-3"
          onClick={(e) => {
            setAnchorMenu(e.currentTarget);
            setOpenMenu(true);
          }}
        >
          <BsThreeDots />
        </button>
      </header>
      <div className="flex flex-col gap-2 overflow-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
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
      {column.title === "Open🔘" && (role === "ADMIN" || !isPublic ) && (
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
