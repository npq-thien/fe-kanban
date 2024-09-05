import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import TaskCard from "./TaskCard";
import EditTaskModal from "./EditTaskModal";
import { toast } from "react-toastify";
import AddTaskModal from "./AddTaskModal";

type BoardProps = {
  name?: string;
};

const KanbanBoard = (props: BoardProps) => {
  const { name } = props;
  const [columns, setColumns] = useState<Column[]>(columnData);
  const [tasks, setTasks] = useState<Task[]>(taskData);
  const [taskActivities, setTaskActivities] =
    useState<TaskActivity[]>(taskActivityData);
  const [activeColumn, setActiveColumn] = useState<Column | null>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>();
  const [openEdit, setOpenEdit] = useState(false);
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );

  const notifyDeleteTask = (isSignedIn: boolean) => {
    if (isSignedIn)
      toast.success("Delete task successfully!", {
        position: "top-right",
      });
    else
      toast.error("Delete task failed!", {
        position: "top-right",
      });
  };

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
      dueDate: new Date(),
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: Id) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    notifyDeleteTask(true);
  };

  const editTaskTitle = (taskId: Id, newTaskTitle: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTaskTitle } : task
      )
    );
  };

  return (
    <div>
      <div className="px-4">
        <p className="text-xl font-semibold">{name}</p>
      </div>
      <div className="flex gap-2 p-4">
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
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                    selectTask={selectTask}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    editTaskTitle={editTaskTitle}
                    taskActivities={taskActivities}
                  />
                </div>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                key={activeColumn.id}
                column={activeColumn}
                deleteColumn={deleteColumn}
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
        </DndContext>

        {/* Adding column button */}
      </div>

      {/* Modal for editing task */}
      {/* {selectedTask && (
        <EditTaskModal
          open={openEdit}
          task={selectedTask}
          taskActivities={taskActivities}
          addTaskActivity={handleAddingTaskActivity}
          handleClose={handleClose}
          editTaskTitle={editTaskTitle}
        />
      )} */}

      {/* Modal add task */}
      {selectedTask && (
        <AddTaskModal
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
