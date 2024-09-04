import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { generateId, generateUniqueId } from "../utils/helper";
import { Column, Id, Task, TaskActivity } from "../constants/types";
import ColumnContainer from "./ColumnContainer";
import {
  columnData,
  taskData,
  taskActivities as taskActivityData,
} from "../constants/data";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import TaskCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Alert, Snackbar } from "@mui/material";
import EditTaskModal from "./EditTaskModal";
import { BsKanbanFill } from "react-icons/bs";

const KanbanBoard = () => {
  const [placeholder, setPlaceholder] = useState<null | {
    width: number;
    height: number;
  }>(null);

  const [columns, setColumns] = useState<Column[]>(columnData);
  const [tasks, setTasks] = useState<Task[]>(taskData);
  const [taskActivities, setTaskActivities] =
    useState<TaskActivity[]>(taskActivityData);
  const [activeColumn, setActiveColumn] = useState<Column | null>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>();
  const [isAddingNewColumn, setIsAddingNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );

  // Task
  const selectTask = (task: Task) => {
    setSelectedTask(task);
    setOpenEdit(true);
  };

  // Task activities
  const handleClose = () => [setOpenEdit(false)];

  const handleAddingTaskActivity = (activityContent: string) => {
    const newTaskActivity: TaskActivity = {
      id: generateUniqueId("activity"),
      taskId: selectedTask?.id || "",
      user: "Thien Nguyen", // current user
      date: new Date(),
      content: activityContent,
    };

    setTaskActivities([newTaskActivity, ...taskActivities]);
  };

  //  Column
  const createNewColumn = (columnTitle: string) => {
    const newColumn: Column = {
      id: generateId(),
      title: columnTitle,
    };
    setColumns([...columns, newColumn]);
  };

  const handleCreateNewColumn = () => {
    if (newColumnTitle.trim() !== "") {
      createNewColumn(newColumnTitle);
      setIsAddingNewColumn(false);
      setNewColumnTitle("");
    }
  };

  const deleteColumn = (id: Id) => {
    setColumns(columns.filter((col) => col.id !== id));

    // Delete tasks in column
    const tasksInColumn = tasks.filter((task) => task.columnId !== id);
    setTasks(tasksInColumn);
  };

  const editColumnTitle = (id: Id, title: string) => {
    setColumns((prevCol) => {
      return prevCol.map((col) => (col.id === id ? { ...col, title } : col));
    });
  };

  // const onDragStart = (e: DragStartEvent) => {
  //   if (e.active.data.current?.type === "Column") {
  //     setActiveColumn(e.active.data.current.column);
  //     return;
  //   }

  //   if (e.active.data.current?.type === "Task") {
  //     setActiveTask(e.active.data.current.task);
  //     return;
  //   }
  // };

  // // DND column
  // const onDragEnd = (e: DragEndEvent) => {
  //   setActiveColumn(null);
  //   setActiveTask(null);

  //   const { active, over } = e;
  //   if (!over) return;
  //   const activeColumnId = active.id;
  //   const overColumnId = over.id;
  //   if (activeColumnId === overColumnId) return;

  //   if (
  //     active.data.current?.type === "Column" &&
  //     over.data.current?.type === "Column"
  //   ) {
  //     setColumns((columns) => {
  //       const activeColumnIndex = columns.findIndex(
  //         (col) => col.id === activeColumnId
  //       );
  //       const overColumnIndex = columns.findIndex(
  //         (col) => col.id === overColumnId
  //       );

  //       return arrayMove(columns, activeColumnIndex, overColumnIndex);
  //     });
  //   }
  // };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Column") {
      const draggedElement = document.getElementById(e.active.id.toString());
      if (draggedElement) {
        const { width, height } = draggedElement.getBoundingClientRect();
        // Width = 0 to assume there is a placeholder column has only height
        // it prevent the Board think that there are n + 1 columns in the SortableContext
        setPlaceholder({ width: 0, height });
      }
      setActiveColumn(e.active.data.current.column);
      return;
    }

    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    setPlaceholder(null); // Remove the placeholder column after dragging ends

    const { active, over } = e;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    if (
      active.data.current?.type === "Column" &&
      over.data.current?.type === "Column"
    ) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeColumnId
        );
        const overColumnIndex = columns.findIndex(
          (col) => col.id === overColumnId
        );

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    // console.log("Active task ID:", activeId, "Over ID:", overId);
    if (!isActiveTask) return;

    // Drop a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        // console.log("move task", activeIndex, overIndex)

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Drop a task over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        // console.log("move column", activeIndex)

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  // Task
  const createTask = (columnId: Id, taskTitle: string) => {
    const newTask: Task = {
      id: generateId(),
      columnId: columnId,
      title: taskTitle,
      description: "",
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: Id) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setOpenToast(true);
  };

  const editTaskTitle = (taskId: Id, newTaskTitle: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTaskTitle } : task
      )
    );
  };

  // Show toast
  const handleOpenToast = () => {
    setOpenToast(true);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <div className="overflow-x-auto min-h-screen w-full bg-gradient-to-r from-[#FEC362] via-[#ECE854] to-[#5B9DFF]">
      <nav className="w-full bg-gray-300 p-4 flex items-center justify-between gap-4 border-b-2 border-black bg-opacity-50">
        <Link to={"/"}>
          <div className="flex items-center p-1 gap-2 rounded-md hover:text-blue-600 animation-color">
            <BsKanbanFill />
            <p className="h3-bold">Kanban</p>
          </div>
        </Link>

        <Link to={"/login"}>
        <button className="hover:bg-dark-3 hover:text-white p-2 rounded-md">Login</button>
        </Link>
      </nav>
      <div className="flex gap-2 p-4">
        <Snackbar
          open={openToast}
          onClose={handleCloseToast}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert variant="filled" severity="success">
            Delete successfully!
          </Alert>
        </Snackbar>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext items={columnIds}>
            <div className="flex gap-4">
              {columns.map((col) => (
                <div key={col.id} id={col.id.toString()}>
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    editColumnTitle={editColumnTitle}
                    onShowToast={handleOpenToast}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                    selectTask={selectTask}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    editTaskTitle={editTaskTitle}
                    taskActivities={taskActivities}
                  />
                </div>
              ))}
              {/* Render the placeholder if dragging a column */}
              {placeholder && (
                <div
                  style={{
                    width: placeholder.width,
                    height: placeholder.height,
                    backgroundColor: "transparent",
                  }}
                />
              )}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                key={activeColumn.id}
                column={activeColumn}
                deleteColumn={deleteColumn}
                onShowToast={handleOpenToast}
                selectTask={selectTask}
                editColumnTitle={editColumnTitle}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                createTask={createTask}
                taskActivities={taskActivities}
              />
            )}

            {activeTask && (
              <TaskCard
                selectTask={selectTask}
                task={activeTask}
                taskActivities={taskActivities}
              />
            )}
          </DragOverlay>

          {/* {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  key={activeColumn.id}
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  onShowToast={handleOpenToast}
                  selectTask={selectTask}
                  editColumnTitle={editColumnTitle}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                  createTask={createTask}
                  taskActivities={taskActivities}
                />
              )}

              {activeTask && (
                <TaskCard
                  selectTask={selectTask}
                  task={activeTask}
                  taskActivities={taskActivities}
                />
              )}
            </DragOverlay>,
            document.body
          )} */}
        </DndContext>
        <div>
          {!isAddingNewColumn ? (
            <button
              className="btn-secondary border-2 border-orange-500"
              onClick={() => setIsAddingNewColumn(true)}
            >
              Add new column
            </button>
          ) : (
            // Demo new column
            <div className="w-[250px] bg-cream rounded-lg p-2">
              <input
                autoFocus
                className="w-full rounded-md p-1 border-2"
                type="text"
                placeholder="Enter column name"
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <div className="flex gap-4 mt-2">
                <button
                  className="flex-center py-1 gap-2 btn-primary bg-orange-500 w-full"
                  onClick={handleCreateNewColumn}
                >
                  <FaPlus />
                  Add column
                </button>
                <button
                  className="rounded-md p-2 hover:bg-light-3"
                  onClick={() => setIsAddingNewColumn(false)}
                >
                  <MdClose />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for editing task */}
      {selectedTask && (
        <EditTaskModal
          open={openEdit}
          task={selectedTask}
          taskActivities={taskActivities}
          addTaskActivity={handleAddingTaskActivity}
          handleClose={handleClose}
          editTaskTitle={editTaskTitle}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
