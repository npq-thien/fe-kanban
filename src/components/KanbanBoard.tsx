import { useMemo, useState } from "react";

import { Column, Id, Task, TaskActivity } from "../constants/types";
import ColumnContainer from "./ColumnContainer";
import {
  columnData,
  taskActivities as taskActivityData,
} from "../constants/data";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";
import { toast } from "react-toastify";
import AddTaskModal from "./AddTaskModal";

type BoardProps = {
  name?: string;
  tasks: Task[];
};

const KanbanBoard = (props: BoardProps) => {
  const { name, tasks: taskData } = props;
  const [columns, setColumns] = useState<Column[]>(columnData);
  const [taskActivities, setTaskActivities] =
    useState<TaskActivity[]>(taskActivityData);

  const [activeColumn, setActiveColumn] = useState<Column | null>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>();
  const [openAddTask, setOpenAddTask] = useState(false);
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );


  // Task
  const openCreateTaskModal = () => {
    setOpenAddTask(true);
  };

  const createTask = () => {};


  //  TODO: CAN DELETE TASK CANCEL COLUMN
  // const deleteTask = (taskId: Id) => {
  //   setTasks(tasks.filter((task) => task.id !== taskId));
  //   notifyDeleteTask(true);
  // };

  // const editTaskTitle = (taskId: Id, newTaskTitle: string) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task.id === taskId ? { ...task, title: newTaskTitle } : task
  //     )
  //   );
  // };
  const selectTask = (task: Task) => {
    setSelectedTask(task);
    // setOpenAddTask(true);
  };

  // Task activities
  const handleClose = () => [setOpenAddTask(false)];

  // const handleAddingTaskActivity = (activityContent: string) => {
  //   const newTaskActivity: TaskActivity = {
  //     id: generateUniqueId("activity"),
  //     taskId: selectedTask?.id || "",
  //     user: "Thien Nguyen", // current user
  //     date: new Date(),
  //     content: activityContent,
  //   };

  //   setTaskActivities([newTaskActivity, ...taskActivities]);
  // };

  //  Column
  const deleteColumn = (id: Id) => {};

  const editColumnTitle = (id: Id, title: string) => {
    setColumns((prevCol) => {
      return prevCol.map((col) => (col.id === id ? { ...col, title } : col));
    });
  };

  // ---------------------------------------------DND LOGIC
  // const onDragStart = (e: DragStartEvent) => {
  //   if (e.active.data.current?.type === "Column") {
  //     return;
  //   }

  //   if (e.active.data.current?.type === "Task") {
  //     setActiveTask(e.active.data.current.task);
  //     return;
  //   }
  // };

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

  // const onDragOver = (e: DragOverEvent) => {
  //   const { active, over } = e;
  //   if (!over) return;

  //   const activeId = active.id;
  //   const overId = over.id;

  //   if (activeId === overId) return;

  //   const isActiveTask = active.data.current?.type === "Task";
  //   const isOverTask = over.data.current?.type === "Task";

  //   // console.log("Active task ID:", activeId, "Over ID:", overId);
  //   if (!isActiveTask) return;

  //   // Drop a task over another task
  //   if (isActiveTask && isOverTask) {
  //     setTasks((tasks) => {
  //       const activeIndex = tasks.findIndex((task) => task.id === activeId);
  //       const overIndex = tasks.findIndex((task) => task.id === overId);

  //       tasks[activeIndex].columnId = tasks[overIndex].columnId;
  //       // console.log("move task", activeIndex, overIndex)

  //       return arrayMove(tasks, activeIndex, overIndex);
  //     });
  //   }

  //   // Drop a task over a column
  //   const isOverAColumn = over.data.current?.type === "Column";
  //   if (isActiveTask && isOverAColumn) {
  //     setTasks((tasks) => {
  //       const activeIndex = tasks.findIndex((task) => task.id === activeId);
  //       // console.log("move column", activeIndex)

  //       tasks[activeIndex].columnId = overId;
  //       return arrayMove(tasks, activeIndex, activeIndex);
  //     });
  //   }
  // };
  // ---------------------------------------------------------------------------

  return (
    <div>
      <div className="px-4">
        <p className="text-xl font-semibold">{name}</p>
      </div>
      <div className="flex gap-2 p-4">
        <DndContext sensors={sensors}>
          <SortableContext items={columnIds}>
            <div className="flex gap-4">
              {columns.map((col) => (
                <div key={col.id} id={col.id.toString()}>
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    editColumnTitle={editColumnTitle}
                    tasks={taskData.filter((task: Task) => task.status === col.status)}
                    openAddTask={openCreateTaskModal}
                    selectTask={selectTask}
                    createTask={createTask}
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
                openAddTask={openCreateTaskModal}
                tasks={taskData.filter((task) => task.status === activeColumn.id)}
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
      </div>

      {/* Modal for editing task */}
      {/* {selectedTask && (
        <EditTaskModal
          open={openAddTask}
          task={selectedTask}
          taskActivities={taskActivities}
          addTaskActivity={handleAddingTaskActivity}
          handleClose={handleClose}
          editTaskTitle={editTaskTitle}
        />
      )} */}

      {/* Modal add task */}
      <AddTaskModal open={openAddTask} handleClose={handleClose} />
    </div>
  );
};

export default KanbanBoard;
